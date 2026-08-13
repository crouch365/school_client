import type { ReactNode } from 'react';

import styles from './EmptyState.module.css';
import { cn } from '@/shared/lib';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState = ({
  title = 'Здесь пока пусто',
  description,
  action,
  className,
}: EmptyStateProps) => (
  <div className={cn(styles.root, className)}>
    <div className={styles.icon} aria-hidden="true">
      🗂️
    </div>
    <h3 className={styles.title}>{title}</h3>
    {description && <p className={styles.description}>{description}</p>}
    {action && <div className={styles.action}>{action}</div>}
  </div>
);
