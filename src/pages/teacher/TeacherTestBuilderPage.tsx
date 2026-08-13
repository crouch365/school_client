import { useParams } from 'react-router-dom';

import styles from './TeacherTestBuilderPage.module.css';
import { useGetTestByIdQuery } from '@/entities/test';
import { Alert } from '@/shared/ui';
import { TestBuilder } from '@/widgets/test';

export const TeacherTestBuilderPage = () => {
  const { testId } = useParams<{ testId: string }>();
  const id = Number(testId);
  const hasValidId = Number.isInteger(id) && id > 0;

  const {
    data: test,
    isLoading,
    error,
  } = useGetTestByIdQuery(id, {
    skip: !hasValidId,
  });

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Конструктор теста</h1>

      {error && <Alert variant="danger">Не удалось загрузить тест. Попробуйте позже.</Alert>}

      {hasValidId && <TestBuilder test={test} isLoading={isLoading} />}
    </div>
  );
};
