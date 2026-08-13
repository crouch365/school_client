import type {
  CreateUserPayload,
  CreatedUserResult,
  UpdateUserPayload,
  User,
  UsersPage,
} from '../model/types';
import { baseApi } from '@/shared/api/baseApi';

export interface GetUsersArgs {
  page?: number;
  limit?: number;
  role?: string;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<UsersPage, GetUsersArgs>({
      query: ({ page = 1, limit = 50, role } = {}) => ({
        url: '/users',
        params: { page, limit, ...(role ? { role } : {}) },
      }),
      providesTags: [{ type: 'User', id: 'LIST' }],
    }),
    createUser: build.mutation<CreatedUserResult, CreateUserPayload>({
      query: (body) => ({ url: '/users', method: 'POST', body }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    updateUser: build.mutation<User, { id: number; body: UpdateUserPayload }>({
      query: ({ id, body }) => ({ url: `/users/${id}`, method: 'PUT', body }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    deleteUser: build.mutation<{ message: string; name?: string }, number>({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
