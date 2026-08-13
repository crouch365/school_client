import type { SessionUser, UserRole } from './types';
import { decodeJwt } from '@/shared/lib';

/**
 * Собирает SessionUser из JWT-токена.
 * Возвращает null, если токен не читается (тогда его стоит отбросить).
 *
 * Единственная точка сборки SessionUser из декодированного токена —
 * используются и в sessionSlice, и в LoginForm, и в dev-тулбаре моков.
 */
export const buildSessionUser = (token: string): SessionUser | null => {
  const payload = decodeJwt(token);
  if (!payload) return null;

  return {
    id: payload.id,
    email: payload.email,
    role: payload.role as UserRole,
    className: payload.className ?? null,
  };
};
