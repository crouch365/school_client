import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './TeacherTestsPage.module.css';
import { useGetTestsQuery, type TestDto } from '@/entities/test';
import { GrantAccessModal } from '@/features/grantAccess';
import { TestFormModal } from '@/features/manageTest';
import { Button } from '@/shared/ui';
import { TestGrid } from '@/widgets/test';

export const TeacherTestsPage = () => {
  const navigate = useNavigate();
  const { data: tests, isFetching } = useGetTestsQuery();

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [accessTest, setAccessTest] = useState<TestDto | null>(null);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Мои тесты</h1>
        <Button onClick={() => setCreateOpen(true)}>+ Новый тест</Button>
      </div>

      <TestGrid
        tests={tests ?? []}
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
