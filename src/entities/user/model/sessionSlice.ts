import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { SessionUser } from './types';
import { storage } from '@/shared/lib';

export type SessionStatus = 'idle' | 'checking' | 'authenticated';

interface SessionState {
  token: string | null;
  user: SessionUser | null;
  /** 'checking' — токен есть, но роль ещё не подтверждена сервером (/auth/check). */
  status: SessionStatus;
}

const readInitialSession = (): SessionState => {
  const token = storage.getToken();
  if (!token) return { token: null, user: null, status: 'idle' };

  // Роль на старте не берём из JWT — её подтвердит SessionVerifier через /auth/check.
  return { token, user: null, status: 'checking' };
};

const initialState: SessionState = readInitialSession();

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    sessionSet(state, action: PayloadAction<{ token: string; user: SessionUser }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.status = 'authenticated';
    },
    sessionTokenSet(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.user = null;
      state.status = 'checking';
    },
    sessionUserSet(state, action: PayloadAction<SessionUser>) {
      state.user = action.payload;
      state.status = 'authenticated';
    },
    sessionCleared(state) {
      state.token = null;
      state.user = null;
      state.status = 'idle';
    },
  },
});

export const sessionActions = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;

export const selectSessionToken = (state: { session: SessionState }): string | null =>
  state.session.token;

export const selectSessionUser = (state: { session: SessionState }): SessionUser | null =>
  state.session.user;

export const selectSessionStatus = (state: { session: SessionState }): SessionStatus =>
  state.session.status;
