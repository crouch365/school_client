import type { ReactElement, ReactNode } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { sessionReducer } from '@/entities/user';
import { baseApi } from '@/shared/api/baseApi';
import { ToastProvider } from '@/shared/ui';
import { uiReducer } from '@/shared/ui/model/uiSlice';

export const createTestStore = () =>
  configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      session: sessionReducer,
      ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  });

export type TestStore = ReturnType<typeof createTestStore>;

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  store?: TestStore;
  route?: string;
}

export interface RenderResult {
  store: TestStore;
  container: HTMLElement;
}

/**
 * Рендер компонента с тестовым Redux-стором, ToastProvider и MemoryRouter.
 */
export const renderWithProviders = (
  ui: ReactElement,
  { store = createTestStore(), route = '/', ...renderOptions }: ExtendedRenderOptions = {},
): RenderResult & ReturnType<typeof render> => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <ToastProvider>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </ToastProvider>
    </Provider>
  );

  return {
    store,
    ...render(ui, { wrapper, ...renderOptions }),
  };
};
