import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import styles from './LoginForm.module.css';
import { loginSchema, type LoginFormValues } from '../model/loginSchema';
import { useAppDispatch } from '@/app/providers/store';
import { buildSessionUser, sessionActions, useLoginMutation, type UserRole } from '@/entities/user';
import { getApiErrorMessage, storage } from '@/shared/lib';
import { Alert, Button, Input } from '@/shared/ui';

const ROLE_HOME: Record<UserRole, string> = {
  ADMIN: '/admin',
  TEACHER: '/teacher',
  STUDENT: '/student',
};

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [login, { isLoading }] = useLoginMutation();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    try {
      const { token } = await login(values).unwrap();
      const sessionUser = buildSessionUser(token);

      if (!sessionUser) {
        throw new Error('Не удалось прочитать данные пользователя из токена');
      }

      storage.setToken(token);
      dispatch(sessionActions.sessionSet({ token, user: sessionUser }));

      const from = (location.state as { from?: string } | null)?.from;
      navigate(from ?? ROLE_HOME[sessionUser.role], { replace: true });
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    }
  });

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <h1 className={styles.heading}>Вход в School</h1>

      {formError && <Alert variant="danger">{formError}</Alert>}

      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@school.local"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Пароль"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" loading={isLoading} fullWidth>
        Войти
      </Button>
    </form>
  );
};
