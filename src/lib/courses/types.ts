export type QuestionType = 'single' | 'multiple' | 'input'

export interface Question {
  id: string
  type: QuestionType
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation?: string
  points: number
}

export interface Topic {
  id: string
  title: string
  description: string
  questions: Question[]
  generator?: string
}

export interface Grade {
  id: number
  label: string
  topics: Topic[]
}

export interface CourseData {
  [gradeId: number]: Grade
}

export type CategoryKey = 'primary' | 'middle' | 'high'

export interface Category {
  id: CategoryKey
  label: string
  labelKz: string
  color: string
  bgColor: string
  grades: number[]
}

export interface Curriculum {
  primary: { [gradeId: number]: Grade }
  middle: { [gradeId: number]: Grade }
  high: { [gradeId: number]: Grade }
}

export interface AnswerState {
  [questionId: string]: string | string[]
}

export interface QuestionResult {
  questionId: string
  isCorrect: boolean
  userAnswer: string | string[]
  correctAnswer: string | string[]
  points: number
  earnedPoints: number
}

export interface PracticeResult {
  totalQuestions: number
  correctAnswers: number
  totalPoints: number
  earnedPoints: number
  percentage: number
  results: QuestionResult[]
}
