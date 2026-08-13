import type { HTMLAttributes, ReactNode } from 'react';

import styles from './Alert.module.css';
import { cn } from '@/shared/lib';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  children?: ReactNode;
}

export const Alert = ({ variant = 'info', className, children, ...rest }: AlertProps) => (
  <div className={cn(styles.alert, styles[variant], className)} role="alert" {...rest}>
    {children}
  </div>
);
