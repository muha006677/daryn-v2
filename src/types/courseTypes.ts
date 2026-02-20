export interface AdaptiveQuestion {
  id: number
  type: "single" | "multiple" | "input"
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation?: string
}

export interface WrongAnswerRecord {
  question: AdaptiveQuestion
  selectedAnswer: string | string[]
  timestamp: number
  attempts: number
}
