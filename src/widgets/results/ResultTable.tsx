import styles from './ResultTable.module.css';
import type { AttemptStatus, TestAttemptDto } from '@/entities/attempt';
import { formatDate, formatPercent } from '@/shared/lib';
import { Badge, EmptyState, Skeleton } from '@/shared/ui';

interface ResultTableProps {
  attempts: TestAttemptDto[];
  isLoading?: boolean;
}

const statusVariant = (status: AttemptStatus): 'success' | 'warning' | 'info' => {
  switch (status) {
    case 'COMPLETED':
      return 'success';
    case 'EXPIRED':
      return 'warning';
    default:
      return 'info';
  }
};

const statusLabel = (status: AttemptStatus): string => {
  switch (status) {
    case 'COMPLETED':
      return 'Завершён';
    case 'EXPIRED':
      return 'Истекло время';
    default:
      return 'В процессе';
  }
};

/**
 * Таблица попыток теста (учитель).
 * Ученик идентифицируется по studentId — ФИО отдаёт бэкенд.
 */
export const ResultTable = ({ attempts, isLoading }: ResultTableProps) => {
  if (isLoading) {
    return <Skeleton height={220} borderRadius="var(--radius-md)" />;
  }

  if (attempts.length === 0) {
    return (
      <EmptyState
        title="Попыток пока нет"
        description="Результаты учеников появятся после сдачи теста."
      />
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ученик</th>
            <th>Результат</th>
            <th>Процент</th>
            <th>Статус</th>
            <th>Сдано</th>
          </tr>
        </thead>
        <tbody>
          {attempts.map((attempt) => (
            <tr key={attempt.id}>
              <td>{attempt.id}</td>
              <td>#{attempt.studentId}</td>
              <td>
                {attempt.score ?? '—'} / {attempt.totalQuestions ?? '—'}
              </td>
              <td>{formatPercent(attempt.score ?? 0, attempt.totalQuestions ?? 0)}</td>
              <td>
                <Badge variant={statusVariant(attempt.status)}>{statusLabel(attempt.status)}</Badge>
              </td>
              <td>{formatDate(attempt.finishedAt ?? attempt.startedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
