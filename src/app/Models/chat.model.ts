export interface ChatMessage {
  question: string;
  answer: string;
  timestamp: string;
}

export interface ChatResponse {
  user_id: string;
  question: string;
  question_index: number;
  total_questions: number;
  progress?: number;
}

export interface RecommendationResponse {
  status: string;
  recommendations: any[];
  user_profile: string;
  total_coaches_recommended: number;
}