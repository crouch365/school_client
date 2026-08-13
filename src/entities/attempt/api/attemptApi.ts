import type { SubmitAttemptPayload, SubmitAttemptResult, TestAttemptDto } from '../model/types';
import { baseApi } from '@/shared/api/baseApi';

export const attemptApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    submitAttempt: build.mutation<SubmitAttemptResult, SubmitAttemptPayload>({
      query: (body) => ({ url: '/results', method: 'POST', body }),
      invalidatesTags: [
        { type: 'Attempt', id: 'MY' },
        { type: 'Attempt', id: 'LIST' },
      ],
    }),
    getMyAttempts: build.query<TestAttemptDto[], void>({
      query: () => '/results/my',
      providesTags: [{ type: 'Attempt', id: 'MY' }],
    }),
    /**
     * Таблица результатов учителя по конкретному тесту.
     * ВАЖНО: бэкенд ещё в разработке. Ожидаемый контракт —
     * GET /api/results/test/:testId -> TestAttemptDto[].
     * Если маршрут на сервере назовут иначе — правится только эта строка.
     */
    getAttemptsByTest: build.query<TestAttemptDto[], number>({
      query: (testId) => `/results/test/${testId}`,
      providesTags: (_result, _error, testId) => [{ type: 'Attempt', id: `TEST_${testId}` }],
    }),
  }),
});

export const { useSubmitAttemptMutation, useGetMyAttemptsQuery, useGetAttemptsByTestQuery } =
  attemptApi;
