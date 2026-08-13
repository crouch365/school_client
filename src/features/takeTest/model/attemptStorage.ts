const makeKey = (testId: number): string => `attempt:${testId}`;

/**
 * Черновик ответов прохождения теста в sessionStorage.
 * SessionStorage живёт до закрытия вкладки и переживает перезагрузку страницы —
 * это защищает прогресс ученика от случайного F5 / разрыва вкладки.
 */
export const readStoredAnswers = (testId: number): Record<number, number> | null => {
  try {
    const raw = window.sessionStorage.getItem(makeKey(testId));
    return raw ? (JSON.parse(raw) as Record<number, number>) : null;
  } catch {
    return null;
  }
};

export const writeStoredAnswers = (testId: number, answers: Record<number, number>): void => {
  try {
    window.sessionStorage.setItem(makeKey(testId), JSON.stringify(answers));
  } catch {
    /* sessionStorage недоступен — игнорируем */
  }
};

export const clearStoredAnswers = (testId: number): void => {
  try {
    window.sessionStorage.removeItem(makeKey(testId));
  } catch {
    /* игнорируем */
  }
};

const deadlineKey = (testId: number): string => `attempt-deadline:${testId}`;

/**
 * Дедлайн (абсолютный epoch ms) прохождения теста в sessionStorage.
 * Хранится отдельно от ответов, чтобы перезагрузка страницы НЕ продлевала
 * таймер экзамена: восстановив дедлайн, таймер продолжит отсчёт от него.
 */
export const readStoredDeadline = (testId: number): number | null => {
  try {
    const raw = window.sessionStorage.getItem(deadlineKey(testId));
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
};

export const writeStoredDeadline = (testId: number, deadline: number): void => {
  try {
    window.sessionStorage.setItem(deadlineKey(testId), String(deadline));
  } catch {
    /* sessionStorage недоступен — игнорируем */
  }
};

export const clearStoredDeadline = (testId: number): void => {
  try {
    window.sessionStorage.removeItem(deadlineKey(testId));
  } catch {
    /* игнорируем */
  }
};
