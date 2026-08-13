import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { sessionActions, type SessionUser } from '@/entities/user';
import { createTestStore } from '@/test/test-utils';

import { RequireAuth, RequireRole } from './guards';

const adminUser: SessionUser = {
  id: 1,
  email: 'admin@school.local',
  role: 'ADMIN',
  className: null,
};

describe('RequireAuth', () => {
  it('редиректит на /login без токена', () => {
    const store = createTestStore();

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/login" element={<div>login-page</div>} />
            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <div>admin-content</div>
                </RequireAuth>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('login-page')).toBeInTheDocument();
    expect(screen.queryByText('admin-content')).not.toBeInTheDocument();
  });

  it('пропускает контент при наличии токена', () => {
    const store = createTestStore();
    store.dispatch(sessionActions.sessionSet({ token: 'mock.token', user: adminUser }));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <RequireAuth>
            <div>protected-content</div>
          </RequireAuth>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('protected-content')).toBeInTheDocument();
  });
});

describe('RequireRole', () => {
  it('показывает «Нет доступа» для чужой роли (без редиректа)', () => {
    const store = createTestStore();
    store.dispatch(sessionActions.sessionSet({ token: 'mock.token', user: adminUser }));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/student']}>
          <Routes>
            <Route
              path="/student"
              element={
                <RequireRole roles={['STUDENT']}>
                  <div>student-content</div>
                </RequireRole>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('❌ Нет доступа')).toBeInTheDocument();
    expect(screen.queryByText('student-content')).not.toBeInTheDocument();
  });

  it('пропускает контент подходящей роли', () => {
    const store = createTestStore();
    store.dispatch(sessionActions.sessionSet({ token: 'mock.token', user: adminUser }));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <RequireRole roles={['ADMIN']}>
            <div>admin-content</div>
          </RequireRole>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('admin-content')).toBeInTheDocument();
  });
});