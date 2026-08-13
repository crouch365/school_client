import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@/app/providers/store';
import { sessionActions, type SessionUser } from '@/entities/user';
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
    const payload = DEMO_PAYLOADS[role];
    const token = signMockToken(payload);
    const sessionUser: SessionUser = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      className: payload.className ?? null,
    };

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