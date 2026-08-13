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
