// Adaptive AI Engine for UNT Exam

import type {
  AdaptiveState,
  AnswerRecord,
  DifficultyLevel,
  UNTQuestion,
  UNTSubject,
  PerformanceState,
} from './types'
import { UNT_TOTAL_TIME_SECONDS, UNT_TOTAL_QUESTIONS } from './types'

const EXPECTED_TIME_PER_QUESTION = UNT_TOTAL_TIME_SECONDS / UNT_TOTAL_QUESTIONS  // ~120 seconds

export function createInitialAdaptiveState(): AdaptiveState {
  return {
    currentDifficulty: 5,
    questionsAnswered: 0,
    recentAccuracy: 0,
    avgResponseTime: 0,
    expectedTimePerQuestion: EXPECTED_TIME_PER_QUESTION,
    streakType: 'none',
    streakCount: 0,
    shouldIntroduceTrap: false,
    timePressure: false,
    difficultyHistory: [],
  }
}

export function createInitialPerformanceState(): PerformanceState {
  const subjectAccuracy: Record<UNTSubject, { correct: number; total: number }> = {
    reading_literacy: { correct: 0, total: 0 },
    logical_math: { correct: 0, total: 0 },
    kz_history: { correct: 0, total: 0 },
    mathematics: { correct: 0, total: 0 },
    physics: { correct: 0, total: 0 },
  }

  return {
    totalAnswered: 0,
    correctCount: 0,
    currentStreak: 0,
    maxStreak: 0,
    wrongStreak: 0,
    totalTimeSpent: 0,
    currentDifficulty: 5,
    subjectAccuracy,
    recentAnswers: [],
    timePressureAccuracy: 0,
    normalAccuracy: 0,
  }
}

function calculateRecentAccuracy(recentAnswers: AnswerRecord[]): number {
  if (recentAnswers.length === 0) return 0
  const correct = recentAnswers.filter(a => a.isCorrect).length
  return (correct / recentAnswers.length) * 100
}

function calculateAvgResponseTime(recentAnswers: AnswerRecord[]): number {
  if (recentAnswers.length === 0) return EXPECTED_TIME_PER_QUESTION
  const totalTime = recentAnswers.reduce((acc, a) => acc + a.timeSpent, 0)
  return totalTime / recentAnswers.length
}

function clampDifficulty(difficulty: number): DifficultyLevel {
  return Math.max(1, Math.min(10, Math.round(difficulty))) as DifficultyLevel
}

export function updateAdaptiveState(
  currentState: AdaptiveState,
  answer: AnswerRecord,
  allAnswers: AnswerRecord[],
  timeRemaining: number
): AdaptiveState {
  const recentAnswers = allAnswers.slice(-10)
  const recentAccuracy = calculateRecentAccuracy(recentAnswers)
  const avgResponseTime = calculateAvgResponseTime(recentAnswers)
  const timePressure = timeRemaining < UNT_TOTAL_TIME_SECONDS * 0.25
  
  let newStreak = currentState.streakCount
  let streakType = currentState.streakType
  
  if (answer.isCorrect) {
    if (streakType === 'correct') {
      newStreak++
    } else {
      streakType = 'correct'
      newStreak = 1
    }
  } else {
    if (streakType === 'wrong') {
      newStreak++
    } else {
      streakType = 'wrong'
      newStreak = 1
    }
  }
  
  let difficultyChange = 0
  
  // Rule 1: High accuracy + fast response = increase difficulty
  if (recentAccuracy > 85 && avgResponseTime < EXPECTED_TIME_PER_QUESTION * 0.7) {
    difficultyChange = 2
  } else if (recentAccuracy > 85 && avgResponseTime < EXPECTED_TIME_PER_QUESTION) {
    difficultyChange = 1
  }
  
  // Rule 2: Low accuracy = decrease difficulty
  if (recentAccuracy < 60) {
    difficultyChange = -1
  }
  if (recentAccuracy < 40) {
    difficultyChange = -2
  }
  
  // Rule 3: Long wrong streak = significant decrease
  if (streakType === 'wrong' && newStreak >= 3) {
    difficultyChange = Math.min(difficultyChange, -2)
  }
  
  // Rule 4: Long correct streak = introduce harder questions
  const shouldIntroduceTrap = streakType === 'correct' && newStreak >= 5
  if (shouldIntroduceTrap) {
    difficultyChange = Math.max(difficultyChange, 1)
  }
  
  const newDifficulty = clampDifficulty(currentState.currentDifficulty + difficultyChange)
  
  return {
    currentDifficulty: newDifficulty,
    questionsAnswered: currentState.questionsAnswered + 1,
    recentAccuracy,
    avgResponseTime,
    expectedTimePerQuestion: EXPECTED_TIME_PER_QUESTION,
    streakType,
    streakCount: newStreak,
    shouldIntroduceTrap,
    timePressure,
    difficultyHistory: [...currentState.difficultyHistory, newDifficulty],
  }
}

