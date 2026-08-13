import { Outlet } from 'react-router-dom';

import { AppHeader } from './AppHeader';
import styles from './AppShell.module.css';
import { AppSidebar, type NavItem } from './AppSidebar';
import { useAppSelector } from '@/app/providers/store';
import { selectSessionUser, type UserRole } from '@/entities/user';
import { AuthDebugToolbar } from '@/mocks/AuthDebugToolbar';
import { isMockModeActive } from '@/mocks/flag';
import { IS_DEV } from '@/shared/config/env';

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  ADMIN: [
    { to: '/admin/users', label: 'Пользователи', icon: '👥' },
    { to: '/admin/teachers', label: 'Учителя', icon: '👨‍🏫' },
    { to: '/admin/access', label: 'Доступ к тестам', icon: '🔑' },
  ],
  TEACHER: [
    { to: '/teacher/dashboard', label: 'Дашборд', icon: '📊' },
    { to: '/teacher/tests', label: 'Мои тесты', icon: '📝' },
  ],
  STUDENT: [
    { to: '/student/tests', label: 'Тесты', icon: '📚' },
    { to: '/student/results', label: 'Мои результаты', icon: '🏆' },
  ],
};

/**
 * Каркас авторизованной зоны: сайдбар + шапка + контент (Outlet).
 * Навигация зависит от роли пользователя.
 */
export const AppShell = () => {
  const user = useAppSelector(selectSessionUser);
  const nav = user ? NAV_BY_ROLE[user.role] : [];

  return (
    <div className={styles.shell}>
      <AppSidebar nav={nav} />
      <div className={styles.main}>
        <AppHeader />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>

      {/* Dev-тулбар быстрого переключения ролей (только при активных моках) */}
      {IS_DEV && isMockModeActive() && <AuthDebugToolbar />}
    </div>
  );
};
