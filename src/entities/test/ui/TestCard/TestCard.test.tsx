import { render, screen } from '@testing-library/react';

import type { TestDto } from '../../model/types';
import { TestCard } from './TestCard';

const testDto: TestDto = {
  id: 1,
  teacherId: 2,
  subject: 'Математика',
  title: 'Контрольная по алгебре',
  description: 'Уравнения и неравенства',
  timeLimit: 600,
  questions: [
    {
      id: 1,
      testId: 1,
      text: 'Вопрос',
      options: ['a', 'b'],
      correctOptionIndex: 0,
    },
  ],
};

describe('TestCard', () => {
  it('показывает заголовок, предмет и описание', () => {
    render(<TestCard test={testDto} />);

    expect(screen.getByText('Контрольная по алгебре')).toBeInTheDocument();
    expect(screen.getByText('Математика')).toBeInTheDocument();
    expect(screen.getByText('Уравнения и неравенства')).toBeInTheDocument();
  });

  it('форматирует длительность и количество вопросов', () => {
    render(<TestCard test={testDto} />);

    expect(screen.getByText('10 мин')).toBeInTheDocument();
    expect(screen.getByText('1 вопрос')).toBeInTheDocument();
  });

  it('рендерит переданные actions', () => {
    render(
      <TestCard
        test={testDto}
        actions={<button type="button">Начать</button>}
      />,
    );
    expect(screen.getByRole('button', { name: 'Начать' })).toBeInTheDocument();
  });

  it('показывает заглушку без вопросов', () => {
    render(<TestCard test={{ ...testDto, questions: [] }} />);
    expect(screen.getByText('Вопросы не добавлены')).toBeInTheDocument();
  });
});