import { z } from 'zod';

import { USER_ROLES } from '@/entities/user';

/** Зеркало createUserSchema с бэкенда + refinement: ученику нужен класс. */
export const createUserSchema = z
  .object({
    name: z.string().min(1, 'Имя не может быть пустым'),
    lastName: z.string().min(1, 'Фамилия не может быть пустой'),
    role: z.enum(USER_ROLES),
    className: z.string().optional().nullable(),
  })
  .refine((data) => data.role !== 'STUDENT' || Boolean(data.className?.trim()), {
    message: 'Для ученика необходимо указать класс',
    path: ['className'],
  });

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
