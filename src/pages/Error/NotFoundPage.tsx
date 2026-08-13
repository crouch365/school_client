import { useNavigate } from 'react-router-dom';

import styles from './NotFoundPage.module.css';
import { Button } from '@/shared/ui';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.root}>
      <div className={styles.code}>404</div>
      <h1 className={styles.title}>Страница не найдена</h1>
      <p className={styles.text}>Возможно, ссылка устарела или вы ошиблись адресом.</p>
      <Button onClick={() => navigate('/')}>На главную</Button>
    </div>
  );
};
