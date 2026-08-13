export const USER_ROLES = ['ADMIN', 'TEACHER', 'STUDENT'] as const;

export type UserRole = (typeof USER_ROLES)[number];

/** Пользователь из payload JWT (без чувствительных данных). */
export interface SessionUser {
  id: number;
  email: string;
  role: UserRole;
  className: string | null;
}

/** Полная карточка пользователя (из /users). */
export interface User extends SessionUser {
  name: string;
  lastName: string;
}

export interface CreateUserPayload {
  name: string;
  lastName: string;
  role: UserRole;
  className?: string | null;
}

export interface UpdateUserPayload {
  name?: string;
  lastName?: string;
  role?: UserRole;
  className?: string | null;
}

/** Ответ на создание: сервер генерирует email и пароль. */
export interface CreatedUserResult extends User {
  plainPassword: string;
}

/** Ответ списка пользователей: пагинация. */
export interface UsersPage {
  items: User[];
  total: number;
  page: number;
  limit: number;
}

/** Профиль учителя: {…, classes: string[], subjects: string[]}. */
export interface TeacherProfile {
  id: number;
  name: string;
  lastName: string;
  email: string;
  classes: string[];
  subjects: string[];
}
