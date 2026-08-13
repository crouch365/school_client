import { baseApi } from '@/shared/api/baseApi';

export interface AccessPayload {
  testId: number;
  className: string;
}

/** Управление доступами к тестам по классам. */
export const accessApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    grantAccess: build.mutation<{ message: string }, AccessPayload>({
      query: (body) => ({ url: '/access/grant', method: 'PUT', body }),
      invalidatesTags: [{ type: 'Access' }, { type: 'Test', id: 'LIST' }],
    }),
    revokeAccess: build.mutation<{ message: string }, AccessPayload>({
      query: (body) => ({ url: '/access/revoke', method: 'PUT', body }),
      invalidatesTags: [{ type: 'Access' }, { type: 'Test', id: 'LIST' }],
    }),
  }),
});

export const { useGrantAccessMutation, useRevokeAccessMutation } = accessApi;
