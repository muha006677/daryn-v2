// Elite Cognitive Modeling System - Types

export type ProblemDomain =
  | 'structural_logic'
  | 'parametric_analysis'
  | 'model_construction'
  | 'ambiguity_resolution'
  | 'meta_reasoning'

export type ComplexityTier = 1 | 2 | 3 | 4 | 5  // 1 = Advanced, 5 = Elite

export interface StructuralProblem {
  id: string
  domain: ProblemDomain
  tier: ComplexityTier
  prompt: string
  context?: string
  layers: ProblemLayer[]
  options: string[]
  correctAnswer: number
  explanation: string
  structuralTraps: string[]
  requiredSteps: number
  expectedTime: number  // seconds
  isAmbiguous?: boolean
  transformationType?: string
}

export interface ProblemLayer {
  level: number
  description: string
  requirement: string
}

export interface EliteAnswer {
  problemId: string
  domain: ProblemDomain
  tier: ComplexityTier
  selectedAnswer: number
  isCorrect: boolean
  timeSpent: number
  expectedTime: number
  requiredSteps: number
  wasUnderPressure: boolean
}

export interface AdaptiveEliteState {
  currentTier: ComplexityTier
  problemsSolved: number
  consecutiveCorrect: number
  consecutiveWrong: number
  avgTimeRatio: number  // actual/expected
  structuralStability: number  // 0-100
  inOverloadPhase: boolean
  breakdownDetected: boolean
  tierHistory: ComplexityTier[]
  performanceByDomain: Record<ProblemDomain, { correct: number; total: number }>
}

export interface StrategicThinkingIndex {
  score: number  // 0-100
  level: 'Elite' | 'Advanced' | 'Developing' | 'Foundational'
  components: {
    patternRecognition: number
    structuralTransformation: number
    logicalChaining: number
    abstractReasoning: number
  }
}

export interface StructuralAdaptationLevel {
  score: number  // 0-100
  level: 'Exceptional' | 'Strong' | 'Moderate' | 'Limited'
  adaptationSpeed: number
  complexityHandling: number
  trapAvoidance: number
}

export interface AnalyticalEnduranceScore {
  score: number  // 0-100
  level: 'Superior' | 'High' | 'Average' | 'Low'
  sustainedPerformance: number
  latePhaseAccuracy: number
  fatigueResistance: number
}

export interface CognitiveStabilityIndex {
  score: number  // 0-100
  level: 'Exceptional' | 'Stable' | 'Variable' | 'Unstable'
  underComplexity: number
  underPressure: number
  recoverySpeed: number
  consistencyScore: number
}

export interface ElitePotentialIndex {
  score: number  // 0-100
  percentile: number
  classification: 'Elite' | 'High Potential' | 'Developing' | 'Standard'
  recommendation: string
}

export interface EliteModelingReport {
  sessionId: string
  completedAt: string
  totalProblems: number
  correctAnswers: number
  overallAccuracy: number
  totalTime: number
  avgTimePerProblem: number
  
  strategicThinking: StrategicThinkingIndex
  structuralAdaptation: StructuralAdaptationLevel
  analyticalEndurance: AnalyticalEnduranceScore
  cognitiveStability: CognitiveStabilityIndex
  elitePotential: ElitePotentialIndex
  
  domainBreakdown: {
    domain: ProblemDomain
    name: string
    correct: number
    total: number
    accuracy: number
  }[]
  
  tierProgression: ComplexityTier[]
  overloadPhaseReached: boolean
  breakdownOccurred: boolean
  
  keyInsights: string[]
  developmentAreas: string[]
}

export const DOMAIN_NAMES: Record<ProblemDomain, string> = {
  structural_logic: 'Құрылымдық логика',
  parametric_analysis: 'Параметрлік талдау',
  model_construction: 'Модельдік құрастыру',
  ambiguity_resolution: 'Көпмәнділікті шешу',
  meta_reasoning: 'Мета-ойлау',
}

export const TIER_NAMES: Record<ComplexityTier, string> = {
  1: 'Жоғары',
  2: 'Күрделі',
  3: 'Өте күрделі',
  4: 'Элиталық',
  5: 'Ультра-элиталық',
}
