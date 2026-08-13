import styles from './DashboardStats.module.css';

interface DashboardStatsProps {
  testsCount: number;
  questionsCount: number;
  subjectsCount: number;
}

/** Сводные карточки дашборда учителя. */
export const DashboardStats = ({
  testsCount,
  questionsCount,
  subjectsCount,
}: DashboardStatsProps) => (
  <div className={styles.grid}>
    <div className={styles.card}>
      <span className={styles.value}>{testsCount}</span>
      <span className={styles.label}>Тестов</span>
    </div>
    <div className={styles.card}>
      <span className={styles.value}>{questionsCount}</span>
      <span className={styles.label}>Вопросов</span>
    </div>
    <div className={styles.card}>
      <span className={styles.value}>{subjectsCount}</span>
      <span className={styles.label}>Предметов</span>
    </div>
  </div>
);
