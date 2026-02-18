// UNT Advanced Diagnostic Report Generator

import type {
  AnswerRecord,
  SubjectResult,
  TimeManagementAnalysis,
  StressResponseAnalysis,
  CognitiveProfile,
  MultipleChoicePrecision,
  DiagnosticReport,
  UNTSubject,
  PerformanceState,
  AdaptiveState,
} from './types'
import { UNT_SUBJECTS, UNT_TOTAL_POINTS, UNT_TOTAL_TIME_SECONDS, UNT_TOTAL_QUESTIONS } from './types'
import {
  calculateSubjectResult,
  calculateTotalScore,
  getGrade,
  findWeakestSubject,
  findStrongestSubject,
  isPartiallyCorrect,
} from './scoringEngine'

function analyzeTimeManagement(
  answers: AnswerRecord[],
  totalTimeUsed: number
): TimeManagementAnalysis {
  const expectedPacePerQuestion = UNT_TOTAL_TIME_SECONDS / UNT_TOTAL_QUESTIONS
  const actualPacePerQuestion = answers.length > 0 ? totalTimeUsed / answers.length : 0
  const paceRatio = actualPacePerQuestion / expectedPacePerQuestion
  
  let pace: 'rushed' | 'optimal' | 'slow'
  if (paceRatio < 0.7) pace = 'rushed'
  else if (paceRatio > 1.3) pace = 'slow'
  else pace = 'optimal'
  
  const timeDistribution = UNT_SUBJECTS.map(config => {
    const subjectAnswers = answers.filter(a => a.subject === config.subject)
    const timeSpent = subjectAnswers.reduce((acc, a) => acc + a.timeSpent, 0)
    return {
      subject: config.subject,
      name: config.name,
      timeSpent,
      questionCount: subjectAnswers.length,
      avgTime: subjectAnswers.length > 0 ? timeSpent / subjectAnswers.length : 0,
    }
  })
  
  return {
    totalAllocated: UNT_TOTAL_TIME_SECONDS,
    totalUsed: totalTimeUsed,
    pace,
    paceRatio: Math.round(paceRatio * 100) / 100,
    expectedPacePerQuestion: Math.round(expectedPacePerQuestion),
    actualPacePerQuestion: Math.round(actualPacePerQuestion),
    timeDistribution,
  }
}

function analyzeStressResponse(
  answers: AnswerRecord[],
  performanceState: PerformanceState
): StressResponseAnalysis {
  const totalAnswers = answers.length
  const pressureThreshold = Math.floor(totalAnswers * 0.75)
  
  const normalAnswers = answers.slice(0, pressureThreshold)
  const pressureAnswers = answers.slice(pressureThreshold)
  
  const normalCorrect = normalAnswers.filter(a => a.isCorrect).length
  const pressureCorrect = pressureAnswers.filter(a => a.isCorrect).length
  
  const normalAccuracy = normalAnswers.length > 0 
    ? (normalCorrect / normalAnswers.length) * 100 
    : 0
  const pressureAccuracy = pressureAnswers.length > 0 
    ? (pressureCorrect / pressureAnswers.length) * 100 
    : 0
  
  const accuracyDrop = Math.max(0, normalAccuracy - pressureAccuracy)
  
  let stressResistance: 'high' | 'moderate' | 'low'
  if (accuracyDrop < 5) stressResistance = 'high'
  else if (accuracyDrop < 15) stressResistance = 'moderate'
  else stressResistance = 'low'
  
  const performanceUnderPressure = Math.max(0, 100 - accuracyDrop * 2)
  
  return {
    normalAccuracy: Math.round(normalAccuracy * 10) / 10,
    pressureAccuracy: Math.round(pressureAccuracy * 10) / 10,
    accuracyDrop: Math.round(accuracyDrop * 10) / 10,
    stressResistance,
    performanceUnderPressure: Math.round(performanceUnderPressure),
  }
}

