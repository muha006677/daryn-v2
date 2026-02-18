// Elite Cognitive Modeling - Advanced Report Generator

import type {
  EliteAnswer,
  AdaptiveEliteState,
  EliteModelingReport,
  StrategicThinkingIndex,
  StructuralAdaptationLevel,
  AnalyticalEnduranceScore,
  CognitiveStabilityIndex,
  ElitePotentialIndex,
  ProblemDomain,
} from './types'
import { DOMAIN_NAMES } from './types'

function calculateStrategicThinking(
  answers: EliteAnswer[],
  state: AdaptiveEliteState
): StrategicThinkingIndex {
  const correctAnswers = answers.filter(a => a.isCorrect)
  const totalAnswers = answers.length
  
  if (totalAnswers === 0) {
    return {
      score: 0,
      level: 'Foundational',
      components: {
        patternRecognition: 0,
        structuralTransformation: 0,
        logicalChaining: 0,
        abstractReasoning: 0,
      },
    }
  }
  
  // Pattern recognition: structural_logic performance
  const structuralLogic = state.performanceByDomain.structural_logic
  const patternRecognition = structuralLogic.total > 0 
    ? (structuralLogic.correct / structuralLogic.total) * 100 
    : 0
  
  // Structural transformation: model_construction performance
  const modelConstruction = state.performanceByDomain.model_construction
  const structuralTransformation = modelConstruction.total > 0 
    ? (modelConstruction.correct / modelConstruction.total) * 100 
    : 0
  
  // Logical chaining: parametric_analysis performance
  const parametricAnalysis = state.performanceByDomain.parametric_analysis
  const logicalChaining = parametricAnalysis.total > 0 
    ? (parametricAnalysis.correct / parametricAnalysis.total) * 100 
    : 0
  
  // Abstract reasoning: meta_reasoning + ambiguity_resolution
  const metaReasoning = state.performanceByDomain.meta_reasoning
  const ambiguity = state.performanceByDomain.ambiguity_resolution
  const abstractTotal = metaReasoning.total + ambiguity.total
  const abstractCorrect = metaReasoning.correct + ambiguity.correct
  const abstractReasoning = abstractTotal > 0 
    ? (abstractCorrect / abstractTotal) * 100 
    : 0
  
  // Weight by tier achieved
  const tierBonus = (state.currentTier / 5) * 20
  
  const score = Math.min(100, (
    patternRecognition * 0.25 +
    structuralTransformation * 0.25 +
    logicalChaining * 0.25 +
    abstractReasoning * 0.25 +
    tierBonus
  ))
  
  let level: 'Elite' | 'Advanced' | 'Developing' | 'Foundational'
  if (score >= 85) level = 'Elite'
  else if (score >= 70) level = 'Advanced'
  else if (score >= 50) level = 'Developing'
  else level = 'Foundational'
  
  return {
    score: Math.round(score),
    level,
    components: {
      patternRecognition: Math.round(patternRecognition),
      structuralTransformation: Math.round(structuralTransformation),
      logicalChaining: Math.round(logicalChaining),
      abstractReasoning: Math.round(abstractReasoning),
    },
  }
}

function calculateStructuralAdaptation(
  answers: EliteAnswer[],
  state: AdaptiveEliteState
): StructuralAdaptationLevel {
  if (answers.length === 0) {
    return {
      score: 0,
      level: 'Limited',
      adaptationSpeed: 0,
      complexityHandling: 0,
      trapAvoidance: 0,
    }
  }
  
  // Adaptation speed: how quickly tier increased
  const tierHistory = state.tierHistory
  let tierIncreases = 0
  for (let i = 1; i < tierHistory.length; i++) {
    if (tierHistory[i] > tierHistory[i - 1]) tierIncreases++
  }
  const adaptationSpeed = Math.min(100, (tierIncreases / Math.max(1, answers.length)) * 200)
  
  // Complexity handling: performance at high tiers
  const highTierAnswers = answers.filter(a => a.tier >= 4)
  const highTierCorrect = highTierAnswers.filter(a => a.isCorrect).length
  const complexityHandling = highTierAnswers.length > 0 
    ? (highTierCorrect / highTierAnswers.length) * 100 
    : 50
  
  // Trap avoidance: accuracy on problems with structural traps
  const trapAvoidance = state.structuralStability
  
  const score = (
    adaptationSpeed * 0.3 +
    complexityHandling * 0.4 +
    trapAvoidance * 0.3
  )
  
  let level: 'Exceptional' | 'Strong' | 'Moderate' | 'Limited'
  if (score >= 80) level = 'Exceptional'
  else if (score >= 60) level = 'Strong'
  else if (score >= 40) level = 'Moderate'
  else level = 'Limited'
  
  return {
    score: Math.round(score),
    level,
    adaptationSpeed: Math.round(adaptationSpeed),
    complexityHandling: Math.round(complexityHandling),
    trapAvoidance: Math.round(trapAvoidance),
  }
}

