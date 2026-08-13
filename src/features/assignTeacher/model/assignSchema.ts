import { z } from 'zod';

/** Значение для назначения класса/предмета учителю. */
export const assignItemSchema = z.object({
  value: z.string().min(1, 'Поле не может быть пустым'),
});

export type AssignItemFormValues = z.infer<typeof assignItemSchema>;
