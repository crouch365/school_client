import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { SafeQuestionDto } from '@/entities/question';

import { QuestionStep } from './QuestionStep';

const question: SafeQuestionDto = {
  id: 1,
  text: 'Сколько будет 2 + 2?',
  options: ['3', '4', '5'],
};

describe('QuestionStep', () => {
  it('рендерит текст вопроса и все варианты', () => {
    render(
      <QuestionStep
        question={question}
        index={0}
        total={3}
        selectedOption={null}
        onSelect={jest.fn()}
      />,
    );

    expect(screen.getByText('Сколько будет 2 + 2?')).toBeInTheDocument();
    expect(screen.getByText('Вопрос 1 из 3')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('вызывает onSelect с индексом выбранного варианта', async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();

    render(
      <QuestionStep
        question={question}
        index={0}
        total={3}
        selectedOption={null}
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByRole('button', { name: /4/ }));
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it('подсвечивает выбранный вариант', () => {
    render(
      <QuestionStep
        question={question}
        index={0}
        total={3}
        selectedOption={2}
        onSelect={jest.fn()}
      />,
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons[2]).toHaveClass('optionSelected');
    expect(buttons[0]).not.toHaveClass('optionSelected');
  });
});