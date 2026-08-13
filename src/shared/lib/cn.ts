import { clsx, type ClassValue } from 'clsx';

/** Утилита объединения классов (clsx + поддержка условий). */
export const cn = (...inputs: ClassValue[]): string => clsx(inputs);
