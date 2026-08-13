import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { QuestionStep } from './QuestionStep';
import styles from './TakeTestTaker.module.css';
import {
  clearStoredAnswers,
  clearStoredDeadline,
  readStoredAnswers,
  readStoredDeadline,
  writeStoredAnswers,
  writeStoredDeadline,
} from '../model/attemptStorage';
import { buildAnswersPayload } from '../model/buildAnswers';
import { useCountdown } from '../model/useCountdown';
import { useSubmitAttemptMutation, type SubmitAttemptResult } from '@/entities/attempt';
import type { SafeQuestionDto } from '@/entities/question';
import type { TestDto } from '@/entities/test';
import { getApiErrorMessage } from '@/shared/lib';
import { Alert, Badge, Button, EmptyState } from '@/shared/ui';

interface TakeTestTakerProps {
  test: TestDto;
}

/**
 * Fullscreen-режим прохождения теста: таймер, навигация по вопросам,
 * сбор ответов и сдача. При истечении времени — автосабмит.
 */
export const TakeTestTaker = ({ test }: TakeTestTakerProps) => {
  const navigate = useNavigate();
  const [submitAttempt, { isLoading }] = useSubmitAttemptMutation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>(
    () => readStoredAnswers(test.id) ?? {},
  );
  const [result, setResult] = useState<SubmitAttemptResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Восстанавливаем/создаём дедлайн один раз при маунте.
  // Ответы переживают F5 через sessionStorage, поэтому и дедлайн храним там же —
  // иначе перезагрузка «продлевала» бы таймер экзамена.
  const [deadline] = useState<number>(() => {
    const stored = readStoredDeadline(test.id);
    if (stored && stored > Date.now()) return stored;
    const fresh = Date.now() + test.timeLimit * 1000;
    writeStoredDeadline(test.id, fresh);
    return fresh;
  });

  // Синхронизация черновика в sessionStorage на каждое изменение ответа.
  useEffect(() => {
    writeStoredAnswers(test.id, answers);
  }, [test.id, answers]);

  // Предупреждение браузера при закрытии/перезагрузке вкладки с непустым черновиком.
  useEffect(() => {
    if (Object.keys(answers).length === 0) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [answers]);

  const questions = useMemo<SafeQuestionDto[]>(
    () => (test.questions ?? []) as SafeQuestionDto[],
    [test.questions],
  );
  const total = questions.length;

  const answeredCount = useMemo(
    () => questions.filter((question) => answers[question.id] !== undefined).length,
    [questions, answers],
  );
  const currentQuestion = questions[currentIndex];

  const doSubmit = useCallback(
    async (force: boolean) => {
      setSubmitError(null);

      if (total === 0) return;

      const unanswered = total - answeredCount;
      if (unanswered > 0 && !force) {
        const confirmed = window.confirm(
          `Не отвечено на ${unanswered} из ${total} вопросов. Сдать тест?`,
        );
        if (!confirmed) return;
      }

      try {
        const saved = await submitAttempt({
          testId: test.id,
          answers: buildAnswersPayload(questions, answers),
        }).unwrap();
        clearStoredAnswers(test.id);
        clearStoredDeadline(test.id);
        setResult(saved);
      } catch (error) {
        setSubmitError(getApiErrorMessage(error));
      }
    },
    [answeredCount, answers, questions, submitAttempt, test.id, total],
  );

  const handleExpire = useCallback(() => {
    void doSubmit(true);
  }, [doSubmit]);

  const { formatted, remaining } = useCountdown(deadline, handleExpire);

  const handleSelect = (optionIndex: number) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIndex }));
  };

  const handlePrev = () => setCurrentIndex((index) => Math.max(0, index - 1));
  const handleNext = () => setCurrentIndex((index) => Math.min(total - 1, index + 1));

  if (result) {
    const percent =
      result.totalQuestions > 0 ? Math.round((result.score / result.totalQuestions) * 100) : 0;

    return (
      <div className={styles.result}>
        <div className={styles.resultCard}>
          <h1 className={styles.resultTitle}>Результат сохранён 🎉</h1>
          <div className={styles.resultScore}>
            {result.score}
            <span className={styles.resultTotal}>из {result.totalQuestions}</span>
          </div>
          <Badge variant={percent >= 60 ? 'success' : percent >= 40 ? 'warning' : 'danger'}>
            {percent}%
          </Badge>
          <p className={styles.resultMessage}>{result.message}</p>
          <div className={styles.resultActions}>
            <Button variant="secondary" onClick={() => navigate('/student/tests')}>
              К списку тестов
            </Button>
            <Button onClick={() => navigate('/student/results')}>Мои результаты</Button>
          </div>
        </div>
      </div>
    );
  }

  if (total === 0) {
    return (
      <EmptyState
        title="В тесте нет вопросов"
        description="Добавьте вопросы в конструкторе, чтобы тест можно было пройти."
        action={
          <Button variant="secondary" onClick={() => navigate('/student/tests')}>
            К списку тестов
          </Button>
        }
      />
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.testTitle}>{test.title}</h1>
          <span className={styles.testMeta}>
            {test.subject} · {total} {total === 1 ? 'вопрос' : total < 5 ? 'вопроса' : 'вопросов'}
          </span>
        </div>
        <div className={styles.headerStats}>
          <span className={styles.answered}>
            Отвечено: {answeredCount}/{total}
          </span>
          <Badge variant={remaining <= 60 ? 'danger' : 'accent'}>⏱ {formatted}</Badge>
        </div>
      </header>

      {submitError && <Alert variant="danger">{submitError}</Alert>}

      <QuestionStep
        question={currentQuestion}
        index={currentIndex}
        total={total}
        selectedOption={answers[currentQuestion.id] ?? null}
        onSelect={handleSelect}
      />

      <footer className={styles.footer}>
        <Button variant="secondary" onClick={handlePrev} disabled={currentIndex === 0}>
          ← Назад
        </Button>

        {currentIndex < total - 1 ? (
          <Button onClick={handleNext}>Далее →</Button>
        ) : (
          <Button loading={isLoading} onClick={() => void doSubmit(false)}>
            Сдать тест
          </Button>
        )}
      </footer>
    </div>
  );
};
