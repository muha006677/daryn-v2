// ҰБТға дайындық тест - Adaptive Exam System Types

export type UNTSubject = 
  | 'reading_literacy'
  | 'logical_math'
  | 'kz_history'
  | 'mathematics'
  | 'physics'

export type QuestionType = 'single' | 'multiple'

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export interface ReadingPassage {
  id: string
  title: string
  content: string
  source?: string
}

export interface UNTQuestion {
  id: string
  subject: UNTSubject
  type: QuestionType
  difficulty: DifficultyLevel
  prompt: string
  options: string[]  // 5 for single (A-E), 8 for multiple (A-H)
  correctAnswers: number[]
  explanation: string
  topic: string
  isLogicalTrap?: boolean
  passageId?: string  // For reading questions
}

export interface SubjectConfig {
  subject: UNTSubject
  name: string
  singleChoiceCount: number
  multipleChoiceCount: number
  singleChoicePoints: number
  multipleChoicePoints: number
  totalPoints: number
}

export const UNT_SUBJECTS: SubjectConfig[] = [
  {
    subject: 'reading_literacy',
    name: 'Оқу сауаттылығы',
    singleChoiceCount: 10,
    multipleChoiceCount: 0,
    singleChoicePoints: 10,
    multipleChoicePoints: 0,
    totalPoints: 10,
  },
  {
    subject: 'logical_math',
    name: 'Математикалық сауаттылық',
    singleChoiceCount: 10,
    multipleChoiceCount: 0,
    singleChoicePoints: 10,
    multipleChoicePoints: 0,
    totalPoints: 10,
  },
  {
    subject: 'kz_history',
    name: 'Қазақстан тарихы',
    singleChoiceCount: 20,
    multipleChoiceCount: 0,
    singleChoicePoints: 20,
    multipleChoicePoints: 0,
    totalPoints: 20,
  },
  {
    subject: 'mathematics',
    name: 'Математика',
    singleChoiceCount: 30,
    multipleChoiceCount: 10,
    singleChoicePoints: 30,
    multipleChoicePoints: 20,
    totalPoints: 50,
  },
  {
    subject: 'physics',
    name: 'Физика',
    singleChoiceCount: 30,
    multipleChoiceCount: 10,
    singleChoicePoints: 30,
    multipleChoicePoints: 20,
    totalPoints: 50,
  },
]

export const UNT_TOTAL_POINTS = 140
export const UNT_TOTAL_TIME_SECONDS = 240 * 60  // 4 hours in seconds
export const UNT_TOTAL_QUESTIONS = 120

export interface AnswerRecord {
  questionId: string
  subject: UNTSubject
  type: QuestionType
  difficulty: DifficultyLevel
  selectedAnswers: number[]
  correctAnswers: number[]
  isCorrect: boolean
  points: number
  maxPoints: number
  timeSpent: number
  questionIndex: number
  timestamp: number
}

export interface PerformanceState {
  totalAnswered: number
  correctCount: number
  currentStreak: number
  maxStreak: number
  wrongStreak: number
  totalTimeSpent: number
  currentDifficulty: DifficultyLevel
  subjectAccuracy: Record<UNTSubject, { correct: number; total: number }>
  recentAnswers: AnswerRecord[]  // Last 10 answers for adaptive logic
  timePressureAccuracy: number   // Accuracy when time < 25% remaining
  normalAccuracy: number         // Accuracy when time >= 25% remaining
}

export interface SubjectResult {
  subject: UNTSubject
  name: string
  totalQuestions: number
  correctAnswers: number
  singleChoiceScore: number
  multipleChoiceScore: number
  totalScore: number
  maxScore: number
  accuracy: number
  avgTimePerQuestion: number
  avgDifficulty: number
  difficultyProgression: number[]
}

export interface TimeManagementAnalysis {
  totalAllocated: number
  totalUsed: number
  pace: 'rushed' | 'optimal' | 'slow'
  paceRatio: number
  expectedPacePerQuestion: number
  actualPacePerQuestion: number
  timeDistribution: {
    subject: UNTSubject
    name: string
    timeSpent: number
    questionCount: number
    avgTime: number
  }[]
}

export interface StressResponseAnalysis {
  normalAccuracy: number
  pressureAccuracy: number
  accuracyDrop: number
  stressResistance: 'high' | 'moderate' | 'low'
  performanceUnderPressure: number  // 0-100 score
}

export interface CognitiveProfile {
  logicalStrength: number          // Based on logical_math performance
  analyticalEndurance: number      // Based on performance in later questions
  multiStepReasoning: number       // Based on multiple choice accuracy
  patternRecognition: number       // Based on reading comprehension
  problemSolving: number           // Based on math + physics
  overallCognitiveScore: number
}

export interface MultipleChoicePrecision {
  totalAttempted: number
  fullyCorrect: number
  partiallyCorrect: number
  completelyWrong: number
  precisionRate: number
  commonMistakePattern: string
}

export interface DiagnosticReport {
  totalScore: number
  maxScore: number
  percentage: number
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F'
  subjectResults: SubjectResult[]
  strongestSubject: SubjectResult
  weakestSubject: SubjectResult
  timeManagement: TimeManagementAnalysis
  stressResponse: StressResponseAnalysis
  cognitiveProfile: CognitiveProfile
  multipleChoicePrecision: MultipleChoicePrecision
  adaptiveDifficultyProgression: number[]
  recommendations: string[]
  completedAt: string
  totalTimeUsed: number
  wasAutoSubmitted: boolean
}

export interface AdaptiveState {
  currentDifficulty: DifficultyLevel
  questionsAnswered: number
  recentAccuracy: number
  avgResponseTime: number
  expectedTimePerQuestion: number
  streakType: 'correct' | 'wrong' | 'none'
  streakCount: number
  shouldIntroduceTrap: boolean
  timePressure: boolean
  difficultyHistory: DifficultyLevel[]
}

export interface ExamState {
  phase: 'intro' | 'exam' | 'results'
  questions: UNTQuestion[]
  passages: ReadingPassage[]
  currentIndex: number
  answers: AnswerRecord[]
  performanceState: PerformanceState
  adaptiveState: AdaptiveState
  globalTimeRemaining: number
  examStartTime: number
  questionStartTime: number
  isComplete: boolean
  wasAutoSubmitted: boolean
}
