import styles from './StudentResultsPage.module.css';
import { useGetMyAttemptsQuery } from '@/entities/attempt';
import { Alert } from '@/shared/ui';
import { AttemptList } from '@/widgets/results';

export const StudentResultsPage = () => {
  const { data: attempts, isLoading, error } = useGetMyAttemptsQuery();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Мои результаты</h1>

      {error && <Alert variant="danger">Не удалось загрузить результаты.</Alert>}

      <AttemptList attempts={attempts ?? []} isLoading={isLoading} />
    </div>
  );
};
