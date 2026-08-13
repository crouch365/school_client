import { NavLink } from 'react-router-dom';

import styles from './AppSidebar.module.css';
import { useAppSelector } from '@/app/providers/store';
import { selectSessionUser } from '@/entities/user';
import { cn } from '@/shared/lib';
import { Badge } from '@/shared/ui';

export interface NavItem {
  to: string;
  label: string;
  icon?: string;
}

export interface AppSidebarProps {
  nav: NavItem[];
}

export const AppSidebar = ({ nav }: AppSidebarProps) => {
  const user = useAppSelector(selectSessionUser);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandMark}>🎓</span>
        <span className={styles.brandName}>School LMS</span>
      </div>

      <nav className={styles.nav} aria-label="Основная навигация">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/teacher/dashboard'}
            className={({ isActive }) => cn(styles.link, isActive && styles.linkActive)}
          >
            {item.icon && (
              <span className={styles.linkIcon} aria-hidden="true">
                {item.icon}
              </span>
            )}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {user && (
        <div className={styles.userBlock}>
          <div className={styles.userName}>{user.email}</div>
          <Badge variant="accent">{user.role}</Badge>
        </div>
      )}
    </aside>
  );
};
