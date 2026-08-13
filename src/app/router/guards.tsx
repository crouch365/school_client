import type { ReactNode } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { useAppSelector } from '@/app/providers/store';
import { selectSessionToken, selectSessionUser, type UserRole } from '@/entities/user';
import { AccessDeniedModal } from '@/shared/ui';

export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector(selectSessionToken);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

export const RequireRole = ({ roles, children }: { roles: UserRole[]; children: ReactNode }) => {
  const user = useAppSelector(selectSessionUser);
  const navigate = useNavigate();

  const isAllowed = Boolean(user && roles.includes(user.role));

  if (!isAllowed) {
    return (
      <AccessDeniedModal
        isOpen
        message="У вашей роли нет доступа к этому разделу."
        onClose={() => navigate('/')}
        onHome={() => navigate('/')}
      />
    );
  }

  return <>{children}</>;
};

/** Корневой редирект: `/` -> дашборд по роли или /login. */
export const RedirectByRole = () => {
  const token = useAppSelector(selectSessionToken);
  const user = useAppSelector(selectSessionUser);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const target =
    user.role === 'ADMIN' ? '/admin' : user.role === 'TEACHER' ? '/teacher' : '/student';

  return <Navigate to={target} replace />;
};
