import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';

export interface AccessDeniedModalProps {
  isOpen: boolean;
  message?: string | null;
  onClose: () => void;
  onHome?: () => void;
}

/**
 * Модалка «Нет доступа» — переиспользуется:
 *  - глобально при 403 от API (baseQuery);
 *  - в Route Guard `RequireRole` при заходе не на своём роуте.
 */
export const AccessDeniedModal = ({ isOpen, message, onClose, onHome }: AccessDeniedModalProps) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="❌ Нет доступа"
    footer={
      <>
        <Button variant="secondary" onClick={onClose}>
          Закрыть
        </Button>
        {onHome && <Button onClick={onHome}>Вернуться на главную</Button>}
      </>
    }
  >
    <p>{message ?? 'Нет доступа к данному ресурсу.'}</p>
  </Modal>
);
