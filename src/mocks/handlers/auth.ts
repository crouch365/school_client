import { http, HttpResponse } from 'msw';

import { decodeJwt } from '@/shared/lib';
import { API_URL } from '@/shared/config/env';

import { users } from '../db';
import { signMockToken } from '../token';
import { requireUser } from '../helpers';

export const authHandlers = [
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const user = users.find(
      (candidate) =>
        candidate.email === body.email &&
        candidate.password === body.password,
    );

    if (!user) {
      return HttpResponse.json(
        { message: 'Неверный email или пароль' },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      token: signMockToken({
        id: user.id,
        email: user.email,
        role: user.role,
        className: user.className,
      }),
    });
  }),

  http.get(`${API_URL}/auth/check`, ({ request }) => {
    const token = readBearerToken(request);
    if (!token) {
      return HttpResponse.json(
        { message: 'Не передан токен авторизации' },
        { status: 401 },
      );
    }

    const payload = decodeJwt(token);
    if (!payload) {
      return HttpResponse.json(
        { message: 'Токен недействителен' },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      token,
      user: {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        className: payload.className ?? null,
      },
    });
  }),
];

const readBearerToken = (request: Request): string | null => {
  const header = request.headers.get('Authorization') ?? '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
};

void requireUser;