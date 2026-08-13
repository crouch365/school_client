import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import styles from './UserFormModal.module.css';
import { createUserSchema, type CreateUserFormValues } from '../model/createUserSchema';
import {
  useCreateUserMutation,
  useUpdateUserMutation,
  type CreatedUserResult,
  type User,
} from '@/entities/user';
import { getApiErrorMessage } from '@/shared/lib';
import { Alert, Button, Input, Modal, useToast } from '@/shared/ui';

interface UserFormModalProps {
  isOpen: boolean;
  user?: User | null;
  onClose: () => void;
}

/**
 * Модалка создания/редактирования пользователя (админ).
 * Создание: сервер генерирует email и пароль — показываем их один раз.
 * Редактирование: без email/пароля.
 */
export const UserFormModal = ({ isOpen, user, onClose }: UserFormModalProps) => {
  const toast = useToast();
  const [createUser, createState] = useCreateUserMutation();
  const [updateUser, updateState] = useUpdateUserMutation();
  const [generated, setGenerated] = useState<CreatedUserResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const isEdit = Boolean(user);
  const isLoading = createState.isLoading || updateState.isLoading;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      lastName: '',
      role: 'STUDENT',
      className: '',
    },
  });

  const role = watch('role');
  const isStudent = role === 'STUDENT';

  useEffect(() => {
    if (isOpen) {
      reset({
        name: user?.name ?? '',
        lastName: user?.lastName ?? '',
        role: user?.role ?? 'STUDENT',
        className: user?.className ?? '',
      });
      setGenerated(null);
      setFormError(null);
    }
  }, [isOpen, user, reset]);

  const classNameValue = (className?: string | null): string | null =>
    isStudent ? className?.trim() || null : null;

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    try {
      if (user) {
        await updateUser({
          id: user.id,
          body: {
            name: values.name,
            lastName: values.lastName,
            role: values.role,
            className: classNameValue(values.className),
          },
        }).unwrap();
        toast.success('Пользователь обновлён');
        onClose();
      } else {
        const created = await createUser({
          name: values.name,
          lastName: values.lastName,
          role: values.role,
          className: classNameValue(values.className),
        }).unwrap();
        setGenerated(created);
        toast.success('Пользователь создан');
      }
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    }
  });

  const handleCopy = () => {
    if (!generated) return;
    void navigator.clipboard?.writeText(`${generated.email}\n${generated.plainPassword}`);
    toast.success('Данные скопированы');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Редактирование пользователя' : 'Создание пользователя'}
      footer={
        <Button type="submit" form="user-form" loading={isLoading} disabled={Boolean(generated)}>
          {isEdit ? 'Сохранить' : 'Создать'}
        </Button>
      }
    >
      {generated ? (
        <div className={styles.credentials}>
          <Alert variant="success">Пароль генерируется один раз — сохраните его сейчас!</Alert>
          <Alert variant="info">
            <div className={styles.credentialsRow}>
              <span>Email:</span>
              <code>{generated.email}</code>
            </div>
            <div className={styles.credentialsRow}>
              <span>Пароль:</span>
              <code>{generated.plainPassword}</code>
            </div>
          </Alert>
          <Button variant="secondary" onClick={handleCopy}>
            Скопировать данные
          </Button>
        </div>
      ) : (
        <form id="user-form" className={styles.form} onSubmit={onSubmit} noValidate>
          {formError && <Alert variant="danger">{formError}</Alert>}

          <Input
            label="Имя"
            placeholder="Иван"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Фамилия"
            placeholder="Иванов"
            error={errors.lastName?.message}
            {...register('lastName')}
          />

          <div className={styles.field}>
            <label className={styles.label} htmlFor="user-role">
              Роль
            </label>
            <select id="user-role" className={styles.select} {...register('role')}>
              <option value="STUDENT">Ученик</option>
              <option value="TEACHER">Учитель</option>
              <option value="ADMIN">Администратор</option>
            </select>
          </div>

          {isStudent && (
            <Input
              label="Класс"
              placeholder="9А"
              hint="Нужен ученику для доступа к тестам"
              error={errors.className?.message}
              {...register('className')}
            />
          )}
        </form>
      )}
    </Modal>
  );
};
