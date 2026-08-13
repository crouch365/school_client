import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Input } from './Input';

describe('Input', () => {
  it('отображает label и связывает его с полем', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('показывает текст ошибки', () => {
    render(<Input label="Email" error="Некорректный email" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Некорректный email');
    expect(screen.getByLabelText('Email')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('передаёт значение в onChange', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<Input label="Имя" onChange={onChange} />);

    await user.type(screen.getByLabelText('Имя'), 'Иван');
    expect(onChange).toHaveBeenCalled();
  });

  it('блокирует поле при disabled', () => {
    render(<Input label="Класс" disabled />);
    expect(screen.getByLabelText('Класс')).toBeDisabled();
  });

  it('показывает справочный текст при отсутствии ошибки', () => {
    render(<Input label="Класс" hint="Например 9А" />);
    expect(screen.getByText('Например 9А')).toBeInTheDocument();
  });
});