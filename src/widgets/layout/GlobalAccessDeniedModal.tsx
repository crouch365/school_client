import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/app/providers/store';
import { AccessDeniedModal } from '@/shared/ui';
import { selectAccessDenied, uiActions } from '@/shared/ui/model/uiSlice';

/**
 * Глобальная модалка «Нет доступа к данному ресурсу».
 * Открывается через uiSlice из baseQuery при 403 ответе API.
 * Рендерится в корневом layout роутера (внутри Router-контекста).
 */
export const GlobalAccessDeniedModal = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isOpen, message } = useAppSelector(selectAccessDenied);

  const handleClose = () => dispatch(uiActions.accessDeniedClosed());

  const handleHome = () => {
    dispatch(uiActions.accessDeniedClosed());
    navigate('/');
  };

  return (
    <AccessDeniedModal
      isOpen={isOpen}
      message={message}
      onClose={handleClose}
      onHome={handleHome}
    />
  );
};
