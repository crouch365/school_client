import type { HTMLAttributes } from 'react';

import styles from './Badge.module.css';
import { cn } from '@/shared/lib';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = ({ variant = 'default', className, children, ...rest }: BadgeProps) => (
  <span className={cn(styles.badge, styles[variant], className)} {...rest}>
    {children}
  </span>
);
