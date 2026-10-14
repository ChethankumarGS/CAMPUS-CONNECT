export interface AiSource {
  ref: number;
  materialId: string;
  title: string;
  snippet: string;
  score: number;
}

export interface AiAnswer {
  answer: string;
  sources: AiSource[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface StudyKit {
  summary: string;
  quiz: QuizQuestion[];
  generatedAt: string;
}
