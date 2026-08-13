import type { HTMLAttributes, ReactNode } from 'react';

import styles from './Card.module.css';
import { cn } from '@/shared/lib';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  actions?: ReactNode;
  hoverable?: boolean;
  children?: ReactNode;
}

export const Card = ({
  title,
  actions,
  hoverable = false,
  className,
  children,
  ...rest
}: CardProps) => (
  <div className={cn(styles.card, hoverable && styles.hoverable, className)} {...rest}>
    {(title || actions) && (
      <div className={styles.header}>
        {title && <div className={styles.title}>{title}</div>}
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    )}
    {children}
  </div>
);
