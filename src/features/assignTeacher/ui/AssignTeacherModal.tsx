import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import styles from './AssignTeacherModal.module.css';
import { assignItemSchema, type AssignItemFormValues } from '../model/assignSchema';
import {
  useAssignClassMutation,
  useAssignSubjectMutation,
  useGetTeacherProfileQuery,
  useRemoveClassMutation,
  useRemoveSubjectMutation,
  type TeacherProfile,
} from '@/entities/user';
import { getApiErrorMessage } from '@/shared/lib';
import { Alert, Button, Input, Modal, Spinner, useToast } from '@/shared/ui';

interface AssignTeacherModalProps {
  isOpen: boolean;
  teacher: TeacherProfile | null;
  onClose: () => void;
}

/**
 * Назначение классов и предметов учителю (только админ).
 * Данные обновляются автоматически: мутации инвалидируют tag 'Teacher'.
 */
export const AssignTeacherModal = ({ isOpen, teacher, onClose }: AssignTeacherModalProps) => {
  const toast = useToast();
  const [formError, setFormError] = useState<string | null>(null);

  const { data: profile, isLoading: profileLoading } = useGetTeacherProfileQuery(teacher?.id ?? 0, {
    skip: !isOpen || !teacher,
  });

  const [assignClass, assignClassState] = useAssignClassMutation();
  const [removeClass, removeClassState] = useRemoveClassMutation();
  const [assignSubject, assignSubjectState] = useAssignSubjectMutation();
  const [removeSubject, removeSubjectState] = useRemoveSubjectMutation();

  const classForm = useForm<AssignItemFormValues>({
    resolver: zodResolver(assignItemSchema),
    defaultValues: { value: '' },
  });
  const subjectForm = useForm<AssignItemFormValues>({
    resolver: zodResolver(assignItemSchema),
    defaultValues: { value: '' },
  });

  useEffect(() => {
    if (isOpen) {
      classForm.reset({ value: '' });
      subjectForm.reset({ value: '' });
      // setFormError(null);
    }
  }, [isOpen, classForm, subjectForm]);

  if (!teacher) return null;

  const teacherId = teacher.id;
  const isLoading =
    assignClassState.isLoading ||
    removeClassState.isLoading ||
    assignSubjectState.isLoading ||
    removeSubjectState.isLoading;

  const handleAssignClass = classForm.handleSubmit(async (values) => {
    setFormError(null);
    try {
      await assignClass({ teacherId, className: values.value.trim() }).unwrap();
      toast.success('Класс назначен');
      classForm.reset({ value: '' });
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    }
  });

  const handleAssignSubject = subjectForm.handleSubmit(async (values) => {
    setFormError(null);
    try {
      await assignSubject({ teacherId, subject: values.value.trim() }).unwrap();
      toast.success('Предмет назначен');
      subjectForm.reset({ value: '' });
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    }
  });

  const handleRemoveClass = async (className: string) => {
    setFormError(null);
    try {
      await removeClass({ teacherId, className }).unwrap();
      toast.success(`Класс ${className} откреплён`);
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    }
  };

  const handleRemoveSubject = async (subject: string) => {
    setFormError(null);
    try {
      await removeSubject({ teacherId, subject }).unwrap();
      toast.success(`Предмет «${subject}» откреплён`);
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${teacher.name} ${teacher.lastName}`}
      footer={
        <Button variant="secondary" onClick={onClose}>
          Готово
        </Button>
      }
    >
      {formError && <Alert variant="danger">{formError}</Alert>}

      {profileLoading ? (
        <Spinner />
      ) : (
        <div className={styles.sections}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Классы</h3>
            <div className={styles.chips}>
              {profile?.classes.map((className) => (
                <span key={className} className={styles.chip}>
                  {className}
                  <button
                    type="button"
                    className={styles.chipRemove}
                    onClick={() => handleRemoveClass(className)}
                    disabled={isLoading}
                    aria-label={`Убрать класс ${className}`}
                  >
                    ✕
                  </button>
                </span>
              ))}
              {profile?.classes.length === 0 && (
                <span className={styles.empty}>Классы не назначены</span>
              )}
            </div>

            <form className={styles.addRow} onSubmit={handleAssignClass} noValidate>
              <Input
                placeholder="Название класса, напр. 9А"
                aria-label="Добавить класс"
                error={classForm.formState.errors.value?.message}
                {...classForm.register('value')}
              />
              <Button type="submit" disabled={isLoading}>
                Добавить
              </Button>
            </form>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Предметы</h3>
            <div className={styles.chips}>
              {profile?.subjects.map((subject) => (
                <span key={subject} className={styles.chip}>
                  {subject}
                  <button
                    type="button"
                    className={styles.chipRemove}
                    onClick={() => handleRemoveSubject(subject)}
                    disabled={isLoading}
                    aria-label={`Убрать предмет ${subject}`}
                  >
                    ✕
                  </button>
                </span>
              ))}
              {profile?.subjects.length === 0 && (
                <span className={styles.empty}>Предметы не назначены</span>
              )}
            </div>

            <form className={styles.addRow} onSubmit={handleAssignSubject} noValidate>
              <Input
                placeholder="Название предмета, напр. Математика"
                aria-label="Добавить предмет"
                error={subjectForm.formState.errors.value?.message}
                {...subjectForm.register('value')}
              />
              <Button type="submit" disabled={isLoading}>
                Добавить
              </Button>
            </form>
          </section>
        </div>
      )}
    </Modal>
  );
};
