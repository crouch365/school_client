export interface JwtPayloadShape {
  id: number;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  className?: string | null;
  exp?: number;
  iat?: number;
}

/**
 * Декодирует base64url-segment JWT payload без проверки подписи.
 * На клиенте подпись не проверяется — это делает сервер.
 */
const base64UrlToJson = <T>(segment: string): T | null => {
  try {
    const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const json = decodeURIComponent(
      window
        .atob(padded)
        .split('')
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    );
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
};

export const decodeJwt = <T extends JwtPayloadShape>(token: string): T | null => {
  const [, payload] = token.split('.');
  if (!payload) return null;

  const decoded = base64UrlToJson<T>(payload);
  if (!decoded) return null;

  // Проверка срока жизни токена по exp (секунды с эпохи).
  // Просроченный токен считаем невалидным/отсутствующим.
  if (decoded.exp && Date.now() >= decoded.exp * 1000) {
    return null;
  }

  return decoded;
};
