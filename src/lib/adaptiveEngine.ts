/**
 * Adaptive Difficulty Engine
 * State-based difficulty management with clear adjustment rules
 */

export type Difficulty = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export interface PerformanceState {
  totalAnswered: number
  correctCount: number
  streak: number
  wrongStreak: number
  maxStreak: number
  totalTimeSpent: number
  avgTime: number
  currentDifficulty: Difficulty
  history: AnswerRecord[]
}

export interface AnswerRecord {
  timestamp: number
  difficulty: Difficulty
  isCorrect: boolean
  timeSpent: number
  expectedTime: number
}

const ACCURACY_THRESHOLD_UP = 0.85
const ACCURACY_THRESHOLD_DOWN = 0.60
const MIN_ANSWERS_FOR_ADJUSTMENT = 3
const HISTORY_WINDOW = 10

export function createInitialState(startDifficulty: Difficulty = 5): PerformanceState {
  return {
    totalAnswered: 0,
    correctCount: 0,
    streak: 0,
    wrongStreak: 0,
    maxStreak: 0,
    totalTimeSpent: 0,
    avgTime: 0,
    currentDifficulty: startDifficulty,
    history: [],
  }
}

export function updatePerformance(
  state: PerformanceState,
  isCorrect: boolean,
  timeSpent: number,
  expectedTime: number
): PerformanceState {
  const newTotal = state.totalAnswered + 1
  const newCorrect = state.correctCount + (isCorrect ? 1 : 0)
  const newStreak = isCorrect ? state.streak + 1 : 0
  const newWrongStreak = isCorrect ? 0 : state.wrongStreak + 1
  const newTotalTime = state.totalTimeSpent + timeSpent
  const newAvgTime = newTotalTime / newTotal

  const record: AnswerRecord = {
    timestamp: Date.now(),
    difficulty: state.currentDifficulty,
    isCorrect,
    timeSpent,
    expectedTime,
  }

  const newHistory = [...state.history, record].slice(-HISTORY_WINDOW * 2)

  return {
    totalAnswered: newTotal,
    correctCount: newCorrect,
    streak: newStreak,
    wrongStreak: newWrongStreak,
    maxStreak: Math.max(state.maxStreak, newStreak),
    totalTimeSpent: newTotalTime,
    avgTime: newAvgTime,
    currentDifficulty: state.currentDifficulty,
    history: newHistory,
  }
}

function getRecentStats(state: PerformanceState): {
  recentAccuracy: number
  recentAvgTimeRatio: number
  sampleSize: number
} {
  const recent = state.history.slice(-HISTORY_WINDOW)
  if (recent.length === 0) {
    return { recentAccuracy: 0.5, recentAvgTimeRatio: 1, sampleSize: 0 }
  }

  const correctCount = recent.filter(r => r.isCorrect).length
  const recentAccuracy = correctCount / recent.length

  const timeRatios = recent.map(r => r.timeSpent / r.expectedTime)
  const recentAvgTimeRatio = timeRatios.reduce((a, b) => a + b, 0) / timeRatios.length

  return {
    recentAccuracy,
    recentAvgTimeRatio,
    sampleSize: recent.length,
  }
}

export function getNextDifficulty(state: PerformanceState): Difficulty {
  const { recentAccuracy, recentAvgTimeRatio, sampleSize } = getRecentStats(state)

  if (sampleSize < MIN_ANSWERS_FOR_ADJUSTMENT) {
    return state.currentDifficulty
  }

  let newDifficulty = state.currentDifficulty

  // Increase difficulty: accuracy > 85% AND answering faster than expected
  if (recentAccuracy > ACCURACY_THRESHOLD_UP && recentAvgTimeRatio < 1.0) {
    if (state.streak >= 3 && recentAvgTimeRatio < 0.5) {
      // Fast and accurate with streak: increase by 2
      newDifficulty = Math.min(10, state.currentDifficulty + 2) as Difficulty
    } else {
      // Good performance: increase by 1
      newDifficulty = Math.min(10, state.currentDifficulty + 1) as Difficulty
    }
  }
  // Decrease difficulty: accuracy < 60%
  else if (recentAccuracy < ACCURACY_THRESHOLD_DOWN) {
    if (state.wrongStreak >= 3) {
      // Struggling badly: decrease by 2
      newDifficulty = Math.max(1, state.currentDifficulty - 2) as Difficulty
    } else {
      // Struggling: decrease by 1
      newDifficulty = Math.max(1, state.currentDifficulty - 1) as Difficulty
    }
  }

  return newDifficulty
}

export function applyDifficultyChange(
  state: PerformanceState,
  newDifficulty: Difficulty
): PerformanceState {
  return {
    ...state,
    currentDifficulty: newDifficulty,
  }
}

export function getAccuracy(state: PerformanceState): number {
  if (state.totalAnswered === 0) return 0
  return state.correctCount / state.totalAnswered
}

export function getRecentAccuracy(state: PerformanceState): number {
  const { recentAccuracy } = getRecentStats(state)
  return recentAccuracy
}

export function getSessionSummary(state: PerformanceState): {
  totalAnswered: number
  correctCount: number
  accuracy: number
  avgTime: number
  maxStreak: number
  finalDifficulty: Difficulty
} {
  return {
    totalAnswered: state.totalAnswered,
    correctCount: state.correctCount,
    accuracy: getAccuracy(state),
    avgTime: state.avgTime,
    maxStreak: state.maxStreak,
    finalDifficulty: state.currentDifficulty,
  }
}
