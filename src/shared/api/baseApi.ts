import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

import { sessionActions } from '@/entities/user';
import { API_URL } from '@/shared/config/env';
import { storage } from '@/shared/lib';
import { uiActions } from '@/shared/ui/model/uiSlice';

interface ErrorBody {
  message?: string;
}

const getErrorMessage = (error: FetchBaseQueryError): string => {
  if (typeof error.data === 'object' && error.data !== null) {
    const body = error.data as ErrorBody;
    if (typeof body.message === 'string' && body.message.length > 0) {
      return body.message;
    }
  }
  if (typeof error.status === 'number') {
    return `Ошибка запроса (${error.status})`;
  }
  return 'Сервер недоступен. Проверьте подключение.';
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  // важно: cookies поедут (задел под будущий refresh-токен)
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = storage.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * Включить, когда бэкенд добавит /auth/refresh.
 * Пока false — 401 сбрасывает сессию без повторного запроса.
 */
const REFRESH_SUPPORTED = false;

/**
 * Глобальная обёртка над fetch-запросами:
 *  - 401 (кроме /auth/login) -> пробуем refresh; если его нет/не удался — сбрасываем сессию.
 *    РЕДИРЕКТА здесь нет: сброс токена видит RequireAuth и сам делает <Navigate to="/login">.
 *  - 403 -> глобальная модалка «Нет доступа к данному ресурсу».
 */
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const isLoginRequest = typeof args === 'object' && args.url === '/auth/login';

    // 401 — пробуем refresh (когда бэк добавит /auth/refresh)
    if (result.error.status === 401 && !isLoginRequest) {
      if (REFRESH_SUPPORTED) {
        const refreshResult = await rawBaseQuery(
          { url: '/auth/refresh', method: 'POST' }, // или GET — как решит бэк
          api,
          extraOptions,
        );

        if (
          refreshResult.data &&
          typeof refreshResult.data === 'object' &&
          'token' in refreshResult.data
        ) {
          const newToken = (refreshResult.data as { token: string }).token;
          storage.setToken(newToken);
          // повторяем исходный запрос
          result = await rawBaseQuery(args, api, extraOptions);
          return result;
        }
      }

      // Refresh не удался / его ещё нет
      storage.clearToken();
      api.dispatch(sessionActions.sessionCleared());
    }

    if (result.error.status === 403) {
      api.dispatch(uiActions.accessDeniedOpened(getErrorMessage(result.error)));
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Test', 'Question', 'Attempt', 'Access', 'Teacher'],
  endpoints: () => ({}),
});
