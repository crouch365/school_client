import { useParams } from 'react-router-dom';

import styles from './TeacherTestResultsPage.module.css';
import { useGetAttemptsByTestQuery } from '@/entities/attempt';
import { useGetTestByIdQuery } from '@/entities/test';
import { Alert } from '@/shared/ui';
import { ResultTable } from '@/widgets/results';

export const TeacherTestResultsPage = () => {
  const { testId } = useParams<{ testId: string }>();
  const id = Number(testId);
  const hasValidId = Number.isInteger(id) && id > 0;

  const { data: test } = useGetTestByIdQuery(id, { skip: !hasValidId });
  const {
    data: attempts,
    isLoading,
    error,
  } = useGetAttemptsByTestQuery(id, {
    skip: !hasValidId,
  });

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{test ? `Результаты: ${test.title}` : 'Результаты теста'}</h1>

      {error && (
        <Alert variant="info">
          Не удалось загрузить попытки. Проверьте, что endpoint «GET /api/results/test/:id»
          подключён на бэкенде.
        </Alert>
      )}

      <ResultTable attempts={attempts ?? []} isLoading={isLoading} />
    </div>
  );
};
