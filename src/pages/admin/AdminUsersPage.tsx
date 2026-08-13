import { useState } from 'react';

import styles from './AdminUsersPage.module.css';
import { useGetUsersQuery, type User } from '@/entities/user';
import { DeleteUserModal, UserFormModal } from '@/features/manageUsers';
import { formatRole } from '@/shared/lib';
import { Badge, Button, EmptyState, Skeleton } from '@/shared/ui';

const roleVariant = (role: User['role']): 'info' | 'accent' | 'default' => {
  switch (role) {
    case 'ADMIN':
      return 'info';
    case 'TEACHER':
      return 'accent';
    default:
      return 'default';
  }
};

export const AdminUsersPage = () => {
  const [page, setPage] = useState(1);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const { data, isFetching } = useGetUsersQuery({ page, limit: 20 });

  const users = data?.items ?? [];
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Пользователи</h1>
        <Button onClick={() => setCreateOpen(true)}>+ Создать пользователя</Button>
      </div>

      {isFetching ? (
        <Skeleton height={240} borderRadius="var(--radius-md)" />
      ) : users.length === 0 ? (
        <EmptyState
          title="Пользователей нет"
          action={<Button onClick={() => setCreateOpen(true)}>+ Создать пользователя</Button>}
        />
      ) : (
        <div className={styles.wrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Email</th>
                <th>Роль</th>
                <th>Класс</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>
                    {user.name} {user.lastName}
                  </td>
                  <td className={styles.muted}>{user.email}</td>
                  <td>
                    <Badge variant={roleVariant(user.role)}>{formatRole(user.role)}</Badge>
                  </td>
                  <td>{user.className ?? '—'}</td>
                  <td>
                    <div className={styles.rowActions}>
                      <Button variant="ghost" size="sm" onClick={() => setEditingUser(user)}>
                        Изменить
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => setDeletingUser(user)}>
                        Удалить
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
          >
            ← Назад
          </Button>
          <span className={styles.pageInfo}>
            Страница {page} из {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
          >
            Далее →
          </Button>
        </div>
      )}

      <UserFormModal
        isOpen={isCreateOpen || editingUser !== null}
        user={editingUser}
        onClose={() => {
          setCreateOpen(false);
          setEditingUser(null);
        }}
      />

      <DeleteUserModal
        isOpen={deletingUser !== null}
        user={deletingUser}
        onClose={() => setDeletingUser(null)}
      />
    </div>
  );
};
