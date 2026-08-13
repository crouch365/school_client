import { lazy, Suspense, type ComponentType, type ReactNode } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';

import { RedirectByRole, RequireAuth, RequireRole } from './guards';
import { AppShell, GlobalAccessDeniedModal, PageLoader } from '@/widgets/layout';

/**
 * Lazy-подгрузка страниц с сохранением именованных экспортов.
 */
const withLazy = (
  loader: () => Promise<Record<string, ComponentType>>,
  name: string,
): ComponentType => {
  const LazyComponent = lazy(() => loader().then((module) => ({ default: module[name] })));
  return LazyComponent;
};

/* Экраны авторизации */
const LoginPage = withLazy(() => import('@/pages/auth/LoginPage'), 'LoginPage');

/* ADMIN */
const AdminUsersPage = withLazy(() => import('@/pages/admin/AdminUsersPage'), 'AdminUsersPage');
const AdminTeachersPage = withLazy(
  () => import('@/pages/admin/AdminTeachersPage'),
  'AdminTeachersPage',
);
const AdminAccessPage = withLazy(() => import('@/pages/admin/AdminAccessPage'), 'AdminAccessPage');

/* TEACHER */
const TeacherDashboardPage = withLazy(
  () => import('@/pages/teacher/TeacherDashboardPage'),
  'TeacherDashboardPage',
);
const TeacherTestsPage = withLazy(
  () => import('@/pages/teacher/TeacherTestsPage'),
  'TeacherTestsPage',
);
const TeacherTestBuilderPage = withLazy(
  () => import('@/pages/teacher/TeacherTestBuilderPage'),
  'TeacherTestBuilderPage',
);
const TeacherTestResultsPage = withLazy(
  () => import('@/pages/teacher/TeacherTestResultsPage'),
  'TeacherTestResultsPage',
);

/* STUDENT */
const StudentTestsPage = withLazy(
  () => import('@/pages/student/StudentTestsPage'),
  'StudentTestsPage',
);
const StudentTestTakePage = withLazy(
  () => import('@/pages/student/StudentTestTakePage'),
  'StudentTestTakePage',
);
const StudentResultsPage = withLazy(
  () => import('@/pages/student/StudentResultsPage'),
  'StudentResultsPage',
);

const NotFoundPage = withLazy(() => import('@/pages/Error/NotFoundPage'), 'NotFoundPage');

/** Обёртка для Suspense на ленивых страницах. */
const Page = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    /* Корневой layout: контент + глобальная модалка 403 (внутри Router-контекста) */
    element: (
      <>
        <Outlet />
        <GlobalAccessDeniedModal />
      </>
    ),
    children: [
      { path: '/', element: <RedirectByRole /> },

      {
        path: '/login',
        element: (
          <Page>
            <LoginPage />
          </Page>
        ),
      },

      /* ===== ADMIN ===== */
      {
        path: '/admin',
        element: (
          <RequireAuth>
            <RequireRole roles={['ADMIN']}>
              <AppShell />
            </RequireRole>
          </RequireAuth>
        ),
        children: [
          { index: true, element: <Navigate to="/admin/users" replace /> },
          {
            path: 'users',
            element: (
              <Page>
                <AdminUsersPage />
              </Page>
            ),
          },
          {
            path: 'teachers',
            element: (
              <Page>
                <AdminTeachersPage />
              </Page>
            ),
          },
          {
            path: 'access',
            element: (
              <Page>
                <AdminAccessPage />
              </Page>
            ),
          },
        ],
      },

      /* ===== TEACHER ===== */
      {
        path: '/teacher',
        element: (
          <RequireAuth>
            <RequireRole roles={['TEACHER']}>
              <AppShell />
            </RequireRole>
          </RequireAuth>
        ),
        children: [
          { index: true, element: <Navigate to="/teacher/dashboard" replace /> },
          {
            path: 'dashboard',
            element: (
              <Page>
                <TeacherDashboardPage />
              </Page>
            ),
          },
          {
            path: 'tests',
            element: (
              <Page>
                <TeacherTestsPage />
              </Page>
            ),
          },
          {
            path: 'tests/:testId/builder',
            element: (
              <Page>
                <TeacherTestBuilderPage />
              </Page>
            ),
          },
          {
            path: 'tests/:testId/results',
            element: (
              <Page>
                <TeacherTestResultsPage />
              </Page>
            ),
          },
        ],
      },

      /* ===== STUDENT ===== */
      {
        path: '/student',
        element: (
          <RequireAuth>
            <RequireRole roles={['STUDENT']}>
              <AppShell />
            </RequireRole>
          </RequireAuth>
        ),
        children: [
          { index: true, element: <Navigate to="/student/tests" replace /> },
          {
            path: 'tests',
            element: (
              <Page>
                <StudentTestsPage />
              </Page>
            ),
          },
          {
            path: 'results',
            element: (
              <Page>
                <StudentResultsPage />
              </Page>
            ),
          },
        ],
      },

      /* Fullscreen-режим прохождения теста (без AppShell) */
      {
        path: '/student/tests/:testId/take',
        element: (
          <RequireAuth>
            <RequireRole roles={['STUDENT']}>
              <Page>
                <StudentTestTakePage />
              </Page>
            </RequireRole>
          </RequireAuth>
        ),
      },

      {
        path: '*',
        element: (
          <Page>
            <NotFoundPage />
          </Page>
        ),
      },
    ],
  },
]);
