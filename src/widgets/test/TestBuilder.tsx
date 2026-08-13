import { useState } from 'react';

import styles from './TestBuilder.module.css';
import { QuestionCard, useDeleteQuestionMutation } from '@/entities/question';
import { type TestDto } from '@/entities/test';
import { QuestionFormModal, TestFormModal } from '@/features/manageTest';
import { getApiErrorMessage } from '@/shared/lib';
import { Alert, Button, EmptyState, useToast } from '@/shared/ui';

interface TestBuilderProps {
  test: TestDto | undefined;
  isLoading: boolean;
}

/**
 * Конструктор теста: настройки теста + список вопросов.
 * Вопросы можно добавлять и удалять (PUT-редактирование вопросов
 * бэкендом пока не смонтировано — редактирование через «удалить -> создать»).
 */
export const TestBuilder = ({ test, isLoading }: TestBuilderProps) => {
  const toast = useToast();
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isQuestionOpen, setQuestionOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deleteQuestion, { isLoading: isDeleting }] = useDeleteQuestionMutation();

  if (isLoading) {
    return <div className={styles.loading}>Загрузка теста…</div>;
  }

  if (!test) {
    return <EmptyState title="Тест не найден" description="Проверьте ссылку на тест." />;
  }

  const handleDeleteQuestion = async (questionId: number) => {
    const confirmed = window.confirm('Удалить вопрос? Действие необратимо.');
    if (!confirmed) return;

    setError(null);
    try {
      await deleteQuestion({ testId: test.id, questionId }).unwrap();
      toast.success('Вопрос удалён');
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError));
    }
  };

  const questions = test.questions ?? [];

  return (
    <div className={styles.root}>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={() => setSettingsOpen(true)}>
          Настройки теста
        </Button>
        <Button onClick={() => setQuestionOpen(true)}>+ Добавить вопрос</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {questions.length === 0 ? (
        <EmptyState
          title="Вопросов пока нет"
          description="Добавьте первый вопрос, чтобы тест можно было проходить."
          action={<Button onClick={() => setQuestionOpen(true)}>+ Добавить вопрос</Button>}
        />
      ) : (
        <div className={styles.list}>
          {questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              index={index}
              text={question.text}
              options={question.options}
              correctOptionIndex={question.correctOptionIndex}
              onDelete={() => handleDeleteQuestion(question.id)}
            />
          ))}
          {isDeleting && <Alert variant="info">Удаление вопроса…</Alert>}
        </div>
      )}

      <TestFormModal isOpen={isSettingsOpen} test={test} onClose={() => setSettingsOpen(false)} />

      {isQuestionOpen && (
        <QuestionFormModal
          isOpen={isQuestionOpen}
          testId={test.id}
          onClose={() => setQuestionOpen(false)}
        />
      )}
    </div>
  );
};
