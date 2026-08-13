import { clearStoredAnswers, readStoredAnswers, writeStoredAnswers } from './attemptStorage';

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
});
