import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { SessionUser, UserRole } from './types';
import { decodeJwt, storage } from '@/shared/lib';

interface SessionState {
  token: string | null;
  user: SessionUser | null;
}

const readInitialSession = (): SessionState => {
  const token = storage.getToken();
  if (!token) return { token: null, user: null };

  const payload = decodeJwt(token);
  if (!payload) {
    storage.clearToken();
    return { token: null, user: null };
  }

  return {
    token,
    user: {
      id: payload.id,
      email: payload.email,
      role: payload.role as UserRole,
      className: payload.className ?? null,
    },
  };
};

const initialState: SessionState = readInitialSession();

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    sessionSet(state, action: PayloadAction<{ token: string; user: SessionUser }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    sessionCleared(state) {
      state.token = null;
      state.user = null;
    },
  },
});

export const sessionActions = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;

export const selectSessionToken = (state: { session: SessionState }): string | null =>
  state.session.token;

export const selectSessionUser = (state: { session: SessionState }): SessionUser | null =>
  state.session.user;
