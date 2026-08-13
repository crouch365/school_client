import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './StudentTestsPage.module.css';
import { useGetTestsQuery } from '@/entities/test';
import { Button, Pagination } from '@/shared/ui';
import { TestGrid } from '@/widgets/test';

export const StudentTestsPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetTestsQuery({ page, limit: 20 });

  const tests = data?.items ?? [];
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Доступные тесты</h1>

      <TestGrid
        tests={tests}
        isLoading={isLoading}
        emptyTitle="Нет доступных тестов"
        emptyDescription="Учитель ещё не открыл тесты для вашего класса."
        renderActions={(test) => (
          <Button onClick={() => navigate(`/student/tests/${test.id}/take`)}>Начать</Button>
        )}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};
