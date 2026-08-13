import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { DEMO_PAYLOADS, signMockToken } from '@/mocks/token';
import { createTestStore } from '@/test/test-utils';

import { LoginForm } from './LoginForm';

const mockLogin = jest.fn();

jest.mock('@/entities/user', () => {
  const actual = jest.requireActual('@/entities/user');
  return {
    ...actual,
    useLoginMutation: () => [mockLogin, { isLoading: false }],
  };
});

const renderLoginForm = () => {
  const store = createTestStore();

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/admin" element={<div>admin-home</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );

  return store;
};

const mockLoginSuccess = () => {
  mockLogin.mockReturnValue({
    unwrap: () =>
      Promise.resolve({
        token: signMockToken(DEMO_PAYLOADS.ADMIN),
      }),
  });
};

const mockLoginFailure = () => {
  mockLogin.mockReturnValue({
    unwrap: () =>
      Promise.reject({
        data: { message: 'Неверный email или пароль' },
        status: 401,
      }),
  });
};

const CREDENTIALS = {
  email: 'qwe.edfffff@school.local',
  password: 'PjhNSSVhplOyvm6',
};

describe('LoginForm', () => {
  beforeEach(() => {
    mockLogin.mockReset();
    window.localStorage.clear();
  });

  it('показывает ошибки валидации при пустой отправке', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    await user.click(screen.getByRole('button', { name: 'Войти' }));

    expect(await screen.findByText('Введите email')).toBeInTheDocument();
    expect(
      screen.getByText('Пароль должен содержать не менее 6 символов'),
    ).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('сообщает об ошибке от API', async () => {
    mockLoginFailure();
    const user = userEvent.setup();
    renderLoginForm();

    await user.type(screen.getByLabelText('Email'), 'wrong@school.local');
    await user.type(screen.getByLabelText('Пароль'), 'wrongpass');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    expect(
      await screen.findByText('Неверный email или пароль'),
    ).toBeInTheDocument();
  });

  it('успешно логинится, сохраняет токен и редиректит по роли', async () => {
    mockLoginSuccess();
    const user = userEvent.setup();
    const store = renderLoginForm();

    await user.type(screen.getByLabelText('Email'), CREDENTIALS.email);
    await user.type(screen.getByLabelText('Пароль'), CREDENTIALS.password);
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => {
      expect(screen.getByText('admin-home')).toBeInTheDocument();
    });

    expect(mockLogin).toHaveBeenCalledWith(CREDENTIALS);
    expect(store.getState().session.token).toBeTruthy();
    expect(window.localStorage.getItem('school_token')).toBeTruthy();
  });
});