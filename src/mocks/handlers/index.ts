import { accessHandlers } from './access';
import { authHandlers } from './auth';
import { resultHandlers } from './results';
import { teacherHandlers } from './teachers';
import { testHandlers } from './tests';
import { userHandlers } from './users';

/** Все мок-обработчики API. */
export const handlers = [
  ...authHandlers,
  ...userHandlers,
  ...teacherHandlers,
  ...testHandlers,
  ...accessHandlers,
  ...resultHandlers,
];