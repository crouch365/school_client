import { useMemo, useState } from 'react';

import styles from './AdminTeachersPage.module.css';
import { useGetUsersQuery, type TeacherProfile } from '@/entities/user';
import { AssignTeacherModal } from '@/features/assignTeacher';
import { Badge, Button, EmptyState, Skeleton } from '@/shared/ui';

export const AdminTeachersPage = () => {
  const { data, isFetching } = useGetUsersQuery({ page: 1, limit: 100 });
  const [selected, setSelected] = useState<TeacherProfile | null>(null);

  const teachers = useMemo(
    () => (data?.items ?? []).filter((user) => user.role === 'TEACHER'),
    [data],
  );

  const openAssignModal = (teacher: (typeof teachers)[number]) => {
    setSelected({
      id: teacher.id,
      name: teacher.name,
      lastName: teacher.lastName,
      email: teacher.email,
      // Классы и предметы подтянутся из getTeacherProfile внутри модалки
      classes: [],
      subjects: [],
    });
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Учителя</h1>

      {isFetching ? (
        <Skeleton height={200} borderRadius="var(--radius-md)" />
      ) : teachers.length === 0 ? (
        <EmptyState
          title="Учителя не найдены"
          description="Создайте учителя на странице «Пользователи»."
        />
      ) : (
        <div className={styles.list}>
          {teachers.map((teacher) => (
            <div key={teacher.id} className={styles.item}>
              <div className={styles.itemMain}>
                <div className={styles.itemName}>
                  {teacher.name} {teacher.lastName}
                </div>
                <div className={styles.itemEmail}>{teacher.email}</div>
              </div>
              <Badge variant="accent">
                {teacher.className ? `Класс: ${teacher.className}` : 'Без класса'}
              </Badge>
              <Button variant="secondary" size="sm" onClick={() => openAssignModal(teacher)}>
                Классы и предметы
              </Button>
            </div>
          ))}
        </div>
      )}

      <AssignTeacherModal
        isOpen={selected !== null}
        teacher={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
};
