import { forwardRef, type TextareaHTMLAttributes } from 'react';

import styles from './Textarea.module.css';
import { cn } from '@/shared/lib';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...rest }, ref) => {
    const textareaId = id ?? (label ? `field-${label}` : undefined);

    return (
      <div className={cn(styles.field, className)}>
        {label && (
          <label className={styles.label} htmlFor={textareaId}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            styles.textarea,
            error && styles.textareaError,
            rest.disabled && styles.textareaDisabled,
          )}
          aria-invalid={Boolean(error)}
          {...rest}
        />
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

Textarea.displayName = 'Textarea';