function analyzeCognitiveProfile(
  answers: AnswerRecord[],
  subjectResults: SubjectResult[]
): CognitiveProfile {
  // Logical strength from logical_math performance
  const logicalResult = subjectResults.find(r => r.subject === 'logical_math')
  const logicalStrength = logicalResult 
    ? (logicalResult.totalScore / logicalResult.maxScore) * 100 
    : 0
  
  // Analytical endurance: performance in later 50% vs first 50%
  const midPoint = Math.floor(answers.length / 2)
  const firstHalf = answers.slice(0, midPoint)
  const secondHalf = answers.slice(midPoint)
  const firstHalfAcc = firstHalf.length > 0 
    ? (firstHalf.filter(a => a.isCorrect).length / firstHalf.length) * 100 
    : 0
  const secondHalfAcc = secondHalf.length > 0 
    ? (secondHalf.filter(a => a.isCorrect).length / secondHalf.length) * 100 
    : 0
  const analyticalEndurance = secondHalfAcc >= firstHalfAcc * 0.9 
    ? Math.min(100, secondHalfAcc * 1.1) 
    : secondHalfAcc
  
  // Multi-step reasoning from multiple choice accuracy
  const multipleAnswers = answers.filter(a => a.type === 'multiple')
  const multipleCorrect = multipleAnswers.filter(a => a.isCorrect).length
  const multiStepReasoning = multipleAnswers.length > 0 
    ? (multipleCorrect / multipleAnswers.length) * 100 
    : 0
  
  // Pattern recognition from reading comprehension
  const readingResult = subjectResults.find(r => r.subject === 'reading_literacy')
  const patternRecognition = readingResult 
    ? (readingResult.totalScore / readingResult.maxScore) * 100 
    : 0
  
  // Problem solving from math + physics
  const mathResult = subjectResults.find(r => r.subject === 'mathematics')
  const physicsResult = subjectResults.find(r => r.subject === 'physics')
  const mathScore = mathResult ? (mathResult.totalScore / mathResult.maxScore) * 100 : 0
  const physicsScore = physicsResult ? (physicsResult.totalScore / physicsResult.maxScore) * 100 : 0
  const problemSolving = (mathScore + physicsScore) / 2
  
  const overallCognitiveScore = (
    logicalStrength * 0.2 +
    analyticalEndurance * 0.2 +
    multiStepReasoning * 0.2 +
    patternRecognition * 0.2 +
    problemSolving * 0.2
  )
  
  return {
    logicalStrength: Math.round(logicalStrength),
    analyticalEndurance: Math.round(analyticalEndurance),
    multiStepReasoning: Math.round(multiStepReasoning),
    patternRecognition: Math.round(patternRecognition),
    problemSolving: Math.round(problemSolving),
    overallCognitiveScore: Math.round(overallCognitiveScore),
  }
}

function analyzeMultipleChoicePrecision(answers: AnswerRecord[]): MultipleChoicePrecision {
  const multipleAnswers = answers.filter(a => a.type === 'multiple')
  
  const totalAttempted = multipleAnswers.length
  const fullyCorrect = multipleAnswers.filter(a => a.isCorrect).length
  const partiallyCorrect = multipleAnswers.filter(a => 
    !a.isCorrect && isPartiallyCorrect(a.selectedAnswers, a.correctAnswers)
  ).length
  const completelyWrong = totalAttempted - fullyCorrect - partiallyCorrect
  
  const precisionRate = totalAttempted > 0 
    ? (fullyCorrect / totalAttempted) * 100 
    : 0
  
  let commonMistakePattern = 'Жеткілікті деректер жоқ'
  if (partiallyCorrect > fullyCorrect) {
    commonMistakePattern = 'Толық емес таңдау — барлық дұрыс жауаптарды таңдамау'
  } else if (completelyWrong > partiallyCorrect) {
    commonMistakePattern = 'Қате түсіну — дұрыс емес нұсқаларды таңдау'
  } else if (fullyCorrect >= totalAttempted * 0.7) {
    commonMistakePattern = 'Тұрақты дұрыс орындау'
  }
  
  return {
    totalAttempted,
    fullyCorrect,
    partiallyCorrect,
    completelyWrong,
    precisionRate: Math.round(precisionRate * 10) / 10,
    commonMistakePattern,
  }
}

