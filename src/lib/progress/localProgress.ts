import { AdaptiveQuestion } from '../courses/generators/grade1Lesson1'

export interface WrongAnswerRecord {
  question: AdaptiveQuestion
  selectedAnswer: string
  timestamp: number
  attempts: number
}

const STORAGE_KEY_PREFIX = 'mathforce_wrong_answers_'

function getStorageKey(lessonId: string): string {
  return `${STORAGE_KEY_PREFIX}${lessonId}`
}

export function saveWrongAnswer(
  lessonId: string,
  question: AdaptiveQuestion,
  selectedAnswer: string
): void {
  if (typeof window === 'undefined') return

  try {
    const existing = getWrongAnswers(lessonId)
    const existingIndex = existing.findIndex((r) => r.question.id === question.id)

    if (existingIndex >= 0) {
      existing[existingIndex].attempts += 1
      existing[existingIndex].selectedAnswer = selectedAnswer
      existing[existingIndex].timestamp = Date.now()
    } else {
      existing.push({
        question,
        selectedAnswer,
        timestamp: Date.now(),
        attempts: 1,
      })
    }

    localStorage.setItem(getStorageKey(lessonId), JSON.stringify(existing))
  } catch (error) {
    console.error('Error saving wrong answer:', error)
  }
}

export function getWrongAnswers(lessonId: string): WrongAnswerRecord[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(getStorageKey(lessonId))
    if (!stored) return []
    return JSON.parse(stored) as WrongAnswerRecord[]
  } catch (error) {
    console.error('Error getting wrong answers:', error)
    return []
  }
}

export function removeWrongAnswer(lessonId: string, questionId: string): void {
  if (typeof window === 'undefined') return

  try {
    const existing = getWrongAnswers(lessonId)
    const filtered = existing.filter((r) => r.question.id !== questionId)
    localStorage.setItem(getStorageKey(lessonId), JSON.stringify(filtered))
  } catch (error) {
    console.error('Error removing wrong answer:', error)
  }
}

export function clearWrongAnswers(lessonId: string): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(getStorageKey(lessonId))
  } catch (error) {
    console.error('Error clearing wrong answers:', error)
  }
}

export function getWrongAnswerCount(lessonId: string): number {
  return getWrongAnswers(lessonId).length
}

export interface ProgressStats {
  totalAnswered: number
  correctAnswers: number
  wrongAnswers: number
  currentLevel: number
  highestLevel: number
  streak: number
}

const STATS_KEY_PREFIX = 'mathforce_progress_stats_'

export function saveProgressStats(lessonId: string, stats: ProgressStats): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(`${STATS_KEY_PREFIX}${lessonId}`, JSON.stringify(stats))
  } catch (error) {
    console.error('Error saving progress stats:', error)
  }
}

export function getProgressStats(lessonId: string): ProgressStats | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(`${STATS_KEY_PREFIX}${lessonId}`)
    if (!stored) return null
    return JSON.parse(stored) as ProgressStats
  } catch (error) {
    console.error('Error getting progress stats:', error)
    return null
  }
}

export function clearProgressStats(lessonId: string): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(`${STATS_KEY_PREFIX}${lessonId}`)
  } catch (error) {
    console.error('Error clearing progress stats:', error)
  }
}
