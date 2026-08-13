import { useNavigate } from 'react-router-dom';

import styles from './StudentTestsPage.module.css';
import { useGetTestsQuery } from '@/entities/test';
import { Button } from '@/shared/ui';
import { TestGrid } from '@/widgets/test';

export const StudentTestsPage = () => {
  const navigate = useNavigate();
  const { data: tests, isLoading } = useGetTestsQuery();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Доступные тесты</h1>

      <TestGrid
        tests={tests ?? []}
        isLoading={isLoading}
        emptyTitle="Нет доступных тестов"
        emptyDescription="Учитель ещё не открыл тесты для вашего класса."
        renderActions={(test) => (
          <Button onClick={() => navigate(`/student/tests/${test.id}/take`)}>Начать</Button>
        )}
      />
    </div>
  );
};
