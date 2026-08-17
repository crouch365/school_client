import { http, HttpResponse } from 'msw';

import { counters, users } from '../db';
import { isRole, requireUser } from '../helpers';
import { API_URL } from '@/shared/config/env';

const listUsers = () => users.map(({ password, ...user }) => user);

export const userHandlers = [
  http.get(`${API_URL}/users`, ({ request }) => {
    const user = requireAdmin(request);
    if (!user) return forbidden();

    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
    const limit = Math.min(100, Number(url.searchParams.get('limit')) || 20);

    const all = listUsers();
    const start = (page - 1) * limit;
    const items = all.slice(start, start + limit);

    return HttpResponse.json({ items, total: all.length, page, limit });
  }),

  http.post(`${API_URL}/users`, async ({ request }) => {
    const user = requireAdmin(request);
    if (!user) return forbidden();

    const body = (await request.json()) as {
      name?: string;
      lastName?: string;
      role?: 'ADMIN' | 'TEACHER' | 'STUDENT';
      className?: string | null;
    };

    if (!body.name || !body.lastName || !body.role) {
      return HttpResponse.json(
        { message: 'Некорректные данные: нужны name, lastName, role' },
        { status: 400 },
      );
    }

    const id = ++counters.user;
    const email = `${body.name}.${body.lastName}@school.local`.toLowerCase();
    const plainPassword = `School!${Math.floor(1000 + Math.random() * 9000)}`;

    users.push({
      id,
      name: body.name,
      lastName: body.lastName,
      email,
      password: plainPassword,
      role: body.role,
      className: body.role === 'STUDENT' ? (body.className ?? null) : null,
    });

    return HttpResponse.json(
      {
        id,
        name: body.name,
        lastName: body.lastName,
        email,
        plainPassword,
        role: body.role,
        className: body.role === 'STUDENT' ? (body.className ?? null) : null,
      },
      { status: 201 },
    );
  }),

  http.put(`${API_URL}/users/:id`, async ({ request, params }) => {
    const user = requireAdmin(request);
    if (!user) return forbidden();

    const id = Number(params.id);
    const target = users.find((candidate) => candidate.id === id);
    if (!target) return notFound('Пользователь не найден');

    const body = (await request.json()) as Record<string, unknown>;
    if (typeof body.name === 'string') target.name = body.name;
    if (typeof body.lastName === 'string') target.lastName = body.lastName;
    if (body.role === 'ADMIN' || body.role === 'TEACHER' || body.role === 'STUDENT') {
      target.role = body.role;
      target.className =
        body.role === 'STUDENT' ? ((body.className as string | null) ?? null) : null;
    } else if (typeof body.className === 'string' || body.className === null) {
      target.className = body.className;
    }

    const { password: _password, ...safe } = target;
    return HttpResponse.json(safe);
  }),

  http.delete(`${API_URL}/users/:id`, ({ request, params }) => {
    const user = requireAdmin(request);
    if (!user) return forbidden();

    const id = Number(params.id);
    const index = users.findIndex((candidate) => candidate.id === id);
    if (index === -1) return notFound('Пользователь не найден');

    const [removed] = users.splice(index, 1);
    return HttpResponse.json({
      message: 'Пользователь успешно удалён',
      name: removed.name,
    });
  }),
];

const requireAdmin = (request: Request) => {
  const user = requireUser(request);
  return isRole(user, 'ADMIN') ? user : null;
};

const forbidden = () => HttpResponse.json({ message: 'Недостаточно прав' }, { status: 403 });

const notFound = (message: string) => HttpResponse.json({ message }, { status: 404 });
