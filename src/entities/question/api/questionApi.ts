import type { CreateQuestionPayload, QuestionDto } from '../model/types';
import { baseApi } from '@/shared/api/baseApi';

export const questionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    addQuestion: build.mutation<QuestionDto, { testId: number; payload: CreateQuestionPayload }>({
      query: ({ testId, payload }) => ({
        url: `/tests/${testId}/questions`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'Test' }],
    }),
    deleteQuestion: build.mutation<{ message: string }, { testId: number; questionId: number }>({
      query: ({ testId, questionId }) => ({
        url: `/tests/${testId}/${questionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Test' }],
    }),
  }),
});

export const { useAddQuestionMutation, useDeleteQuestionMutation } = questionApi;
