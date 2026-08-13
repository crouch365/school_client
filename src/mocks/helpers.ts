import { decodeJwt, type JwtPayloadShape } from '@/shared/lib';

export const readToken = (request: Request): string | null => {
  const header = request.headers.get('Authorization') ?? '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
};

/** Декодирует пользователя из Authorization, либо null (401). */
export const requireUser = (request: Request): JwtPayloadShape | null => {
  const token = readToken(request);
  if (!token) return null;
  return decodeJwt(token);
};

export const isRole = (
  user: JwtPayloadShape | null,
  ...roles: JwtPayloadShape['role'][]
): user is JwtPayloadShape => user !== null && roles.includes(user.role);