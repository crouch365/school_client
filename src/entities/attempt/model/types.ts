export const ATTEMPT_STATUSES = ['IN_PROGRESS', 'COMPLETED', 'EXPIRED'] as const;

export type AttemptStatus = (typeof ATTEMPT_STATUSES)[number];

export interface AnswerInput {
  questionId: number;
  optionIndex: number;
}

export interface SubmitAttemptPayload {
  testId: number;
  answers: AnswerInput[];
}

export interface SubmitAttemptResult {
  id: number;
  score: number;
  totalQuestions: number;
  message: string;
}

/** Попытка прохождения теста (testAttempt). */
export interface TestAttemptDto {
  id: number;
  studentId: number;
  testId: number;
  startedAt: string;
  finishedAt: string | null;
  status: AttemptStatus;
  score: number | null;
  totalQuestions: number | null;
  answers: number[] | null;
  test?: {
    id: number;
    title: string;
    subject: string;
  };
}
