import type { CreateTestPayload, TestDto, UpdateTestPayload } from '../model/types';
import { baseApi } from '@/shared/api/baseApi';

export const testApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTests: build.query<TestDto[], void>({
      query: () => '/tests',
      providesTags: [{ type: 'Test', id: 'LIST' }],
    }),
    getTestById: build.query<TestDto, number>({
      query: (testId) => `/tests/${testId}`,
      providesTags: (_result, _error, testId) => [{ type: 'Test', id: testId }],
    }),
    createTest: build.mutation<TestDto, CreateTestPayload>({
      query: (body) => ({ url: '/tests', method: 'POST', body }),
      invalidatesTags: [{ type: 'Test', id: 'LIST' }],
    }),
    updateTest: build.mutation<TestDto, { id: number; body: UpdateTestPayload }>({
      query: ({ id, body }) => ({ url: `/tests/${id}`, method: 'PUT', body }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Test', id: arg.id },
        { type: 'Test', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetTestsQuery,
  useGetTestByIdQuery,
  useCreateTestMutation,
  useUpdateTestMutation,
} = testApi;
