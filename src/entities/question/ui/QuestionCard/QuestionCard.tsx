import styles from './QuestionCard.module.css';
import { cn } from '@/shared/lib';
import { Badge, Button } from '@/shared/ui';

export interface QuestionCardProps {
  index: number;
  text: string;
  options: string[];
  correctOptionIndex: number;
  onDelete?: () => void;
  className?: string;
}

/**
 * Карточка вопроса в режиме конструктора (учитель/админ).
 * Показывает текст, варианты и подсвечивает правильный ответ.
 * Удаление делегируется наружу через onDelete.
 */
export const QuestionCard = ({
  index,
  text,
  options,
  correctOptionIndex,
  onDelete,
  className,
}: QuestionCardProps) => (
  <section className={cn(styles.card, className)}>
    <header className={styles.header}>
      <span className={styles.number}>Вопрос {index + 1}</span>
      {onDelete && (
        <Button variant="ghost" size="sm" onClick={onDelete}>
          Удалить
        </Button>
      )}
    </header>

    <p className={styles.text}>{text}</p>

    <ol className={styles.options}>
      {options.map((option, optionIndex) => {
        const isCorrect = optionIndex === correctOptionIndex;
        return (
          <li key={optionIndex} className={cn(styles.option, isCorrect && styles.optionCorrect)}>
            <span className={styles.optionMarker}>{String.fromCharCode(65 + optionIndex)}</span>
            <span className={styles.optionText}>{option}</span>
            {isCorrect && <Badge variant="success">Правильный</Badge>}
          </li>
        );
      })}
    </ol>
  </section>
);
