import styles from './QuestionStep.module.css';
import type { SafeQuestionDto } from '@/entities/question';
import { cn } from '@/shared/lib';

interface QuestionStepProps {
  question: SafeQuestionDto;
  index: number;
  total: number;
  selectedOption: number | null;
  onSelect: (optionIndex: number) => void;
}

/**
 * Шаг прохождения: текст вопроса + кликабельные варианты.
 * Выбранный вариант подсвечивается акцентным цветом.
 */
export const QuestionStep = ({
  question,
  index,
  total,
  selectedOption,
  onSelect,
}: QuestionStepProps) => (
  <section className={styles.root}>
    <div className={styles.progress}>
      Вопрос {index + 1} из {total}
    </div>
    <h2 className={styles.text}>{question.text}</h2>

    <div className={styles.options}>
      {question.options.map((option, optionIndex) => (
        <button
          key={optionIndex}
          type="button"
          className={cn(styles.option, selectedOption === optionIndex && styles.optionSelected)}
          onClick={() => onSelect(optionIndex)}
        >
          <span className={styles.marker}>{String.fromCharCode(65 + optionIndex)}</span>
          <span className={styles.optionText}>{option}</span>
        </button>
      ))}
    </div>
  </section>
);
