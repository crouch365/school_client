import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { buildSessionUser } from './lib';
import type { SessionUser } from './types';
import { storage } from '@/shared/lib';

interface SessionState {
  token: string | null;
  user: SessionUser | null;
}

const readInitialSession = (): SessionState => {
  const token = storage.getToken();
  if (!token) return { token: null, user: null };

  const user = buildSessionUser(token);
  if (!user) {
    storage.clearToken();
    return { token: null, user: null };
  }

  return { token, user };
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
