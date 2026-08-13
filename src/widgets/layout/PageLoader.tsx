import styles from './PageLoader.module.css';
import { Spinner } from '@/shared/ui';

/** Лоадер-заглушка для lazy-страниц (Suspense fallback). */
export const PageLoader = () => (
  <div className={styles.root}>
    <Spinner size="lg" />
    <span className={styles.text}>Загрузка…</span>
  </div>
);
