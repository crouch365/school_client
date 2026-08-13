import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './TeacherDashboardPage.module.css';
import { useGetTestsQuery } from '@/entities/test';
import { Button } from '@/shared/ui';
import { DashboardStats } from '@/widgets/stats';
import { TestGrid } from '@/widgets/test';

export const TeacherDashboardPage = () => {
  const navigate = useNavigate();
  // Дашборд тянет первую страницу (до 100 тестов) для статистики и «Последних тестов».
  // Количество тестов берём из data.total (полное по всем страницам), а вот
  // вопросы/предметы считаются по первой сотне — точный подсчёт требует
  // отдельного stats-эндпоинта (вне текущего скоупа).
  const { data, isFetching } = useGetTestsQuery({ page: 1, limit: 100 });

  const tests = data?.items ?? [];

  const stats = useMemo(() => {
    const items = data?.items ?? [];

    return {
      testsCount: data?.total ?? items.length,
      questionsCount: items.reduce((count, test) => count + (test.questions?.length ?? 0), 0),
      subjectsCount: new Set(items.map((test) => test.subject)).size,
    };
  }, [data]);

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
          tests={tests.slice(0, 6)}
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
