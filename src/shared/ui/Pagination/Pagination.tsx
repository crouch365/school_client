import { Button } from '../Button';

import styles from './Pagination.module.css';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * «Назад / Страница X из Y / Далее» — единый блок пагинации.
 * Ничего не рендерит, если страница одна.
 */
export const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      <Button
        variant="secondary"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        ← Назад
      </Button>
      <span className={styles.pageInfo}>
        Страница {page} из {totalPages}
      </span>
      <Button
        variant="secondary"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
      >
        Далее →
      </Button>
    </div>
  );
};
