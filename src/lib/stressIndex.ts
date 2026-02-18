/**
 * Stress Index Calculator
 * Calculates meaningful stress level based on performance patterns
 */

import type { PerformanceState, AnswerRecord } from './adaptiveEngine'

export type StressGrade = 'A' | 'B' | 'C' | 'D' | 'E'

export interface StressResult {
  grade: StressGrade
  score: number // 0-100
  factors: {
    highDifficultyAccuracy: number
    timeVariance: number
    recoveryScore: number
  }
  message: string
}

export const STRESS_LABELS: Record<StressGrade, string> = {
  A: 'Керемет',
  B: 'Жақсы',
  C: 'Орташа',
  D: 'Қиын',
  E: 'Өте қиын',
}

export const STRESS_COLORS: Record<StressGrade, string> = {
  A: 'bg-green-500',
  B: 'bg-lime-500',
  C: 'bg-yellow-500',
  D: 'bg-orange-500',
  E: 'bg-red-500',
}

export const STRESS_TEXT_COLORS: Record<StressGrade, string> = {
  A: 'text-green-600',
  B: 'text-lime-600',
  C: 'text-yellow-600',
  D: 'text-orange-600',
  E: 'text-red-600',
}

/**
 * Calculate accuracy on high difficulty questions (7-10)
 */
function calculateHighDifficultyAccuracy(history: AnswerRecord[]): number {
  const highDiffQuestions = history.filter(r => r.difficulty >= 7)
  if (highDiffQuestions.length === 0) return 0.5 // neutral if no high diff questions
  
  const correct = highDiffQuestions.filter(r => r.isCorrect).length
  return correct / highDiffQuestions.length
}

/**
 * Calculate time variance (consistency in response time)
 * Lower variance = more consistent = less stress
 */
function calculateTimeVariance(history: AnswerRecord[]): number {
  if (history.length < 3) return 0.5 // neutral

  const timeRatios = history.map(r => r.timeSpent / r.expectedTime)
  const mean = timeRatios.reduce((a, b) => a + b, 0) / timeRatios.length
  const variance = timeRatios.reduce((sum, t) => sum + Math.pow(t - mean, 2), 0) / timeRatios.length
  const stdDev = Math.sqrt(variance)

  // Normalize: stdDev of 0 = perfect (1.0), stdDev > 0.5 = poor (0)
  return Math.max(0, 1 - stdDev * 2)
}

/**
 * Calculate recovery score after wrong streaks
 * How well does the user recover after making mistakes?
 */
function calculateRecoveryScore(history: AnswerRecord[]): number {
  if (history.length < 5) return 0.5 // neutral

  let wrongStreaks = 0
  let recoveries = 0

  for (let i = 1; i < history.length; i++) {
    // Found a wrong answer followed by correct
    if (!history[i - 1].isCorrect && history[i].isCorrect) {
      recoveries++
    }
    // Count wrong streak starts
    if (!history[i].isCorrect && (i === 0 || history[i - 1].isCorrect)) {
      wrongStreaks++
    }
  }

  if (wrongStreaks === 0) return 1.0 // Perfect - no mistakes
  return recoveries / wrongStreaks
}

/**
 * Convert score (0-100) to grade
 */
function scoreToGrade(score: number): StressGrade {
  if (score >= 85) return 'A'
  if (score >= 70) return 'B'
  if (score >= 55) return 'C'
  if (score >= 40) return 'D'
  return 'E'
}

/**
 * Get message based on grade and factors
 */
function getMessage(grade: StressGrade, factors: StressResult['factors']): string {
  switch (grade) {
    case 'A':
      return 'Тамаша нәтиже! Сіз тұрақты және жоғары деңгейде жұмыс істедіңіз.'
    case 'B':
      if (factors.highDifficultyAccuracy < 0.5) {
        return 'Жақсы! Қиын есептерге көбірек көңіл бөліңіз.'
      }
      return 'Жақсы нәтиже! Осылай жалғастырыңыз.'
    case 'C':
      if (factors.timeVariance < 0.5) {
        return 'Орташа. Уақытты бірқалыпты пайдалануға тырысыңыз.'
      }
      if (factors.recoveryScore < 0.5) {
        return 'Орташа. Қатеден кейін сабырлы болыңыз.'
      }
      return 'Орташа нәтиже. Жаттығуды жалғастырыңыз.'
    case 'D':
      return 'Қиындау болды. Демалып, қайта бастаңыз.'
    case 'E':
      return 'Өте қиын сессия. Демалыс алу ұсынылады.'
  }
}

/**
 * Main function: Calculate stress index from performance state
 */
export function calculateStressIndex(state: PerformanceState): StressResult {
  const { history, correctCount, totalAnswered } = state

  // If not enough data, return neutral
  if (totalAnswered < 5) {
    return {
      grade: 'C',
      score: 50,
      factors: {
        highDifficultyAccuracy: 0.5,
        timeVariance: 0.5,
        recoveryScore: 0.5,
      },
      message: 'Жеткілікті деректер жоқ. Жаттығуды жалғастырыңыз.',
    }
  }

  // Calculate factors
  const highDifficultyAccuracy = calculateHighDifficultyAccuracy(history)
  const timeVariance = calculateTimeVariance(history)
  const recoveryScore = calculateRecoveryScore(history)
  const overallAccuracy = correctCount / totalAnswered

  // Weighted score calculation
  // Overall accuracy: 40%
  // High difficulty accuracy: 25%
  // Time consistency: 20%
  // Recovery ability: 15%
  const score = Math.round(
    overallAccuracy * 40 +
    highDifficultyAccuracy * 25 +
    timeVariance * 20 +
    recoveryScore * 15
  )

  const normalizedScore = Math.max(0, Math.min(100, score))
  const grade = scoreToGrade(normalizedScore)
  const factors = { highDifficultyAccuracy, timeVariance, recoveryScore }

  return {
    grade,
    score: normalizedScore,
    factors,
    message: getMessage(grade, factors),
  }
}

/**
 * Quick stress check during session (lighter calculation)
 */
export function getQuickStressGrade(
  accuracy: number,
  streak: number,
  wrongStreak: number
): StressGrade {
  if (accuracy >= 0.85 && streak >= 3) return 'A'
  if (accuracy >= 0.70 && wrongStreak === 0) return 'B'
  if (accuracy >= 0.55) return 'C'
  if (accuracy >= 0.40 || wrongStreak <= 2) return 'D'
  return 'E'
}
