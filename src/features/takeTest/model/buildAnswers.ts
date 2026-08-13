import type { AnswerInput } from '@/entities/attempt';
import type { SafeQuestionDto } from '@/entities/question';

/**
 * Строит payload для POST /results.
 * Сервер требует answers.length === questions.length,
 * поэтому пропущенные ответы заполняются 0 (считаются неверными).
 */
export const buildAnswersPayload = (
  questions: SafeQuestionDto[],
  answers: Record<number, number>,
): AnswerInput[] =>
  questions.map((question) => ({
    questionId: question.id,
    optionIndex: answers[question.id] ?? 0,
  }));
