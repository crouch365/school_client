import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/app/App';
import { ErrorBoundary } from '@/app/providers/ErrorBoundary';
import { StoreProvider } from '@/app/providers/StoreProvider';
import { setMockModeActive } from '@/mocks/flag';
import { IS_DEV } from '@/shared/config/env';
import { ToastProvider } from '@/shared/ui';

import '@/app/styles/index.css';

const HEALTH_TIMEOUT_MS = 1200;

/**
 * Проверяет доступность реального бэкенда.
 * Любой HTTP-ответ (кроме 500 от Vite-proxy при недоступном хосте)
 * означает, что сервер жив.
 */
const isServerReachable = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth/check', {
      signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS),
      cache: 'no-store',
    });
    return response.status !== 500;
  } catch {
    return false;
  }
};

/** Включает MSW (мок-сервер). */
const startMocks = async (): Promise<void> => {
  const { worker } = await import('@/mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
  setMockModeActive(true);
};

/**
 * Bootstrap API:
 *  - VITE_USE_MOCKS=true  -> всегда моки (dev-режим);
 *  - VITE_USE_MOCKS=off   -> всегда реальный сервер;
 *  - иначе (auto, ТОЛЬКО в dev) -> если сервер недоступен, включаются моки.
 *
 * В production auto-режим невозможен: при недоступном бэкенде приложение
 * получает обычный error-стейт RTK Query (error.status === 'FETCH_ERROR'),
 * а не подменяет данные фейковыми моками.
 */
const bootstrapApi = async (): Promise<void> => {
  const mode = (import.meta.env.VITE_USE_MOCKS as string | undefined) ?? 'auto';

  if (mode === 'true') {
    await startMocks();
    return;
  }
  if (mode === 'off' || !IS_DEV) return;

  const reachable = await isServerReachable();
  if (!reachable) {
    console.info('[mock] Сервер недоступен — включаю моки MSW.');
    await startMocks();
  }
};

void bootstrapApi().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <StoreProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </StoreProvider>
      </ErrorBoundary>
    </StrictMode>,
  );
});