export function updatePerformanceState(
  currentState: PerformanceState,
  answer: AnswerRecord,
  isUnderTimePressure: boolean
): PerformanceState {
  const newRecentAnswers = [...currentState.recentAnswers, answer].slice(-10)
  
  const newStreak = answer.isCorrect ? currentState.currentStreak + 1 : 0
  const newWrongStreak = answer.isCorrect ? 0 : currentState.wrongStreak + 1
  
  const updatedSubjectAccuracy = { ...currentState.subjectAccuracy }
  updatedSubjectAccuracy[answer.subject] = {
    correct: updatedSubjectAccuracy[answer.subject].correct + (answer.isCorrect ? 1 : 0),
    total: updatedSubjectAccuracy[answer.subject].total + 1,
  }
  
  // Calculate pressure vs normal accuracy
  const pressureAnswers = newRecentAnswers.filter((_, idx) => {
    // Simplified: last 3 answers when under pressure
    return isUnderTimePressure
  })
  const normalAnswers = newRecentAnswers.filter((_, idx) => !isUnderTimePressure)
  
  const timePressureAccuracy = pressureAnswers.length > 0
    ? (pressureAnswers.filter(a => a.isCorrect).length / pressureAnswers.length) * 100
    : currentState.timePressureAccuracy
    
  const normalAccuracy = normalAnswers.length > 0
    ? (normalAnswers.filter(a => a.isCorrect).length / normalAnswers.length) * 100
    : currentState.normalAccuracy
  
  return {
    totalAnswered: currentState.totalAnswered + 1,
    correctCount: currentState.correctCount + (answer.isCorrect ? 1 : 0),
    currentStreak: newStreak,
    maxStreak: Math.max(currentState.maxStreak, newStreak),
    wrongStreak: newWrongStreak,
    totalTimeSpent: currentState.totalTimeSpent + answer.timeSpent,
    currentDifficulty: answer.difficulty,
    subjectAccuracy: updatedSubjectAccuracy,
    recentAnswers: newRecentAnswers,
    timePressureAccuracy,
    normalAccuracy,
  }
}

export function selectNextQuestion(
  availableQuestions: UNTQuestion[],
  answeredIds: Set<string>,
  adaptiveState: AdaptiveState,
  currentSubject: UNTSubject
): UNTQuestion | null {
  const unanswered = availableQuestions.filter(
    q => !answeredIds.has(q.id) && q.subject === currentSubject
  )
  
  if (unanswered.length === 0) return null
  
  const targetDifficulty = adaptiveState.currentDifficulty
  
  // Sort by closeness to target difficulty
  const sorted = [...unanswered].sort((a, b) => {
    const diffA = Math.abs(a.difficulty - targetDifficulty)
    const diffB = Math.abs(b.difficulty - targetDifficulty)
    
    // Prefer trap questions if needed
    if (adaptiveState.shouldIntroduceTrap) {
      if (a.isLogicalTrap && !b.isLogicalTrap) return -1
      if (!a.isLogicalTrap && b.isLogicalTrap) return 1
    }
    
    return diffA - diffB
  })
  
  // Add some randomness to avoid predictability
  const topCandidates = sorted.slice(0, Math.min(3, sorted.length))
  const randomIndex = Math.floor(Math.random() * topCandidates.length)
  
  return topCandidates[randomIndex]
}

export function getAdaptiveDifficultyLabel(difficulty: DifficultyLevel): string {
  if (difficulty <= 3) return 'Оңай'
  if (difficulty <= 5) return 'Орташа'
  if (difficulty <= 7) return 'Қиын'
  return 'Өте қиын'
}

export function calculateExpectedPace(
  questionsAnswered: number,
  timeElapsed: number
): { expected: number; actual: number; status: 'ahead' | 'on_track' | 'behind' } {
  const expectedQuestionsAtTime = (timeElapsed / UNT_TOTAL_TIME_SECONDS) * UNT_TOTAL_QUESTIONS
  const actual = questionsAnswered
  
  if (actual > expectedQuestionsAtTime * 1.1) {
    return { expected: expectedQuestionsAtTime, actual, status: 'ahead' }
  } else if (actual < expectedQuestionsAtTime * 0.9) {
    return { expected: expectedQuestionsAtTime, actual, status: 'behind' }
  }
  return { expected: expectedQuestionsAtTime, actual, status: 'on_track' }
}
