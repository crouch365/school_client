const TOKEN_KEY = 'school_token';

const readFromStorage = <T>(key: string): T | null => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const writeToStorage = (key: string, value: unknown): boolean => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

/**
 * Тонкая обёртка над localStorage.
 * Все операции безопасны: никогда не бросают исключений.
 */
export const storage = {
  getToken: (): string | null => readFromStorage<string>(TOKEN_KEY),
  setToken: (token: string): boolean => writeToStorage(TOKEN_KEY, token),
  clearToken: (): void => {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* storage недоступен — игнорируем */
    }
  },
};
