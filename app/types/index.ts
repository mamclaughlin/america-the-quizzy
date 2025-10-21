// Configuration
export interface QuizConfig {
  number_of_questions: number;
  category: string;
  subcategory: string;
}

// Questions
export interface Question {
  category: string;
  subcategory: string;
  question: string;
  answers: string[];
  id?: string; // Optional ID for tracking asked questions
}

export interface QuestionWithUserAnswer extends Question {
  user_answer: string;
}

export interface GradedQuestion extends QuestionWithUserAnswer {
  result: 'correct' | 'incorrect';
  matched_answer: string;
}

// Results
export interface GradingResult {
  questions: GradedQuestion[];
}

// API Responses
export interface QuestionGenerationResponse {
  category: string;
  subcategory: string;
  number_of_questions: number;
  questions: Question[];
}

export interface ApiError {
  error: string;
}

// Application State
export type View = 'configuration' | 'quiz' | 'results';

export interface AppState {
  view: View;
  config: QuizConfig | null;
  questions: Question[] | null;
  answers: string[];
  currentQuestionIndex: number;
  results: GradingResult | null;
  loading: boolean;
  error: string | null;
}

// Helper type guards
export function isApiError(response: unknown): response is ApiError {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    typeof (response as ApiError).error === 'string'
  );
}

export function isGradedQuestion(q: unknown): q is GradedQuestion {
  return (
    typeof q === 'object' &&
    q !== null &&
    'result' in q &&
    'matched_answer' in q
  );
}

// Derived state helpers
export function calculateScore(results: GradingResult): {
  total: number;
  correct: number;
  incorrect: number;
  percentage: number;
} {
  const total = results.questions.length;
  const correct = results.questions.filter(q => q.result === 'correct').length;
  const incorrect = total - correct;
  const percentage = Math.round((correct / total) * 100);
  
  return { total, correct, incorrect, percentage };
}
