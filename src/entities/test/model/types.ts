import type { QuestionDto, SafeQuestionDto } from '@/entities/question/model/types';

/** Тест в полном виде (для учителя/админа): вопросы с правильными ответами. */
export interface TestDto {
  id: number;
  teacherId: number;
  subject: string;
  title: string;
  description: string | null;
  timeLimit: number;
  questions?: QuestionDto[];
  createdAt?: string;
  updatedAt?: string;
}

/** Безопасный тест для ученика: вопросы без правильных ответов. */
export interface SafeTestDto {
  id: number;
  teacherId: number;
  subject: string;
  title: string;
  description: string | null;
  timeLimit: number;
  questions: SafeQuestionDto[];
}

export interface CreateTestPayload {
  subject: string;
  title: string;
  description?: string | null;
  timeLimit: number;
  teacherId?: number;
}

export interface UpdateTestPayload {
  subject?: string;
  title?: string;
  description?: string | null;
  timeLimit?: number;
}
