import { z } from 'zod';

/**
 * Схема создания/редактирования теста.
 * timeLimit — в МИНУТАХ в UI (в API уходят секунды).
 */
export const createTestSchema = z.object({
  subject: z.string().min(4, 'Предмет обязателен (минимум 4 символа)'),
  title: z.string().min(4, 'Название теста обязательно (минимум 4 символа)'),
  description: z.string().optional(),
  timeLimitMinutes: z.coerce.number().int('Целое число минут').min(1, 'Минимум 1 минута'),
});

export type CreateTestFormValues = z.infer<typeof createTestSchema>;

/** Схема вопроса: зеркало questionSchema с бэкенда.
 * options представлены объектами { value } — так RHF-fieldArray
 * корректно типизируется (массивы примитивов не поддерживаются типами). */
export const questionSchema = z
  .object({
    text: z.string().min(1, 'Введите текст вопроса'),
    options: z
      .array(z.object({ value: z.string().min(1, 'Вариант не может быть пустым') }))
      .min(2, 'Добавьте минимум 2 варианта ответа'),
    correctOptionIndex: z.number().int().min(0),
  })
  .refine((data) => data.correctOptionIndex < data.options.length, {
    message: 'Правильный ответ выходит за границы вариантов',
    path: ['correctOptionIndex'],
  });

export type QuestionFormValues = z.infer<typeof questionSchema>;

/** Конвертирует значения формы теста в payload API (секунды). */
export const toCreateTestPayload = (
  values: CreateTestFormValues,
): { subject: string; title: string; description: string | null; timeLimit: number } => ({
  subject: values.subject,
  title: values.title,
  description: values.description?.trim() ? values.description : null,
  timeLimit: values.timeLimitMinutes * 60,
});
