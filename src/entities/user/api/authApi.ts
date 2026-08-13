import { baseApi } from '@/shared/api/baseApi';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResult {
  token: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResult, LoginPayload>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    /**
     * Валидация токена при старте приложения.
     * Вернёт { token, user } только при живом токене.
     */
    checkAuth: build.query<{ token: string; user: LoginResult }, void>({
      query: () => '/auth/check',
    }),
  }),
});

export const { useLoginMutation, useCheckAuthQuery } = authApi;
