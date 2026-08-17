import type { JwtPayloadShape } from '@/shared/lib';

export type MockRole = JwtPayloadShape['role'];

export interface MockUser {
  id: number;
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: MockRole;
  className: string | null;
}

export interface MockTest {
  id: number;
  teacherId: number;
  subject: string;
  title: string;
  description: string | null;
  timeLimit: number;
}

export interface MockQuestion {
  id: number;
  testId: number;
  text: string;
  options: string[];
  correctOptionIndex: number;
}

export interface MockAccess {
  id: number;
  testId: number;
  className: string;
  isOpen: boolean;
  openedAt: string | null;
  closedAt: string | null;
}

export interface MockAttempt {
  id: number;
  studentId: number;
  testId: number;
  startedAt: string;
  finishedAt: string | null;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';
  score: number | null;
  totalQuestions: number | null;
  answers: number[] | null;
}

/**
 * In-memory «БД» для MSW. Мутации меняют массивы на месте —
 * это даёт полноценный CRUD-демо без бэкенда.
 */

export const users: MockUser[] = [
  {
    id: 1,
    name: 'Админ',
    lastName: 'Главный',
    email: 'qwe.edfffff@school.local',
    password: 'PjhNSSVhplOyvm6',
    role: 'ADMIN',
    className: null,
  },
  {
    id: 2,
    name: 'Мария',
    lastName: 'Иванова',
    email: 'teacher1@school.local',
    password: 'teacher123',
    role: 'TEACHER',
    className: null,
  },
  {
    id: 3,
    name: 'Пётр',
    lastName: 'Смирнов',
    email: 'teacher2@school.local',
    password: 'teacher123',
    role: 'TEACHER',
    className: null,
  },
  {
    id: 4,
    name: 'Анна',
    lastName: 'Сидорова',
    email: 'student1@school.local',
    password: 'student123',
    role: 'STUDENT',
    className: '9А',
  },
  {
    id: 5,
    name: 'Иван',
    lastName: 'Петров',
    email: 'student2@school.local',
    password: 'student123',
    role: 'STUDENT',
    className: '9А',
  },
  {
    id: 6,
    name: 'Ольга',
    lastName: 'Козлова',
    email: 'student3@school.local',
    password: 'student123',
    role: 'STUDENT',
    className: '9Б',
  },
];

export const teacherClasses: { teacherId: number; className: string }[] = [
  { teacherId: 2, className: '9А' },
  { teacherId: 2, className: '9Б' },
  { teacherId: 3, className: '9А' },
];

export const teacherSubjects: { teacherId: number; subject: string }[] = [
  { teacherId: 2, subject: 'Математика' },
  { teacherId: 2, subject: 'Алгебра' },
  { teacherId: 3, subject: 'История' },
];

export const tests: MockTest[] = [
  {
    id: 1,
    teacherId: 2,
    subject: 'Математика',
    title: 'Контрольная по алгебре',
    description: 'Уравнения и неравенства первой степени',
    timeLimit: 600,
  },
  {
    id: 2,
    teacherId: 2,
    subject: 'Алгебра',
    title: 'Самостоятельная: производные',
    description: null,
    timeLimit: 900,
  },
  {
    id: 3,
    teacherId: 3,
    subject: 'История',
    title: 'Древний мир',
    description: 'Греция и Рим',
    timeLimit: 1200,
  },
  {
    id: 4,
    teacherId: 3,
    subject: 'История',
    title: 'Средние века',
    description: 'Подготовка к зачёту',
    timeLimit: 1500,
  },
];

export const questions: MockQuestion[] = [
  {
    id: 1,
    testId: 1,
    text: 'Сколько будет 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctOptionIndex: 1,
  },
  {
    id: 2,
    testId: 1,
    text: 'Решите уравнение x − 5 = 10',
    options: ['x = 5', 'x = 10', 'x = 15', 'x = −5'],
    correctOptionIndex: 2,
  },
  {
    id: 3,
    testId: 1,
    text: 'Что из перечисленного является корнем уравнения 3x = 12?',
    options: ['x = 4', 'x = 3', 'x = 9'],
    correctOptionIndex: 0,
  },
  {
    id: 4,
    testId: 2,
    text: 'Производная константы равна…',
    options: ['0', '1', 'самой константе'],
    correctOptionIndex: 0,
  },
  {
    id: 5,
    testId: 2,
    text: 'Производная функции x² равна…',
    options: ['x', '2x', '2', 'x³/3'],
    correctOptionIndex: 1,
  },
  {
    id: 6,
    testId: 3,
    text: 'Столица Древнего Рима — это…',
    options: ['Афины', 'Рим', 'Карфаген'],
    correctOptionIndex: 1,
  },
  {
    id: 7,
    testId: 3,
    text: 'Кто был первым римским императором?',
    options: ['Цезарь', 'Октавиан Август', 'Нерон'],
    correctOptionIndex: 1,
  },
];

export const accesses: MockAccess[] = [
  {
    id: 1,
    testId: 1,
    className: '9А',
    isOpen: true,
    openedAt: '2026-08-01T09:00:00.000Z',
    closedAt: null,
  },
  {
    id: 2,
    testId: 2,
    className: '9А',
    isOpen: true,
    openedAt: '2026-08-02T09:00:00.000Z',
    closedAt: null,
  },
  {
    id: 3,
    testId: 3,
    className: '9Б',
    isOpen: true,
    openedAt: '2026-08-03T09:00:00.000Z',
    closedAt: null,
  },
];

export const attempts: MockAttempt[] = [
  {
    id: 1,
    studentId: 4,
    testId: 1,
    startedAt: '2026-08-04T10:00:00.000Z',
    finishedAt: '2026-08-04T10:06:00.000Z',
    status: 'COMPLETED',
    score: 2,
    totalQuestions: 3,
    answers: [1, 2, 0],
  },
  {
    id: 2,
    studentId: 4,
    testId: 2,
    startedAt: '2026-08-05T10:00:00.000Z',
    finishedAt: '2026-08-05T10:12:00.000Z',
    status: 'COMPLETED',
    score: 1,
    totalQuestions: 2,
    answers: [0, 1],
  },
  {
    id: 3,
    studentId: 5,
    testId: 1,
    startedAt: '2026-08-04T10:00:00.000Z',
    finishedAt: '2026-08-04T10:09:00.000Z',
    status: 'COMPLETED',
    score: 3,
    totalQuestions: 3,
    answers: [1, 2, 0],
  },
];

export const counters = { user: 10, test: 10, question: 10, accessId: 10, attempt: 10 };
