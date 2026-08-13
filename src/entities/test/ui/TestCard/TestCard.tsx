import type { ReactNode } from 'react';

import styles from './TestCard.module.css';
import type { SafeTestDto, TestDto } from '../../model/types';
import { cn, formatDuration } from '@/shared/lib';
import { Badge } from '@/shared/ui';

export interface TestCardProps {
  test: TestDto | SafeTestDto;
  actions?: ReactNode;
  className?: string;
}

/**
 * Карточка теста (entity/ui). Чисто презентационная:
 * заголовок, бейдж предмета, описание, мета-данные.
 * Кнопки действий зависят от роли и передаются через prop `actions`
 * (сами действия живут в features/widgets).
 */
export const TestCard = ({ test, actions, className }: TestCardProps) => {
  const questionCount = test.questions?.length ?? 0;

  return (
    <article className={cn(styles.card, className)}>
      <div className={styles.top}>
        <Badge variant="accent">{test.subject}</Badge>
      </div>

      <h3 className={styles.title}>{test.title}</h3>

      {test.description && <p className={styles.description}>{test.description}</p>}

      <dl className={styles.meta}>
        <div className={styles.metaItem}>
          <dt aria-hidden="true">⏱</dt>
          <dd>{formatDuration(test.timeLimit)}</dd>
        </div>
        <div className={styles.metaItem}>
          <dt aria-hidden="true">❓</dt>
          <dd>
            {questionCount > 0
              ? `${questionCount} ${questionCount === 1 ? 'вопрос' : questionCount < 5 ? 'вопроса' : 'вопросов'}`
              : 'Вопросы не добавлены'}
          </dd>
        </div>
      </dl>

      {actions && <div className={styles.actions}>{actions}</div>}
    </article>
  );
};
