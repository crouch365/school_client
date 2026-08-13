import type { CSSProperties } from 'react';

import styles from './Skeleton.module.css';
import { cn } from '@/shared/lib';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export const Skeleton = ({ width, height, borderRadius, className }: SkeletonProps) => {
  const style: CSSProperties = {
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
    ...(borderRadius !== undefined ? { borderRadius } : {}),
  };

  return <span className={cn(styles.skeleton, className)} style={style} />;
};
