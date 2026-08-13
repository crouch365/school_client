import { http, HttpResponse } from 'msw';

import { API_URL } from '@/shared/config/env';

import { accesses, counters, teacherClasses, tests } from '../db';
import { isRole, requireUser } from '../helpers';

const forbidden = (message = 'Недостаточно прав') =>
  HttpResponse.json({ message }, { status: 403 });

const notFound = (message: string) =>
  HttpResponse.json({ message }, { status: 404 });

const resolveAccessBody = async (request: Request) => {
  const body = (await request.json()) as {
    testId?: number;
    className?: string;
  };
  return {
    testId: Number(body.testId),
    className: String(body.className ?? '').trim(),
  };
};

const canManage = (
  payload: { role: string; id: number },
  test: { teacherId: number },
) =>
  payload.role === 'ADMIN' ||
  (payload.role === 'TEACHER' && test.teacherId === payload.id);

const setup = {
  grant: {
    message: (className: string) => `Доступ для класса ${className} открыт`,
    apply: (access?: { isOpen: boolean }) =>
      access === undefined || !access.isOpen,
  },
  revoke: {
    message: (className: string) => `Доступ для класса ${className} закрыт`,
    apply: (access?: { isOpen: boolean }) => access !== undefined && access.isOpen,
  },
};

export const accessHandlers = [
  http.put(`${API_URL}/access/grant`, async ({ request }) => {
    return handleAccess('grant', request);
  }),

  http.put(`${API_URL}/access/revoke`, async ({ request }) => {
    return handleAccess('revoke', request);
  }),
];

const handleAccess = async (
  kind: 'grant' | 'revoke',
  request: Request,
): Promise<Response> => {
  const payload = requireUser(request);
  if (!payload) return forbidden('Не передан токен авторизации');
  if (!isRole(payload, 'ADMIN', 'TEACHER')) return forbidden();

  const { testId, className } = await resolveAccessBody(request);
  if (!Number.isInteger(testId) || !className) {
    return HttpResponse.json(
      { message: 'Не переданы testId или className' },
      { status: 400 },
    );
  }

  const test = tests.find((candidate) => candidate.id === testId);
  if (!test) return notFound('Тест не найден');
  if (!canManage(payload, test)) return forbidden('Учитель не владеет тестом');

  if (kind === 'grant' && payload.role === 'TEACHER') {
    const teachesClass = teacherClasses.some(
      (link) => link.teacherId === payload.id && link.className === className,
    );
    if (!teachesClass) return forbidden('Учитель не ведёт этот класс');
  }

  const existing = accesses.find(
    (access) => access.testId === testId && access.className === className,
  );

  if (existing) {
    if (kind === 'grant') {
      existing.isOpen = true;
      existing.openedAt = new Date().toISOString();
      existing.closedAt = null;
    } else {
      existing.isOpen = false;
      existing.closedAt = new Date().toISOString();
    }
  } else {
    accesses.push({
      id: ++counters.accessId,
      testId,
      className,
      isOpen: kind === 'grant',
      openedAt: kind === 'grant' ? new Date().toISOString() : null,
      closedAt: kind === 'grant' ? null : new Date().toISOString(),
    });
  }

  return HttpResponse.json({ message: setup[kind].message(className) });
};