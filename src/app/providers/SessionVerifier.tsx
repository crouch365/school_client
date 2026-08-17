import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from './store';
import { selectSessionToken, sessionActions, useCheckAuthQuery } from '@/entities/user';

/**
 * Один валидационный запрос /auth/check при старте приложения.
 *
 * - Успех: подтверждает роль данными с сервера (а не из JWT) ->
 *   dispatch(sessionUserSet). Роль теперь берётся из ответа сервера.
 * - 401: сбрасываем токен (это делает baseApi) и чистим сессию;
 *   редирект на /login делает RequireAuth.
 * Сетевые ошибки (FETCH_ERROR) НЕ разлогинивают — сервер может быть
 * временно недоступен.
 */
export const SessionVerifier = () => {
  const token = useAppSelector(selectSessionToken);
  const dispatch = useAppDispatch();
  const { data, isError, error } = useCheckAuthQuery(undefined, { skip: !token });

  useEffect(() => {
    if (data) {
      dispatch(sessionActions.sessionUserSet(data.user));
    }
    if (isError && error && 'status' in error && error.status === 401) {
      dispatch(sessionActions.sessionCleared());
    }
  }, [dispatch, data, isError, error]);

  return null;
};