function generateRecommendations(
  subjectResults: SubjectResult[],
  timeManagement: TimeManagementAnalysis,
  stressResponse: StressResponseAnalysis,
  cognitiveProfile: CognitiveProfile,
  multipleChoicePrecision: MultipleChoicePrecision,
  totalScore: number
): string[] {
  const recommendations: string[] = []
  const percentage = (totalScore / UNT_TOTAL_POINTS) * 100
  
  // Subject-specific recommendations
  const weakest = findWeakestSubject(subjectResults)
  const weakestPct = weakest.maxScore > 0 ? (weakest.totalScore / weakest.maxScore) * 100 : 0
  if (weakestPct < 60) {
    recommendations.push(`${weakest.name} пәнін күшейту қажет — қазіргі көрсеткіш ${weakestPct.toFixed(0)}%`)
  }
  
  // Time management recommendations
  if (timeManagement.pace === 'rushed') {
    recommendations.push('Уақытты баяулату керек — сұрақтарды мұқият оқыңыз')
  } else if (timeManagement.pace === 'slow') {
    recommendations.push('Жылдамырақ жауап беру қажет — уақытты тиімді пайдаланыңыз')
  }
  
  // Stress response recommendations
  if (stressResponse.stressResistance === 'low') {
    recommendations.push('Уақыт қысымында жұмыс істеу дағдысын жақсарту керек')
  }
  
  // Cognitive recommendations
  if (cognitiveProfile.analyticalEndurance < 60) {
    recommendations.push('Ұзақ тесттерде шыдамдылықты арттыру керек — демалыс режимін сақтаңыз')
  }
  
  if (cognitiveProfile.multiStepReasoning < 50) {
    recommendations.push('Көп қадамды есептерді шешу дағдысын дамыту қажет')
  }
  
  // Multiple choice recommendations
  if (multipleChoicePrecision.precisionRate < 50) {
    recommendations.push('Көп жауапты сұрақтарға көбірек көңіл бөліңіз')
  }
  
  // Overall recommendations
  if (percentage >= 85) {
    recommendations.push('Жоғары деңгей! Осы нәтижені сақтап, әлсіз жақтарыңызды жақсартыңыз')
  } else if (percentage >= 70) {
    recommendations.push('Жақсы нәтиже. Жүйелі дайындық арқылы жоғарылата аласыз')
  } else if (percentage >= 50) {
    recommendations.push('Орташа нәтиже. Күнделікті жаттығу ұсынылады')
  } else {
    recommendations.push('Барлық пәндерден қосымша дайындық қажет')
  }
  
  return recommendations
}

export function generateDiagnosticReport(
  answers: AnswerRecord[],
  performanceState: PerformanceState,
  adaptiveState: AdaptiveState,
  totalTimeUsed: number,
  wasAutoSubmitted: boolean
): DiagnosticReport {
  const subjectResults: SubjectResult[] = UNT_SUBJECTS.map(config =>
    calculateSubjectResult(config.subject, answers)
  )
  
  const totalScore = calculateTotalScore(answers)
  const percentage = (totalScore / UNT_TOTAL_POINTS) * 100
  const grade = getGrade(percentage)
  
  const weakestSubject = findWeakestSubject(subjectResults)
  const strongestSubject = findStrongestSubject(subjectResults)
  
  const timeManagement = analyzeTimeManagement(answers, totalTimeUsed)
  const stressResponse = analyzeStressResponse(answers, performanceState)
  const cognitiveProfile = analyzeCognitiveProfile(answers, subjectResults)
  const multipleChoicePrecision = analyzeMultipleChoicePrecision(answers)
  
  const recommendations = generateRecommendations(
    subjectResults,
    timeManagement,
    stressResponse,
    cognitiveProfile,
    multipleChoicePrecision,
    totalScore
  )
  
  return {
    totalScore,
    maxScore: UNT_TOTAL_POINTS,
    percentage: Math.round(percentage * 10) / 10,
    grade,
    subjectResults,
    strongestSubject,
    weakestSubject,
    timeManagement,
    stressResponse,
    cognitiveProfile,
    multipleChoicePrecision,
    adaptiveDifficultyProgression: adaptiveState.difficultyHistory,
    recommendations,
    completedAt: new Date().toISOString(),
    totalTimeUsed,
    wasAutoSubmitted,
  }
}
