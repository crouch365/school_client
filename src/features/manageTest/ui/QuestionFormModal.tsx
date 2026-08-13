import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import styles from './QuestionFormModal.module.css';
import { questionSchema, type QuestionFormValues } from '../model/schemas';
import { useAddQuestionMutation } from '@/entities/question';
import { getApiErrorMessage } from '@/shared/lib';
import { Alert, Button, Input, Modal, Textarea, useToast } from '@/shared/ui';

interface QuestionFormModalProps {
  isOpen: boolean;
  testId: number;
  onClose: () => void;
}

/**
 * Модалка добавления вопроса в тест (конструктор).
 * Динамический список вариантов (минимум 2) + выбор правильного.
 */
export const QuestionFormModal = ({ isOpen, testId, onClose }: QuestionFormModalProps) => {
  const toast = useToast();
  const [addQuestion, { isLoading }] = useAddQuestionMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: '',
      options: [{ value: '' }, { value: '' }],
      correctOptionIndex: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  });

  const options = watch('options');
  const correctOptionIndex = watch('correctOptionIndex');

  useEffect(() => {
    if (isOpen) {
      reset({
        text: '',
        options: [{ value: '' }, { value: '' }],
        correctOptionIndex: 0,
      });
      setFormError(null);
    }
  }, [isOpen, reset]);

  const handleCorrectChange = (index: number) => {
    setValue('correctOptionIndex', index, { shouldValidate: true });
  };

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    try {
      await addQuestion({
        testId,
        payload: {
          text: values.text,
          options: values.options.map((option) => option.value.trim()),
          correctOptionIndex: values.correctOptionIndex,
        },
      }).unwrap();
      toast.success('Вопрос добавлен');
      onClose();
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    }
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Новый вопрос"
      footer={
        <Button type="submit" form="question-form" loading={isLoading}>
          Добавить вопрос
        </Button>
      }
    >
      <form id="question-form" className={styles.form} onSubmit={onSubmit} noValidate>
        {formError && <Alert variant="danger">{formError}</Alert>}

        <Textarea
          label="Текст вопроса"
          placeholder="Введите формулировку вопроса"
          error={errors.text?.message}
          {...register('text')}
        />

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Варианты ответа</legend>

          {(errors.options?.message || errors.correctOptionIndex?.message) && (
            <Alert variant="danger">
              {errors.options?.message ?? errors.correctOptionIndex?.message}
            </Alert>
          )}

          <div className={styles.optionsList}>
            {fields.map((field, index) => (
              <div key={field.id} className={styles.optionRow}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    className={styles.radio}
                    name="correct-option"
                    checked={correctOptionIndex === index}
                    onChange={() => handleCorrectChange(index)}
                    aria-label={`Сделать вариант ${index + 1} правильным`}
                  />
                </label>
                <Input
                  placeholder={`Вариант ${index + 1}`}
                  aria-label={`Вариант ${index + 1}`}
                  {...register(`options.${index}.value` as const)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={fields.length <= 2}
                  onClick={() => remove(index)}
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>

          <div className={styles.correctRow}>
            <span className={styles.correctLabel}>Правильный ответ:</span>
            <span className={styles.correctValue}>
              {correctOptionIndex < options.length ? `Вариант ${correctOptionIndex + 1}` : '—'}
            </span>
          </div>

          <Button type="button" variant="secondary" size="sm" onClick={() => append({ value: '' })}>
            + Добавить вариант
          </Button>
        </fieldset>
      </form>
    </Modal>
  );
};
