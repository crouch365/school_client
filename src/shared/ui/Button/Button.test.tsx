import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button } from './Button';

describe('Button', () => {
  it('рендерит контент и вызывает onClick', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(<Button onClick={onClick}>Сохранить</Button>);

    await user.click(screen.getByRole('button', { name: 'Сохранить' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('становится disabled в состоянии loading', () => {
    render(<Button loading>Загрузка</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('блокирует клики при disabled', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(<Button disabled onClick={onClick}>Отключено</Button>);

    await user.click(screen.getByRole('button', { name: 'Отключено' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('применяет variant danger', () => {
    render(<Button variant="danger">Удалить</Button>);
    expect(screen.getByRole('button', { name: 'Удалить' })).toHaveClass(
      'danger',
    );
  });

  it('передаёт type="submit" по запросу', () => {
    render(<Button type="submit">Отправить</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});