import { useNavigate } from 'react-router-dom';

import styles from './AppHeader.module.css';
import { useAppDispatch, useAppSelector } from '@/app/providers/store';
import { selectSessionUser, sessionActions } from '@/entities/user';
import { useTheme } from '@/shared/hooks/useTheme';
import { formatRole, storage } from '@/shared/lib';
import { Badge, Button } from '@/shared/ui';

export const AppHeader = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectSessionUser);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    storage.clearToken();
    dispatch(sessionActions.sessionCleared());
    navigate('/login', { replace: true });
  };

  return (
    <header className={styles.header}>
      <div className={styles.title}>School · Школьная LMS-платформа</div>

      <div className={styles.actions}>
        {user && (
          <div className={styles.userInfo}>
            <Badge variant="default">{formatRole(user.role)}</Badge>
            <span className={styles.userEmail}>{user.email}</span>
          </div>
        )}

        <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Переключить тему">
          {theme === 'light' ? '🌙' : '☀️'}
        </Button>

        <Button variant="secondary" size="sm" onClick={handleLogout}>
          Выйти
        </Button>
      </div>
    </header>
  );
};
