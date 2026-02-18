// Classroom Games - Types for Elementary School Games

export type DifficultyLevel = 'easy' | 'medium' | 'hard'
export type SkillBadge = 'high' | 'good' | 'practice'

export interface GameQuestion {
  id: string
  prompt: string
  options?: string[]
  correctAnswer: string | number
  difficulty: DifficultyLevel
  isChallenge?: boolean
  hiddenLogic?: string
  timeLimit: number  // seconds
}

export interface GameAnswer {
  questionId: string
  selectedAnswer: string | number
  isCorrect: boolean
  timeSpent: number
  difficulty: DifficultyLevel
}

export interface GameConfig {
  id: string
  name: string
  icon: string
  color: string
  gradientFrom: string
  gradientTo: string
  description: string
  questionsPerRound: number
  challengeAtEnd: boolean
}

export interface GameResult {
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  totalTime: number
  avgTimePerQuestion: number
  speedLevel: 'fast' | 'normal' | 'slow'
  skillBadge: SkillBadge
  badgeEmoji: string
  badgeLabel: string
  challengeCompleted: boolean
  challengeCorrect: boolean
  difficultyBreakdown: {
    easy: { correct: number; total: number }
    medium: { correct: number; total: number }
    hard: { correct: number; total: number }
  }
}

export interface ClassroomState {
  isClassroomMode: boolean
  students: StudentScore[]
  currentRound: number
}

export interface StudentScore {
  id: string
  name: string
  score: number
  badges: SkillBadge[]
}

export const DIFFICULTY_CONFIG = {
  easy: {
    label: 'Оңай',
    color: 'bg-green-500',
    emoji: '🌟',
    timeMultiplier: 1.5,
  },
  medium: {
    label: 'Орташа',
    color: 'bg-yellow-500',
    emoji: '⭐',
    timeMultiplier: 1.0,
  },
  hard: {
    label: 'Қиын',
    color: 'bg-red-500',
    emoji: '🔥',
    timeMultiplier: 0.7,
  },
}

export const SKILL_BADGES = {
  high: {
    emoji: '⭐',
    label: 'Жоғары',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
    minAccuracy: 80,
  },
  good: {
    emoji: '👍',
    label: 'Жақсы',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    minAccuracy: 60,
  },
  practice: {
    emoji: '🔄',
    label: 'Жаттығу керек',
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
    minAccuracy: 0,
  },
}

export function getSkillBadge(accuracy: number): SkillBadge {
  if (accuracy >= 80) return 'high'
  if (accuracy >= 60) return 'good'
  return 'practice'
}

export function getSpeedLevel(avgTime: number, expectedTime: number): 'fast' | 'normal' | 'slow' {
  const ratio = avgTime / expectedTime
  if (ratio < 0.7) return 'fast'
  if (ratio > 1.3) return 'slow'
  return 'normal'
}

export function calculateGameResult(
  answers: GameAnswer[],
  expectedTimePerQuestion: number,
  challengeAnswer?: GameAnswer
): GameResult {
  const regularAnswers = answers.filter(a => !a.questionId.includes('challenge'))
  const totalQuestions = regularAnswers.length
  const correctAnswers = regularAnswers.filter(a => a.isCorrect).length
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0
  
  const totalTime = answers.reduce((acc, a) => acc + a.timeSpent, 0)
  const avgTimePerQuestion = totalQuestions > 0 ? totalTime / totalQuestions : 0
  
  const speedLevel = getSpeedLevel(avgTimePerQuestion, expectedTimePerQuestion)
  const skillBadge = getSkillBadge(accuracy)
  const badgeInfo = SKILL_BADGES[skillBadge]
  
  const difficultyBreakdown = {
    easy: {
      correct: regularAnswers.filter(a => a.difficulty === 'easy' && a.isCorrect).length,
      total: regularAnswers.filter(a => a.difficulty === 'easy').length,
    },
    medium: {
      correct: regularAnswers.filter(a => a.difficulty === 'medium' && a.isCorrect).length,
      total: regularAnswers.filter(a => a.difficulty === 'medium').length,
    },
    hard: {
      correct: regularAnswers.filter(a => a.difficulty === 'hard' && a.isCorrect).length,
      total: regularAnswers.filter(a => a.difficulty === 'hard').length,
    },
  }
  
  return {
    totalQuestions,
    correctAnswers,
    accuracy: Math.round(accuracy),
    totalTime: Math.round(totalTime),
    avgTimePerQuestion: Math.round(avgTimePerQuestion * 10) / 10,
    speedLevel,
    skillBadge,
    badgeEmoji: badgeInfo.emoji,
    badgeLabel: badgeInfo.label,
    challengeCompleted: !!challengeAnswer,
    challengeCorrect: challengeAnswer?.isCorrect ?? false,
    difficultyBreakdown,
  }
}
