import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@/app/providers/store';
import { buildSessionUser, sessionActions } from '@/entities/user';
import { storage } from '@/shared/lib';
import { Button } from '@/shared/ui';

import { DEMO_PAYLOADS, signMockToken } from './token';
import styles from './AuthDebugToolbar.module.css';

const ROLE_HOME = {
  ADMIN: '/admin',
  TEACHER: '/teacher',
  STUDENT: '/student',
} as const;

const DEMO_ROLES = ['ADMIN', 'TEACHER', 'STUDENT'] as const;

/**
 * Dev-тулбар: мгновенное переключение учётных записей
 * (показывается только при активном мок-режиме).
 */
export const AuthDebugToolbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const switchUser = (role: (typeof DEMO_ROLES)[number]) => {
    const token = signMockToken(DEMO_PAYLOADS[role]);
    const sessionUser = buildSessionUser(token);
    if (!sessionUser) return;

    storage.setToken(token);
    dispatch(sessionActions.sessionSet({ token, user: sessionUser }));
    navigate(ROLE_HOME[role], { replace: true });
  };

  return (
    <div className={styles.toolbar}>
      <span className={styles.label}>🧪 Mock API</span>
      {DEMO_ROLES.map((role) => (
        <Button
          key={role}
          variant="secondary"
          size="sm"
          onClick={() => switchUser(role)}
        >
          {role}
        </Button>
      ))}
    </div>
  );
};