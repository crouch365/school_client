import type { ReactNode } from 'react';

import styles from './TestGrid.module.css';
import { TestCard, type TestDto } from '@/entities/test';
import { EmptyState, Skeleton } from '@/shared/ui';

interface TestGridProps {
  tests: TestDto[];
  isLoading?: boolean;
  renderActions?: (test: TestDto) => ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
}

/**
 * Сетка карточек тестов с состоянием загрузки и пустым состоянием.
 * Действия для карточки зависят от роли и прокидываются renderActions.
 */
export const TestGrid = ({
  tests,
  isLoading = false,
  renderActions,
  emptyTitle = 'Тестов пока нет',
  emptyDescription = 'Создайте первый тест — он появится здесь.',
}: TestGridProps) => {
  if (isLoading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} height={180} borderRadius="var(--card-radius)" />
        ))}
      </div>
    );
  }

  if (tests.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={styles.grid}>
      {tests.map((test) => (
        <TestCard key={test.id} test={test} actions={renderActions?.(test)} />
      ))}
    </div>
  );
};
