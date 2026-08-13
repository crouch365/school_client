import { useParams } from 'react-router-dom';

import styles from './StudentTestTakePage.module.css';
import { useGetTestByIdQuery } from '@/entities/test';
import { TakeTestTaker } from '@/features/takeTest';
import { getApiErrorMessage } from '@/shared/lib';
import { Alert, Spinner } from '@/shared/ui';

/**
 * Fullscreen-режим прохождения теста (без AppShell).
 * При 403 (нет доступа) сработает глобальная модалка «Нет доступа».
 */
export const StudentTestTakePage = () => {
  const { testId } = useParams<{ testId: string }>();
  const id = Number(testId);
  const hasValidId = Number.isInteger(id) && id > 0;

  const {
    data: test,
    isLoading,
    error,
  } = useGetTestByIdQuery(id, {
    skip: !hasValidId,
  });

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.loading}>
        <Alert variant="danger">{getApiErrorMessage(error)}</Alert>
      </div>
    );
  }

  if (!test) return null;

  return <TakeTestTaker test={test} />;
};
