/** Вопрос с правильным ответом (виден учителю/админу). */
export interface QuestionDto {
  id: number;
  testId: number;
  text: string;
  options: string[];
  correctOptionIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Безопасный вопрос для ученика — без correctOptionIndex. */
export interface SafeQuestionDto {
  id: number;
  text: string;
  options: string[];
}

export interface CreateQuestionPayload {
  text: string;
  options: string[];
  correctOptionIndex: number;
}
