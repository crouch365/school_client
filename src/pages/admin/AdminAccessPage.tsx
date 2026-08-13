import { useState } from 'react';

import styles from './AdminAccessPage.module.css';
import { useGetTestsQuery, type TestDto } from '@/entities/test';
import { GrantAccessModal } from '@/features/grantAccess';
import { formatDuration } from '@/shared/lib';
import { Button, EmptyState, Skeleton } from '@/shared/ui';

export const AdminAccessPage = () => {
  const { data: tests, isFetching } = useGetTestsQuery();
  const [selectedTest, setSelectedTest] = useState<TestDto | null>(null);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Доступ к тестам</h1>

      <p className={styles.subtitle}>Откройте или закройте доступ к тесту для целого класса.</p>

      {isFetching ? (
        <Skeleton height={200} borderRadius="var(--radius-md)" />
      ) : !tests || tests.length === 0 ? (
        <EmptyState
          title="Тестов пока нет"
          description="Создайте тест, чтобы управлять доступом к нему."
        />
      ) : (
        <div className={styles.list}>
          {tests.map((test) => (
            <div key={test.id} className={styles.item}>
              <div className={styles.itemMain}>
                <div className={styles.itemTitle}>{test.title}</div>
                <div className={styles.itemMeta}>
                  {test.subject} · ⏱ {formatDuration(test.timeLimit)} ·{' '}
                  {test.questions?.length ?? 0} вопросов
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setSelectedTest(test)}>
                Управление доступом
              </Button>
            </div>
          ))}
        </div>
      )}

      <GrantAccessModal
        isOpen={selectedTest !== null}
        test={selectedTest}
        onClose={() => setSelectedTest(null)}
      />
    </div>
  );
};
