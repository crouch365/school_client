import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface ErrorBody {
  message?: string;
}

/**
 * Извлекает человекочитаемое сообщение из ошибки RTK Query
 * (FetchBaseQueryError / SerializedError / примитивы).
 */
export const getApiErrorMessage = (error: unknown): string => {
  if (!error) return 'Неизвестная ошибка';

  if (typeof error === 'object' && 'status' in error) {
    const fetchError = error as FetchBaseQueryError;
    const body = fetchError.data as ErrorBody | undefined;
    if (body?.message) return body.message;
    if (typeof fetchError.status === 'number') {
      return `Ошибка запроса (${fetchError.status})`;
    }
    if (fetchError.status === 'FETCH_ERROR') {
      return 'Сервер недоступен. Проверьте подключение.';
    }
    return 'Ошибка сети';
  }

  if (typeof error === 'object' && 'message' in error) {
    const serialized = error as SerializedError;
    if (serialized.message) return serialized.message;
  }

  return 'Неизвестная ошибка';
};
