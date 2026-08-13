import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import styles from './GrantAccessModal.module.css';
import { grantAccessSchema, type GrantAccessFormValues } from '../model/grantAccessSchema';
import { useGrantAccessMutation, useRevokeAccessMutation, type TestDto } from '@/entities/test';
import { getApiErrorMessage } from '@/shared/lib';
import { Alert, Button, Input, Modal, useToast } from '@/shared/ui';

interface GrantAccessModalProps {
  isOpen: boolean;
  test: TestDto | null;
  onClose: () => void;
}

/**
 * Выдача/отзыв доступа к тесту для целого класса (учитель/админ).
 * API идемпотентно: повторный grant просто обновляет isOpen=true.
 */
export const GrantAccessModal = ({ isOpen, test, onClose }: GrantAccessModalProps) => {
  const toast = useToast();
  const [grantAccess, grantState] = useGrantAccessMutation();
  const [revokeAccess, revokeState] = useRevokeAccessMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const isLoading = grantState.isLoading || revokeState.isLoading;

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<GrantAccessFormValues>({
    resolver: zodResolver(grantAccessSchema),
    defaultValues: { className: '' },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ className: '' });
      setFormError(null);
    }
  }, [isOpen, reset]);

  if (!test) return null;

  const run = async (grant: boolean, rawClassName: string) => {
    const className = rawClassName.trim();
    setFormError(null);

    try {
      if (grant) {
        await grantAccess({ testId: test.id, className }).unwrap();
        toast.success(`Доступ для класса ${className} открыт`);
      } else {
        await revokeAccess({ testId: test.id, className }).unwrap();
        toast.success(`Доступ для класса ${className} закрыт`);
      }
      onClose();
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    await run(true, values.className);
  });

  const handleRevoke = () => {
    const className = getValues('className').trim();
    if (className) void run(false, className);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Доступ к тесту: ${test.title}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Отмена
          </Button>
          <Button type="submit" form="grant-access-form" loading={isLoading}>
            Открыть доступ
          </Button>
        </>
      }
    >
      <form id="grant-access-form" className={styles.form} onSubmit={onSubmit} noValidate>
        {formError && <Alert variant="danger">{formError}</Alert>}

        <Input
          label="Класс"
          placeholder="9А"
          hint="Ученики этого класса получат доступ к тесту"
          error={errors.className?.message}
          {...register('className')}
        />

        <div className={styles.revokeBlock}>
          <p className={styles.revokeText}>
            Чтобы закрыть доступ, введите тот же класс и нажмите «Закрыть доступ»:
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isLoading}
            onClick={handleRevoke}
          >
            Закрыть доступ
          </Button>
        </div>
      </form>
    </Modal>
  );
};
