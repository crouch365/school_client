import { fireEvent, render, screen } from '@testing-library/react';

import { Modal } from './Modal';
import styles from './Modal.module.css';

describe('Modal', () => {
  it('рендерит содержимое через портал', () => {
    render(
      <Modal isOpen onClose={jest.fn()} title="Заголовок">
        Тело модалки
      </Modal>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Тело модалки')).toBeInTheDocument();
    expect(screen.getByText('Заголовок')).toBeInTheDocument();
  });

  it('не рендерится, когда isOpen=false', () => {
    render(
      <Modal isOpen={false} onClose={jest.fn()}>
        Тело
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('закрывается по Escape', () => {
    const onClose = jest.fn();

    render(<Modal isOpen onClose={onClose} title="Окно" />);

    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('закрывается по клику на оверлей', () => {
    const onClose = jest.fn();

    render(<Modal isOpen onClose={onClose} title="Окно" />);

    const overlay = document.querySelector(`.${styles.overlay}`) as HTMLElement;
    fireEvent.mouseDown(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('блокирует скролл body при открытии', () => {
    render(<Modal isOpen onClose={jest.fn()} title="Окно" />);
    expect(document.body.style.overflow).toBe('hidden');
  });
});