function calculateAnalyticalEndurance(
  answers: EliteAnswer[]
): AnalyticalEnduranceScore {
  if (answers.length < 4) {
    return {
      score: 50,
      level: 'Average',
      sustainedPerformance: 50,
      latePhaseAccuracy: 50,
      fatigueResistance: 50,
    }
  }
  
  const midPoint = Math.floor(answers.length / 2)
  const firstHalf = answers.slice(0, midPoint)
  const secondHalf = answers.slice(midPoint)
  
  const firstHalfAcc = firstHalf.filter(a => a.isCorrect).length / firstHalf.length
  const secondHalfAcc = secondHalf.filter(a => a.isCorrect).length / secondHalf.length
  
  // Sustained performance: overall consistency
  const overallAcc = answers.filter(a => a.isCorrect).length / answers.length
  const sustainedPerformance = overallAcc * 100
  
  // Late phase accuracy
  const latePhaseAccuracy = secondHalfAcc * 100
  
  // Fatigue resistance: second half vs first half
  const fatigueResistance = Math.min(100, (secondHalfAcc / Math.max(0.01, firstHalfAcc)) * 80)
  
  const score = (
    sustainedPerformance * 0.3 +
    latePhaseAccuracy * 0.4 +
    fatigueResistance * 0.3
  )
  
  let level: 'Superior' | 'High' | 'Average' | 'Low'
  if (score >= 80) level = 'Superior'
  else if (score >= 60) level = 'High'
  else if (score >= 40) level = 'Average'
  else level = 'Low'
  
  return {
    score: Math.round(score),
    level,
    sustainedPerformance: Math.round(sustainedPerformance),
    latePhaseAccuracy: Math.round(latePhaseAccuracy),
    fatigueResistance: Math.round(fatigueResistance),
  }
}

function calculateCognitiveStability(
  answers: EliteAnswer[],
  state: AdaptiveEliteState
): CognitiveStabilityIndex {
  if (answers.length === 0) {
    return {
      score: 50,
      level: 'Variable',
      underComplexity: 50,
      underPressure: 50,
      recoverySpeed: 50,
      consistencyScore: 50,
    }
  }
  
  // Under complexity: performance at tier 4+
  const complexAnswers = answers.filter(a => a.tier >= 4)
  const underComplexity = complexAnswers.length > 0
    ? (complexAnswers.filter(a => a.isCorrect).length / complexAnswers.length) * 100
    : 50
  
  // Under pressure: performance when time ratio > 1.5
  const pressureAnswers = answers.filter(a => a.timeSpent > a.expectedTime * 1.5)
  const underPressure = pressureAnswers.length > 0
    ? (pressureAnswers.filter(a => a.isCorrect).length / pressureAnswers.length) * 100
    : 70
  
  // Recovery speed: how quickly correct after wrong
  let recoveryCount = 0
  let recoveryOpportunities = 0
  for (let i = 1; i < answers.length; i++) {
    if (!answers[i - 1].isCorrect) {
      recoveryOpportunities++
      if (answers[i].isCorrect) recoveryCount++
    }
  }
  const recoverySpeed = recoveryOpportunities > 0
    ? (recoveryCount / recoveryOpportunities) * 100
    : 80
  
  // Consistency: structural stability
  const consistencyScore = state.structuralStability
  
  const score = (
    underComplexity * 0.3 +
    underPressure * 0.2 +
    recoverySpeed * 0.2 +
    consistencyScore * 0.3
  )
  
  let level: 'Exceptional' | 'Stable' | 'Variable' | 'Unstable'
  if (score >= 80) level = 'Exceptional'
  else if (score >= 60) level = 'Stable'
  else if (score >= 40) level = 'Variable'
  else level = 'Unstable'
  
  return {
    score: Math.round(score),
    level,
    underComplexity: Math.round(underComplexity),
    underPressure: Math.round(underPressure),
    recoverySpeed: Math.round(recoverySpeed),
    consistencyScore: Math.round(consistencyScore),
  }
}

