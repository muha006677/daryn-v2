// Elite Cognitive Modeling - Advanced Adaptive Engine

import type {
  AdaptiveEliteState,
  EliteAnswer,
  ComplexityTier,
  ProblemDomain,
} from './types'

const OVERLOAD_THRESHOLD = 3  // Consecutive wrong at tier 4+
const STABILITY_DECAY = 5
const STABILITY_RECOVERY = 8

export function createInitialEliteState(): AdaptiveEliteState {
  const performanceByDomain: Record<ProblemDomain, { correct: number; total: number }> = {
    structural_logic: { correct: 0, total: 0 },
    parametric_analysis: { correct: 0, total: 0 },
    model_construction: { correct: 0, total: 0 },
    ambiguity_resolution: { correct: 0, total: 0 },
    meta_reasoning: { correct: 0, total: 0 },
  }

  return {
    currentTier: 2,  // Start at tier 2 (high baseline)
    problemsSolved: 0,
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    avgTimeRatio: 1.0,
    structuralStability: 80,
    inOverloadPhase: false,
    breakdownDetected: false,
    tierHistory: [2],
    performanceByDomain,
  }
}

function clampTier(tier: number): ComplexityTier {
  return Math.max(1, Math.min(5, Math.round(tier))) as ComplexityTier
}

export function updateEliteState(
  state: AdaptiveEliteState,
  answer: EliteAnswer
): AdaptiveEliteState {
  const timeRatio = answer.timeSpent / answer.expectedTime
  const newAvgTimeRatio = (state.avgTimeRatio * state.problemsSolved + timeRatio) / (state.problemsSolved + 1)
  
  // Update domain performance
  const newPerformanceByDomain = { ...state.performanceByDomain }
  newPerformanceByDomain[answer.domain] = {
    correct: newPerformanceByDomain[answer.domain].correct + (answer.isCorrect ? 1 : 0),
    total: newPerformanceByDomain[answer.domain].total + 1,
  }
  
  // Update streaks
  let consecutiveCorrect = answer.isCorrect ? state.consecutiveCorrect + 1 : 0
  let consecutiveWrong = answer.isCorrect ? 0 : state.consecutiveWrong + 1
  
  // Update structural stability
  let structuralStability = state.structuralStability
  if (answer.isCorrect) {
    structuralStability = Math.min(100, structuralStability + STABILITY_RECOVERY)
  } else {
    structuralStability = Math.max(0, structuralStability - STABILITY_DECAY * answer.tier)
  }
  
  // Check for cognitive overload phase
  let inOverloadPhase = state.inOverloadPhase
  let breakdownDetected = state.breakdownDetected
  
  if (state.currentTier >= 4 && consecutiveWrong >= OVERLOAD_THRESHOLD) {
    inOverloadPhase = true
    if (structuralStability < 30) {
      breakdownDetected = true
    }
  }
  
  // Calculate new tier
  let newTier = state.currentTier
  
  // Escalation rules
  if (answer.isCorrect && timeRatio < 0.8 && consecutiveCorrect >= 2) {
    // Fast and accurate - increase tier
    newTier = clampTier(state.currentTier + 1)
  } else if (answer.isCorrect && timeRatio < 1.2 && consecutiveCorrect >= 3) {
    // Consistent accuracy - increase tier
    newTier = clampTier(state.currentTier + 1)
  }
  
  // De-escalation rules
  if (consecutiveWrong >= 2 && !inOverloadPhase) {
    newTier = clampTier(state.currentTier - 1)
  } else if (timeRatio > 2.0 && !answer.isCorrect) {
    // Slow and wrong - decrease tier
    newTier = clampTier(state.currentTier - 1)
  }
  
  // In overload phase, maintain high tier to test limits
  if (inOverloadPhase && !breakdownDetected) {
    newTier = Math.max(newTier, 4) as ComplexityTier
  }
  
  return {
    currentTier: newTier,
    problemsSolved: state.problemsSolved + 1,
    consecutiveCorrect,
    consecutiveWrong,
    avgTimeRatio: newAvgTimeRatio,
    structuralStability,
    inOverloadPhase,
    breakdownDetected,
    tierHistory: [...state.tierHistory, newTier],
    performanceByDomain: newPerformanceByDomain,
  }
}

export function shouldEnterOverloadPhase(state: AdaptiveEliteState): boolean {
  // Enter overload phase after consistent high performance
  const totalCorrect = Object.values(state.performanceByDomain)
    .reduce((acc, d) => acc + d.correct, 0)
  const totalAnswered = Object.values(state.performanceByDomain)
    .reduce((acc, d) => acc + d.total, 0)
  
  if (totalAnswered < 5) return false
  
  const accuracy = totalCorrect / totalAnswered
  return accuracy > 0.85 && state.currentTier >= 3 && !state.inOverloadPhase
}

export function getNextProblemDomain(state: AdaptiveEliteState): ProblemDomain {
  const domains: ProblemDomain[] = [
    'structural_logic',
    'parametric_analysis',
    'model_construction',
    'ambiguity_resolution',
    'meta_reasoning',
  ]
  
  // Find least-tested domain
  const leastTested = domains.reduce((min, domain) => {
    const current = state.performanceByDomain[domain].total
    const minTotal = state.performanceByDomain[min].total
    return current < minTotal ? domain : min
  })
  
  // 70% chance to pick least tested, 30% random
  if (Math.random() < 0.7) {
    return leastTested
  }
  
  return domains[Math.floor(Math.random() * domains.length)]
}

export function calculateStructuralStabilityScore(state: AdaptiveEliteState): number {
  return state.structuralStability
}

export function getTierLabel(tier: ComplexityTier): string {
  const labels: Record<ComplexityTier, string> = {
    1: 'Жоғары',
    2: 'Күрделі', 
    3: 'Өте күрделі',
    4: 'Элиталық',
    5: 'Ультра-элиталық',
  }
  return labels[tier]
}
