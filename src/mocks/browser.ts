import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';

/** Service Worker для MSW (браузер). */
export const worker = setupWorker(...handlers);