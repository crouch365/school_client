import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import styles from './TestFormModal.module.css';
import { createTestSchema, toCreateTestPayload, type CreateTestFormValues } from '../model/schemas';
import { useCreateTestMutation, useUpdateTestMutation, type TestDto } from '@/entities/test';
import { getApiErrorMessage } from '@/shared/lib';
import { Alert, Button, Input, Modal, Textarea, useToast } from '@/shared/ui';

interface TestFormModalProps {
  isOpen: boolean;
  test?: TestDto | null;
  onClose: () => void;
  onSaved?: (test: TestDto) => void;
}

/**
 * Создание/редактирование теста (учитель/админ).
 * После сохранения нового теста вызывается onSaved(test) —
 * обычно для перехода в конструктор.
 */
export const TestFormModal = ({ isOpen, test, onClose, onSaved }: TestFormModalProps) => {
  const toast = useToast();
  const [createTest, createState] = useCreateTestMutation();
  const [updateTest, updateState] = useUpdateTestMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const isEdit = Boolean(test);
  const isLoading = createState.isLoading || updateState.isLoading;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTestFormValues>({
    resolver: zodResolver(createTestSchema),
    defaultValues: {
      subject: '',
      title: '',
      description: '',
      timeLimitMinutes: 10,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        subject: test?.subject ?? '',
        title: test?.title ?? '',
        description: test?.description ?? '',
        timeLimitMinutes: test ? Math.round(test.timeLimit / 60) || 1 : 10,
      });
      setFormError(null);
    }
  }, [isOpen, test, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    try {
      if (test) {
        const saved = await updateTest({
          id: test.id,
          body: toCreateTestPayload(values),
        }).unwrap();
        toast.success('Тест обновлён');
        onSaved?.(saved);
        onClose();
      } else {
        const created = await createTest(toCreateTestPayload(values)).unwrap();
        toast.success('Тест создан');
        onSaved?.(created);
        onClose();
      }
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    }
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Настройки теста' : 'Новый тест'}
      footer={
        <Button type="submit" form="test-form" loading={isLoading}>
          {isEdit ? 'Сохранить' : 'Создать'}
        </Button>
      }
    >
      <form id="test-form" className={styles.form} onSubmit={onSubmit} noValidate>
        {formError && <Alert variant="danger">{formError}</Alert>}

        <Input
          label="Название"
          placeholder="Контрольная по алгебре"
          error={errors.title?.message}
          {...register('title')}
        />

        <Input
          label="Предмет"
          placeholder="Математика"
          hint="Учитель может создавать тесты только по своим предметам"
          error={errors.subject?.message}
          {...register('subject')}
        />

        <Textarea
          label="Описание"
          placeholder="Краткое описание теста (необязательно)"
          error={errors.description?.message}
          {...register('description')}
        />

        <Input
          label="Время на тест, минут"
          type="number"
          min={1}
          error={errors.timeLimitMinutes?.message}
          {...register('timeLimitMinutes')}
        />
      </form>
    </Modal>
  );
};
