import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './TeacherDashboardPage.module.css';
import { useGetTestsQuery } from '@/entities/test';
import { Button } from '@/shared/ui';
import { DashboardStats } from '@/widgets/stats';
import { TestGrid } from '@/widgets/test';

export const TeacherDashboardPage = () => {
  const navigate = useNavigate();
  const { data: tests, isFetching } = useGetTestsQuery();

  const stats = useMemo(() => {
    const allTests = tests ?? [];
    return {
      testsCount: allTests.length,
      questionsCount: allTests.reduce((count, test) => count + (test.questions?.length ?? 0), 0),
      subjectsCount: new Set(allTests.map((test) => test.subject)).size,
    };
  }, [tests]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Дашборд</h1>

      <DashboardStats
        testsCount={stats.testsCount}
        questionsCount={stats.questionsCount}
        subjectsCount={stats.subjectsCount}
      />

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Последние тесты</h2>
          <Button variant="secondary" size="sm" onClick={() => navigate('/teacher/tests')}>
            Все тесты
          </Button>
        </div>

        <TestGrid
          tests={tests ?? []}
          isLoading={isFetching}
          emptyTitle="Тестов пока нет"
          emptyDescription="Создайте первый тест в разделе «Мои тесты»."
          renderActions={(test) => (
            <Button size="sm" onClick={() => navigate(`/teacher/tests/${test.id}/builder`)}>
              Открыть конструктор
            </Button>
          )}
        />
      </div>
    </div>
  );
};
