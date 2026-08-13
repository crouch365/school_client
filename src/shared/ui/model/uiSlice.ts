import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AccessDeniedState {
  isOpen: boolean;
  message: string | null;
}

interface UiState {
  accessDenied: AccessDeniedState;
}

const initialState: UiState = {
  accessDenied: { isOpen: false, message: null },
};

/**
 * Глобальное UI-состояние: модалка «Нет доступа» (403 от API),
 * управляется из baseQuery и рендерится в корне приложения.
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    accessDeniedOpened(state, action: PayloadAction<string>) {
      state.accessDenied = { isOpen: true, message: action.payload };
    },
    accessDeniedClosed(state) {
      state.accessDenied = { isOpen: false, message: null };
    },
  },
});

export const uiActions = uiSlice.actions;
export const uiReducer = uiSlice.reducer;

export const selectAccessDenied = (state: { ui: UiState }): AccessDeniedState =>
  state.ui.accessDenied;