function calculateElitePotential(
  strategic: StrategicThinkingIndex,
  adaptation: StructuralAdaptationLevel,
  endurance: AnalyticalEnduranceScore,
  stability: CognitiveStabilityIndex,
  state: AdaptiveEliteState
): ElitePotentialIndex {
  // Weight components
  const rawScore = (
    strategic.score * 0.30 +
    adaptation.score * 0.25 +
    endurance.score * 0.20 +
    stability.score * 0.25
  )
  
  // Bonus for reaching high tiers
  const tierBonus = state.currentTier >= 4 ? 10 : (state.currentTier >= 3 ? 5 : 0)
  
  // Penalty for breakdown
  const breakdownPenalty = state.breakdownDetected ? 15 : 0
  
  const score = Math.min(100, Math.max(0, rawScore + tierBonus - breakdownPenalty))
  
  // Calculate percentile (simplified estimation)
  const percentile = Math.min(99, Math.round(score * 0.95))
  
  let classification: 'Elite' | 'High Potential' | 'Developing' | 'Standard'
  let recommendation: string
  
  if (score >= 85) {
    classification = 'Elite'
    recommendation = 'Ерекше когнитивті қабілеттер анықталды. Олимпиадалық және зерттеу бағдарламаларына ұсынылады.'
  } else if (score >= 70) {
    classification = 'High Potential'
    recommendation = 'Жоғары әлеует байқалады. Арнайы дайындық арқылы элиталық деңгейге жетуге мүмкіндік бар.'
  } else if (score >= 50) {
    classification = 'Developing'
    recommendation = 'Дамып келе жатқан қабілеттер. Жүйелі жаттығу арқылы айтарлықтай жақсартуға болады.'
  } else {
    classification = 'Standard'
    recommendation = 'Негізгі дағдыларды нығайту қажет. Құрылымдық есептерге көбірек көңіл бөліңіз.'
  }
  
  return {
    score: Math.round(score),
    percentile,
    classification,
    recommendation,
  }
}

function generateKeyInsights(
  answers: EliteAnswer[],
  state: AdaptiveEliteState,
  strategic: StrategicThinkingIndex,
  stability: CognitiveStabilityIndex
): string[] {
  const insights: string[] = []
  
  // Tier progression insight
  const maxTier = Math.max(...state.tierHistory)
  if (maxTier >= 4) {
    insights.push(`Элиталық деңгейге жетті (Tier ${maxTier})`)
  }
  
  // Strategic thinking insight
  if (strategic.score >= 80) {
    insights.push('Стратегиялық ойлау деңгейі жоғары')
  }
  
  // Best domain
  const domains = Object.entries(state.performanceByDomain)
    .filter(([, v]) => v.total > 0)
    .map(([k, v]) => ({ domain: k as ProblemDomain, accuracy: v.correct / v.total }))
    .sort((a, b) => b.accuracy - a.accuracy)
  
  if (domains.length > 0 && domains[0].accuracy >= 0.8) {
    insights.push(`${DOMAIN_NAMES[domains[0].domain]} саласында ерекше нәтиже`)
  }
  
  // Stability insight
  if (stability.level === 'Exceptional') {
    insights.push('Когнитивті тұрақтылық өте жоғары')
  }
  
  // Overload handling
  if (state.inOverloadPhase && !state.breakdownDetected) {
    insights.push('Когнитивті жүктеме фазасын сәтті өтті')
  }
  
  if (insights.length === 0) {
    insights.push('Негізгі деңгейде орындалды')
  }
  
  return insights
}

