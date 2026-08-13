import styles from './Spinner.module.css';
import { cn } from '@/shared/lib';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner = ({ size = 'md', className }: SpinnerProps) => (
  <span
    className={cn(styles.spinner, styles[size], className)}
    role="status"
    aria-label="Загрузка"
  />
);
