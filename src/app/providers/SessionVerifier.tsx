import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from './store';
import { selectSessionToken, sessionActions, useCheckAuthQuery } from '@/entities/user';

/**
 * Один валидационный запрос /auth/check при старте приложения.
 *
 * 401 уже обрабатывается глобально в baseApi (очистка токена + редирект на /login),
 * здесь лишь синхронно чистим сессию в сторе. Сетевые ошибки (FETCH_ERROR)
 * НЕ разлогинивают — сервер может быть временно недоступен.
 */
export const SessionVerifier = () => {
  const token = useAppSelector(selectSessionToken);
  const dispatch = useAppDispatch();
  const { isError, error } = useCheckAuthQuery(undefined, { skip: !token });

  useEffect(() => {
    if (isError && error && 'status' in error && error.status === 401) {
      dispatch(sessionActions.sessionCleared());
    }
  }, [dispatch, isError, error]);

  return null;
};
