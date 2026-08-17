import type { JwtPayloadShape } from '@/shared/lib';

const base64UrlEncode = (value: unknown): string => {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return window.btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const HEADER = base64UrlEncode({ alg: 'HS256', typ: 'JWT' });

/**
 * Генерирует структуру JWT с валидным payload.
 * Подпись фейковая — клиент её не проверяет (это делает сервер).
 */
export const signMockToken = (payload: JwtPayloadShape): string =>
  `${HEADER}.${base64UrlEncode(payload)}.mock-signature`;

/** Демо-аккаунты для быстрого переключения ролей в dev-режиме. */
export const DEMO_PAYLOADS: Record<'ADMIN' | 'TEACHER' | 'STUDENT', JwtPayloadShape> = {
  ADMIN: {
    id: 1,
    email: 'qwe.edfffff@school.local',
    role: 'ADMIN',
    className: null,
  },
  TEACHER: {
    id: 2,
    email: 'teacher1@school.local',
    role: 'TEACHER',
    className: null,
  },
  STUDENT: {
    id: 4,
    email: 'student1@school.local',
    role: 'STUDENT',
    className: '9А',
  },
};