function generateDevelopmentAreas(
  answers: EliteAnswer[],
  state: AdaptiveEliteState,
  strategic: StrategicThinkingIndex,
  endurance: AnalyticalEnduranceScore
): string[] {
  const areas: string[] = []
  
  // Weakest domain
  const domains = Object.entries(state.performanceByDomain)
    .filter(([, v]) => v.total > 0)
    .map(([k, v]) => ({ domain: k as ProblemDomain, accuracy: v.correct / v.total }))
    .sort((a, b) => a.accuracy - b.accuracy)
  
  if (domains.length > 0 && domains[0].accuracy < 0.6) {
    areas.push(`${DOMAIN_NAMES[domains[0].domain]} саласын дамыту қажет`)
  }
  
  // Strategic components
  const components = strategic.components
  const weakest = Object.entries(components)
    .sort((a, b) => a[1] - b[1])[0]
  
  if (weakest[1] < 60) {
    const names: Record<string, string> = {
      patternRecognition: 'Заңдылықтарды тану',
      structuralTransformation: 'Құрылымдық түрлендіру',
      logicalChaining: 'Логикалық тізбектеу',
      abstractReasoning: 'Абстрактілі ойлау',
    }
    areas.push(`${names[weakest[0]]} қабілетін жаттықтыру`)
  }
  
  // Endurance
  if (endurance.fatigueResistance < 60) {
    areas.push('Ұзақ сессияларда концентрацияны сақтау')
  }
  
  // Breakdown
  if (state.breakdownDetected) {
    areas.push('Жоғары күрделілікте тұрақтылықты арттыру')
  }
  
  if (areas.length === 0) {
    areas.push('Қазіргі деңгейді сақтау және тереңдету')
  }
  
  return areas
}

export function generateEliteModelingReport(
  answers: EliteAnswer[],
  state: AdaptiveEliteState,
  totalTime: number
): EliteModelingReport {
  const totalProblems = answers.length
  const correctAnswers = answers.filter(a => a.isCorrect).length
  const overallAccuracy = totalProblems > 0 ? (correctAnswers / totalProblems) * 100 : 0
  const avgTimePerProblem = totalProblems > 0 ? totalTime / totalProblems : 0
  
  const strategicThinking = calculateStrategicThinking(answers, state)
  const structuralAdaptation = calculateStructuralAdaptation(answers, state)
  const analyticalEndurance = calculateAnalyticalEndurance(answers)
  const cognitiveStability = calculateCognitiveStability(answers, state)
  const elitePotential = calculateElitePotential(
    strategicThinking,
    structuralAdaptation,
    analyticalEndurance,
    cognitiveStability,
    state
  )
  
  const domainBreakdown = (Object.keys(DOMAIN_NAMES) as ProblemDomain[]).map(domain => {
    const perf = state.performanceByDomain[domain]
    return {
      domain,
      name: DOMAIN_NAMES[domain],
      correct: perf.correct,
      total: perf.total,
      accuracy: perf.total > 0 ? Math.round((perf.correct / perf.total) * 100) : 0,
    }
  }).filter(d => d.total > 0)
  
  const keyInsights = generateKeyInsights(answers, state, strategicThinking, cognitiveStability)
  const developmentAreas = generateDevelopmentAreas(answers, state, strategicThinking, analyticalEndurance)
  
  return {
    sessionId: `elite_${Date.now()}`,
    completedAt: new Date().toISOString(),
    totalProblems,
    correctAnswers,
    overallAccuracy: Math.round(overallAccuracy * 10) / 10,
    totalTime: Math.round(totalTime),
    avgTimePerProblem: Math.round(avgTimePerProblem),
    strategicThinking,
    structuralAdaptation,
    analyticalEndurance,
    cognitiveStability,
    elitePotential,
    domainBreakdown,
    tierProgression: state.tierHistory,
    overloadPhaseReached: state.inOverloadPhase,
    breakdownOccurred: state.breakdownDetected,
    keyInsights,
    developmentAreas,
  }
}
