import { useState } from 'react';

import { useDeleteUserMutation, type User } from '@/entities/user';
import { getApiErrorMessage } from '@/shared/lib';
import { Alert, Button, Modal, useToast } from '@/shared/ui';

interface DeleteUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
}

export const DeleteUserModal = ({ isOpen, user, onClose }: DeleteUserModalProps) => {
  const toast = useToast();
  const [deleteUser, { isLoading }] = useDeleteUserMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!user) return;
    setFormError(null);

    try {
      await deleteUser(user.id).unwrap();
      toast.success('Пользователь удалён');
      onClose();
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Удаление пользователя"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Отмена
          </Button>
          <Button variant="danger" onClick={handleDelete} loading={isLoading}>
            Удалить
          </Button>
        </>
      }
    >
      <p>
        Вы уверены, что хотите удалить пользователя{' '}
        <strong>
          {user?.name} {user?.lastName}
        </strong>
        ? Действие необратимо.
      </p>
      {formError && <Alert variant="danger">{formError}</Alert>}
    </Modal>
  );
};
