import styles from './LoginPage.module.css';
import { LoginForm } from '@/features/auth';

/**
 * Экран входа: полноэкранный тёмный фон + карточка с формой.
 */
export const LoginPage = () => (
  <div className={styles.root}>
    <div className={styles.card}>
      <LoginForm />
    </div>
  </div>
);
