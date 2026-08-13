import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './TeacherTestsPage.module.css';
import { useGetTestsQuery, type TestDto } from '@/entities/test';
import { GrantAccessModal } from '@/features/grantAccess';
import { TestFormModal } from '@/features/manageTest';
import { Button, Pagination } from '@/shared/ui';
import { TestGrid } from '@/widgets/test';

export const TeacherTestsPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetTestsQuery({ page, limit: 20 });

  const tests = data?.items ?? [];
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [accessTest, setAccessTest] = useState<TestDto | null>(null);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Мои тесты</h1>
        <Button onClick={() => setCreateOpen(true)}>+ Новый тест</Button>
      </div>

      <TestGrid
        tests={tests}
        isLoading={isFetching}
        emptyTitle="Тестов пока нет"
        emptyDescription="Создайте свой первый тест."
        renderActions={(test) => (
          <>
            <Button size="sm" onClick={() => navigate(`/teacher/tests/${test.id}/builder`)}>
              Конструктор
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate(`/teacher/tests/${test.id}/results`)}
            >
              Результаты
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setAccessTest(test)}>
              Доступ
            </Button>
          </>
        )}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <TestFormModal
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={(test) => navigate(`/teacher/tests/${test.id}/builder`)}
      />

      <GrantAccessModal
        isOpen={accessTest !== null}
        test={accessTest}
        onClose={() => setAccessTest(null)}
      />
    </div>
  );
};
