import { http, HttpResponse } from 'msw';

import { API_URL } from '@/shared/config/env';

import { accesses, attempts, counters, questions, tests } from '../db';
import { isRole, requireUser } from '../helpers';

const forbidden = (message = 'Недостаточно прав') =>
  HttpResponse.json({ message }, { status: 403 });

const notFound = (message: string) =>
  HttpResponse.json({ message }, { status: 404 });

const badRequest = (message: string) =>
  HttpResponse.json({ message }, { status: 400 });

const testSummary = (testId: number) => {
  const test = tests.find((candidate) => candidate.id === testId);
  if (!test) return undefined;
  return { id: test.id, title: test.title, subject: test.subject };
};

export const resultHandlers = [
  /* ============ POST /results — сдать тест ============ */
  http.post(`${API_URL}/results`, async ({ request }) => {
    const user = requireUser(request);
    if (!isRole(user, 'STUDENT')) return forbidden();

    const body = (await request.json()) as {
      testId?: number;
      answers?: { questionId: number; optionIndex: number }[];
    };

    const test = tests.find((candidate) => candidate.id === Number(body.testId));
    if (!test) return notFound('Тест не найден');
    if (!user.className) return forbidden('Вам не назначен класс');

    const hasAccess = accesses.some(
      (access) =>
        access.testId === test.id &&
        access.className === user.className &&
        access.isOpen,
    );
    if (!hasAccess) {
      return forbidden('Доступ к этому тесту закрыт или не назначен вашему классу');
    }

    const answers = body.answers ?? [];
    let attempt = attempts.find(
      (candidate) =>
        candidate.studentId === user.id && candidate.testId === test.id,
    );

    if (!attempt) {
      attempt = {
        id: ++counters.attempt,
        studentId: user.id,
        testId: test.id,
        startedAt: new Date().toISOString(),
        finishedAt: null,
        status: 'IN_PROGRESS',
        score: null,
        totalQuestions: null,
        answers: null,
      };
      attempts.push(attempt);
    }

    if (attempt.status === 'COMPLETED') {
      return badRequest('Тест уже сдан, повторная попытка недоступна');
    }

    const elapsedSeconds = Math.floor(
      (Date.now() - new Date(attempt.startedAt).getTime()) / 1000,
    );
    if (elapsedSeconds > test.timeLimit) {
      attempt.status = 'EXPIRED';
      return badRequest(
        `Время на выполнение теста истекло (${elapsedSeconds}s > ${test.timeLimit}s)`,
      );
    }

    const testQuestions = questions.filter((question) => question.testId === test.id);
    if (answers.length !== testQuestions.length) {
      return badRequest(
        'Количество ответов не совпадает с количеством вопросов',
      );
    }

    const questionMap = new Map(testQuestions.map((question) => [question.id, question]));
    let score = 0;
    const normalizedAnswers: number[] = [];

    for (const answer of answers) {
      const question = questionMap.get(answer.questionId);
      if (!question) {
        return badRequest(`Вопрос id=${answer.questionId} не найден в тесте`);
      }
      if (
        !Number.isInteger(answer.optionIndex) ||
        answer.optionIndex < 0 ||
        answer.optionIndex >= question.options.length
      ) {
        return badRequest(
          `Некорректный optionIndex для вопроса id=${answer.questionId}`,
        );
      }
      if (answer.optionIndex === question.correctOptionIndex) score++;
      normalizedAnswers.push(answer.optionIndex);
    }

    attempt.status = 'COMPLETED';
    attempt.finishedAt = new Date().toISOString();
    attempt.score = score;
    attempt.totalQuestions = testQuestions.length;
    attempt.answers = normalizedAnswers;

    return HttpResponse.json({
      id: attempt.id,
      score,
      totalQuestions: testQuestions.length,
      message: 'Результат сохранён',
    });
  }),

  /* ============ GET /results/my — мои результаты ============ */
  http.get(`${API_URL}/results/my`, ({ request }) => {
    const user = requireUser(request);
    if (!isRole(user, 'STUDENT')) return forbidden();

    const myAttempts = attempts
      .filter((attempt) => attempt.studentId === user.id)
      .map((attempt) => ({
        ...attempt,
        test: testSummary(attempt.testId),
      }))
      .sort((a, b) =>
        (b.finishedAt ?? '').localeCompare(a.finishedAt ?? ''),
      );

    return HttpResponse.json(myAttempts);
  }),

  /* ============ GET /results/test/:testId — попытки по тесту ============ */
  http.get(`${API_URL}/results/test/:testId`, ({ request, params }) => {
    const user = requireUser(request);
    if (!isRole(user, 'ADMIN', 'TEACHER')) return forbidden();

    const testId = Number(params.testId);
    const test = tests.find((candidate) => candidate.id === testId);
    if (!test) return notFound('Тест не найден');
    if (user.role === 'TEACHER' && test.teacherId !== user.id) {
      return forbidden('Учитель не владеет этим тестом');
    }

    const testAttempts = attempts
      .filter((attempt) => attempt.testId === testId)
      .map((attempt) => ({ ...attempt, test: testSummary(attempt.testId) }))
      .sort((a, b) =>
        (b.finishedAt ?? '').localeCompare(a.finishedAt ?? ''),
      );

    return HttpResponse.json(testAttempts);
  }),
];