// UNT Scoring Engine - Strict validation, no partial credit

import type {
  UNTQuestion,
  AnswerRecord,
  SubjectResult,
  UNTSubject,
  QuestionType,
  DifficultyLevel,
} from './types'
import { UNT_SUBJECTS } from './types'

export function validateSingleChoice(
  selected: number[],
  correct: number[]
): boolean {
  if (selected.length !== 1 || correct.length !== 1) return false
  return selected[0] === correct[0]
}

export function validateMultipleChoice(
  selected: number[],
  correct: number[]
): boolean {
  // FULL match required, order independent
  if (selected.length !== correct.length) return false
  const sortedSelected = [...selected].sort((a, b) => a - b)
  const sortedCorrect = [...correct].sort((a, b) => a - b)
  return sortedSelected.every((val, idx) => val === sortedCorrect[idx])
}

export function isPartiallyCorrect(
  selected: number[],
  correct: number[]
): boolean {
  if (selected.length === 0) return false
  const correctSet = new Set(correct)
  const hasCorrect = selected.some(s => correctSet.has(s))
  const allCorrect = selected.every(s => correctSet.has(s))
  return hasCorrect && !allCorrect
}

export function calculatePoints(
  type: QuestionType,
  isCorrect: boolean
): number {
  if (!isCorrect) return 0
  return type === 'single' ? 1 : 2
}

export function getMaxPoints(type: QuestionType): number {
  return type === 'single' ? 1 : 2
}

export function scoreAnswer(
  question: UNTQuestion,
  selectedAnswers: number[],
  timeSpent: number,
  questionIndex: number
): AnswerRecord {
  const isCorrect = question.type === 'single'
    ? validateSingleChoice(selectedAnswers, question.correctAnswers)
    : validateMultipleChoice(selectedAnswers, question.correctAnswers)

  const points = calculatePoints(question.type, isCorrect)
  const maxPoints = getMaxPoints(question.type)

  return {
    questionId: question.id,
    subject: question.subject,
    type: question.type,
    difficulty: question.difficulty,
    selectedAnswers,
    correctAnswers: question.correctAnswers,
    isCorrect,
    points,
    maxPoints,
    timeSpent,
    questionIndex,
    timestamp: Date.now(),
  }
}

export function calculateSubjectResult(
  subject: UNTSubject,
  answers: AnswerRecord[]
): SubjectResult {
  const subjectAnswers = answers.filter(a => a.subject === subject)
  const config = UNT_SUBJECTS.find(s => s.subject === subject)!
  
  const singleAnswers = subjectAnswers.filter(a => a.type === 'single')
  const multipleAnswers = subjectAnswers.filter(a => a.type === 'multiple')
  
  const singleCorrect = singleAnswers.filter(a => a.isCorrect).length
  const multipleCorrect = multipleAnswers.filter(a => a.isCorrect).length
  
  const singleScore = singleCorrect * 1
  const multipleScore = multipleCorrect * 2
  const totalScore = singleScore + multipleScore
  
  const totalQuestions = subjectAnswers.length
  const correctAnswers = singleCorrect + multipleCorrect
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0
  
  const totalTime = subjectAnswers.reduce((acc, a) => acc + a.timeSpent, 0)
  const avgTimePerQuestion = totalQuestions > 0 ? totalTime / totalQuestions : 0
  
  const avgDifficulty = totalQuestions > 0
    ? subjectAnswers.reduce((acc, a) => acc + a.difficulty, 0) / totalQuestions
    : 0
    
  const difficultyProgression = subjectAnswers.map(a => a.difficulty)

  return {
    subject,
    name: config.name,
    totalQuestions,
    correctAnswers,
    singleChoiceScore: singleScore,
    multipleChoiceScore: multipleScore,
    totalScore,
    maxScore: config.totalPoints,
    accuracy: Math.round(accuracy * 10) / 10,
    avgTimePerQuestion: Math.round(avgTimePerQuestion * 10) / 10,
    avgDifficulty: Math.round(avgDifficulty * 10) / 10,
    difficultyProgression,
  }
}

export function calculateTotalScore(answers: AnswerRecord[]): number {
  return answers.reduce((acc, a) => acc + a.points, 0)
}

export function getGrade(percentage: number): 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F' {
  if (percentage >= 95) return 'A+'
  if (percentage >= 90) return 'A'
  if (percentage >= 85) return 'B+'
  if (percentage >= 80) return 'B'
  if (percentage >= 75) return 'C+'
  if (percentage >= 70) return 'C'
  if (percentage >= 60) return 'D'
  return 'F'
}

export function findWeakestSubject(results: SubjectResult[]): SubjectResult {
  return results.reduce((weakest, current) => {
    const weakestPct = weakest.maxScore > 0 ? (weakest.totalScore / weakest.maxScore) * 100 : 0
    const currentPct = current.maxScore > 0 ? (current.totalScore / current.maxScore) * 100 : 0
    return currentPct < weakestPct ? current : weakest
  })
}

export function findStrongestSubject(results: SubjectResult[]): SubjectResult {
  return results.reduce((strongest, current) => {
    const strongestPct = strongest.maxScore > 0 ? (strongest.totalScore / strongest.maxScore) * 100 : 0
    const currentPct = current.maxScore > 0 ? (current.totalScore / current.maxScore) * 100 : 0
    return currentPct > strongestPct ? current : strongest
  })
}

export function getOptionLetter(index: number): string {
  return String.fromCharCode(65 + index)  // A, B, C, D, E, F, G, H
}

export function getSelectedLetters(indices: number[]): string {
  return indices.map(i => getOptionLetter(i)).join(', ')
}
