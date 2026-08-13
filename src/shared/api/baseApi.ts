import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';

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
  prepareHeaders: (headers) => {
    const token = storage.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * Глобальная обёртка над fetch-запросами:
 *  - 401 (кроме /auth/login) -> сброс токена + редирект на /login;
 *  - 403 -> глобальная модалка «Нет доступа к данному ресурсу».
 */
const baseQueryWithInterceptors: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const isLoginRequest = typeof args === 'object' && args.url === '/auth/login';

    if (result.error.status === 401 && !isLoginRequest) {
      storage.clearToken();
      window.location.assign('/login');
      return result;
    }

    if (result.error.status === 403) {
      api.dispatch(uiActions.accessDeniedOpened(getErrorMessage(result.error)));
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithInterceptors,
  tagTypes: ['User', 'Test', 'Question', 'Attempt', 'Access', 'Teacher'],
  endpoints: () => ({}),
});
