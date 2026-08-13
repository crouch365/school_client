import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

import styles from './Input.module.css';
import { cn } from '@/shared/lib';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  rightSlot?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, rightSlot, ...rest }, ref) => {
    const inputId = id ?? (label ? `field-${label}` : undefined);

    return (
      <div className={cn(styles.field, className)}>
        {label && (
          <label className={styles.label} htmlFor={inputId}>
            {label}
          </label>
        )}
        <div className={styles.control}>
          <input
            ref={ref}
            id={inputId}
            className={cn(
              styles.input,
              error && styles.inputError,
              rest.disabled && styles.inputDisabled,
            )}
            aria-invalid={Boolean(error)}
            {...rest}
          />
          {rightSlot}
        </div>
        {error && (
          <span className={styles.error} role="alert">
            {error}
          </span>
        )}
        {!error && hint && <span className={styles.hint}>{hint}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
