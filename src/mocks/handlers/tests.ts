import { http, HttpResponse } from 'msw';

import { accesses, counters, questions, teacherSubjects, tests } from '../db';
import { isRole, requireUser } from '../helpers';
import { API_URL } from '@/shared/config/env';

const forbidden = (message = 'Недостаточно прав') =>
  HttpResponse.json({ message }, { status: 403 });

const notFound = (message: string) => HttpResponse.json({ message }, { status: 404 });

const badRequest = (message: string) => HttpResponse.json({ message }, { status: 400 });

const fullQuestions = (testId: number) =>
  questions.filter((question) => question.testId === testId);

const safeQuestions = (testId: number) =>
  fullQuestions(testId).map(({ id, text, options }) => ({ id, text, options }));

export const testHandlers = [
  /* ================= GET /tests ================= */
  http.get(`${API_URL}/tests`, ({ request }) => {
    const user = requireUser(request);
    if (!user) return forbidden('Не передан токен авторизации');

    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
    const limit = Math.max(1, Number(url.searchParams.get('limit')) || 20);

    let items: typeof tests = [];

    if (user.role === 'STUDENT') {
      if (!user.className) {
        return HttpResponse.json({ items: [], total: 0, page, limit });
      }

      const openTestIds = new Set(
        accesses
          .filter((access) => access.className === user.className && access.isOpen)
          .map((access) => access.testId),
      );

      items = tests
        .filter((test) => openTestIds.has(test.id))
        .map((test) => ({ ...test, questions: safeQuestions(test.id) }));
    } else {
      const ownedTests =
        user.role === 'TEACHER' ? tests.filter((test) => test.teacherId === user.id) : tests;
      items = ownedTests.map((test) => ({ ...test, questions: fullQuestions(test.id) }));
    }

    const start = (page - 1) * limit;

    return HttpResponse.json({
      items: items.slice(start, start + limit),
      total: items.length,
      page,
      limit,
    });
  }),

  /* ================= GET /tests/:testId ================= */
  http.get(`${API_URL}/tests/:testId`, ({ request, params }) => {
    const user = requireUser(request);
    if (!user) return forbidden('Не передан токен авторизации');

    const test = tests.find((candidate) => candidate.id === Number(params.testId));
    if (!test) return notFound('Тест не найден');

    if (user.role === 'STUDENT') {
      if (!user.className) {
        return forbidden('Вам не назначен класс');
      }
      const hasAccess = accesses.some(
        (access) =>
          access.testId === test.id && access.className === user.className && access.isOpen,
      );
      if (!hasAccess) {
        return forbidden('Доступ к этому тесту закрыт или не назначен вашему классу');
      }
      return HttpResponse.json({
        id: test.id,
        teacherId: test.teacherId,
        subject: test.subject,
        title: test.title,
        description: test.description,
        timeLimit: test.timeLimit,
        questions: safeQuestions(test.id),
      });
    }

    if (user.role === 'TEACHER' && test.teacherId !== user.id) {
      return forbidden('Учитель не владеет этим тестом');
    }

    return HttpResponse.json({ ...test, questions: fullQuestions(test.id) });
  }),

  /* ================= POST /tests ================= */
  http.post(`${API_URL}/tests`, async ({ request }) => {
    const user = requireUser(request);
    if (!isRole(user, 'ADMIN', 'TEACHER')) return forbidden();

    const body = (await request.json()) as {
      subject?: string;
      title?: string;
      description?: string | null;
      timeLimit?: number;
      teacherId?: number;
    };

    if (!body.subject || !body.title || !body.timeLimit || body.timeLimit <= 0) {
      return badRequest('Некорректные данные теста');
    }

    const teacherId = user.role === 'ADMIN' ? (body.teacherId ?? user.id) : user.id;

    if (user.role === 'TEACHER') {
      const teaches = teacherSubjects.some(
        (link) => link.teacherId === user.id && link.subject === body.subject,
      );
      if (!teaches) return forbidden('Учитель не ведёт этот предмет');
    }

    const test = {
      id: ++counters.test,
      teacherId,
      subject: body.subject,
      title: body.title,
      description: body.description ?? null,
      timeLimit: body.timeLimit,
    };
    tests.push(test);

    return HttpResponse.json(test, { status: 201 });
  }),

  /* ================= PUT /tests/:id ================= */
  http.put(`${API_URL}/tests/:id`, async ({ request, params }) => {
    const user = requireUser(request);
    if (!isRole(user, 'ADMIN', 'TEACHER')) return forbidden();

    const test = tests.find((candidate) => candidate.id === Number(params.id));
    if (!test) return notFound('Тест не найден');
    if (user.role === 'TEACHER' && test.teacherId !== user.id) return forbidden();

    const body = (await request.json()) as Record<string, unknown>;
    if (typeof body.subject === 'string') test.subject = body.subject;
    if (typeof body.title === 'string') test.title = body.title;
    if (typeof body.description === 'string' || body.description === null) {
      test.description = body.description;
    }
    if (typeof body.timeLimit === 'number' && body.timeLimit > 0) {
      test.timeLimit = body.timeLimit;
    }

    return HttpResponse.json(test);
  }),

  /* ================= POST /tests/:testId/questions ================= */
  http.post(`${API_URL}/tests/:testId/questions`, async ({ request, params }) => {
    const user = requireUser(request);
    if (!isRole(user, 'ADMIN', 'TEACHER')) return forbidden();

    const test = tests.find((candidate) => candidate.id === Number(params.testId));
    if (!test) return notFound('Тест не найден');
    if (user.role === 'TEACHER' && test.teacherId !== user.id) return forbidden();

    const body = (await request.json()) as {
      text?: string;
      options?: string[];
      correctOptionIndex?: number;
    };

    if (!body.text || !Array.isArray(body.options) || body.options.length < 2) {
      return badRequest('Нужны text и минимум 2 варианта ответа');
    }
    if (
      typeof body.correctOptionIndex !== 'number' ||
      body.correctOptionIndex < 0 ||
      body.correctOptionIndex >= body.options.length
    ) {
      return badRequest('correctOptionIndex вне границ options');
    }

    const question = {
      id: ++counters.question,
      testId: test.id,
      text: body.text,
      options: body.options.map((option) => option.trim()),
      correctOptionIndex: body.correctOptionIndex,
    };
    questions.push(question);

    return HttpResponse.json(question, { status: 201 });
  }),

  /* ================= DELETE /tests/:testId/:questionId ================= */
  http.delete(`${API_URL}/tests/:testId/:questionId`, ({ request, params }) => {
    const user = requireUser(request);
    if (!isRole(user, 'ADMIN', 'TEACHER')) return forbidden();

    const test = tests.find((candidate) => candidate.id === Number(params.testId));
    if (!test) return notFound('Тест не найден');
    if (user.role === 'TEACHER' && test.teacherId !== user.id) return forbidden();

    const index = questions.findIndex(
      (question) => question.id === Number(params.questionId) && question.testId === test.id,
    );
    if (index === -1) return notFound('Вопрос не найден');

    questions.splice(index, 1);
    return HttpResponse.json({ message: 'Вопрос успешно удален' });
  }),
];
