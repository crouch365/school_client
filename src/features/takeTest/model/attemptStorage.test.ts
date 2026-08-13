import {
  clearStoredAnswers,
  clearStoredDeadline,
  readStoredAnswers,
  readStoredDeadline,
  writeStoredAnswers,
  writeStoredDeadline,
} from './attemptStorage';

describe('attemptStorage', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('сохраняет и читает ответы по идентификатору теста', () => {
    writeStoredAnswers(42, { 1: 0, 2: 3 });

    expect(readStoredAnswers(42)).toEqual({ 1: 0, 2: 3 });
  });

  it('возвращает null, если черновика ещё нет', () => {
    expect(readStoredAnswers(999)).toBeNull();
  });

  it('изолирует черновики разных тестов', () => {
    writeStoredAnswers(1, { 1: 0 });
    writeStoredAnswers(2, { 5: 1 });

    expect(readStoredAnswers(1)).toEqual({ 1: 0 });
    expect(readStoredAnswers(2)).toEqual({ 5: 1 });
  });

  it('очищает черновик после сдачи', () => {
    writeStoredAnswers(7, { 1: 1 });
    clearStoredAnswers(7);

    expect(readStoredAnswers(7)).toBeNull();
  });

  describe('deadline', () => {
    it('сохраняет и читает дедлайн', () => {
      writeStoredDeadline(42, 2000);

      expect(readStoredDeadline(42)).toBe(2000);
    });

    it('возвращает null, если дедлайна нет', () => {
      expect(readStoredDeadline(999)).toBeNull();
    });

    it('изолирует дедлайны разных тестов', () => {
      writeStoredDeadline(1, 1000);
      writeStoredDeadline(2, 2000);

      expect(readStoredDeadline(1)).toBe(1000);
      expect(readStoredDeadline(2)).toBe(2000);
    });

    it('очищает дедлайн после сдачи', () => {
      writeStoredDeadline(7, 3000);
      clearStoredDeadline(7);

      expect(readStoredDeadline(7)).toBeNull();
    });
  });
});
