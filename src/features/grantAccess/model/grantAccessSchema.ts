import { z } from 'zod';

/** Класс для выдачи/отзыва доступа к тесту. */
export const grantAccessSchema = z.object({
  className: z.string().min(1, 'Укажите класс, например 9А'),
});

export type GrantAccessFormValues = z.infer<typeof grantAccessSchema>;
