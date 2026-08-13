import styles from './AttemptList.module.css';
import type { TestAttemptDto } from '@/entities/attempt';
import { formatDate, formatPercent } from '@/shared/lib';
import { Badge, EmptyState, Skeleton } from '@/shared/ui';

interface AttemptListProps {
  attempts: TestAttemptDto[];
  isLoading?: boolean;
}

/**
 * Список моих результатов (ученик).
 */
export const AttemptList = ({ attempts, isLoading }: AttemptListProps) => {
  if (isLoading) {
    return <Skeleton height={200} borderRadius="var(--radius-md)" />;
  }

  if (attempts.length === 0) {
    return (
      <EmptyState
        title="Результатов пока нет"
        description="Сдайте первый тест — результат появится здесь."
      />
    );
  }

  return (
    <div className={styles.list}>
      {attempts.map((attempt) => {
        const total = attempt.totalQuestions ?? 0;
        const score = attempt.score ?? 0;
        const percentValue = total > 0 ? Math.round((score / total) * 100) : 0;
        const percentLabel = formatPercent(score, total);

        return (
          <div key={attempt.id} className={styles.item}>
            <div className={styles.itemMain}>
              <h3 className={styles.itemTitle}>
                {attempt.test?.title ?? `Тест #${attempt.testId}`}
              </h3>
              {attempt.test?.subject && <Badge variant="accent">{attempt.test.subject}</Badge>}
            </div>

            <div className={styles.itemRight}>
              <div className={styles.itemScore}>
                {score} / {total}
                <Badge
                  variant={
                    percentValue >= 60 ? 'success' : percentValue >= 40 ? 'warning' : 'danger'
                  }
                >
                  {percentLabel}
                </Badge>
              </div>
              <div className={styles.itemDate}>
                {formatDate(attempt.finishedAt ?? attempt.startedAt)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
