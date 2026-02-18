// UNT Exam Engine - Question Selection and Exam Flow Management

import type { UNTQuestion, UNTSubject, ExamState, ReadingPassage, AdaptiveState, DifficultyLevel } from './types'
import { UNT_SUBJECTS, UNT_TOTAL_TIME_SECONDS } from './types'
import {
  getReadingLiteracyQuestions,
  getLogicalMathQuestions,
  getKzHistoryQuestions,
  getMathematicsQuestions,
  getPhysicsQuestions,
  readingPassages,
} from './questionBanks'
import { createInitialAdaptiveState, createInitialPerformanceState } from './adaptiveEngine'

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function selectQuestionsByDifficulty(
  questions: UNTQuestion[],
  targetDifficulty: DifficultyLevel,
  count: number,
  type: 'single' | 'multiple'
): UNTQuestion[] {
  const filtered = questions.filter(q => q.type === type)
  
  // Sort by closeness to target difficulty
  const sorted = [...filtered].sort((a, b) => {
    const diffA = Math.abs(a.difficulty - targetDifficulty)
    const diffB = Math.abs(b.difficulty - targetDifficulty)
    return diffA - diffB
  })
  
  // Shuffle among questions with similar difficulty for variety
  const grouped: Map<number, UNTQuestion[]> = new Map()
  sorted.forEach(q => {
    const diff = Math.abs(q.difficulty - targetDifficulty)
    if (!grouped.has(diff)) grouped.set(diff, [])
    grouped.get(diff)!.push(q)
  })
  
  const result: UNTQuestion[] = []
  for (const [, group] of Array.from(grouped.entries()).sort((a, b) => a[0] - b[0])) {
    const shuffledGroup = shuffleArray(group)
    for (const q of shuffledGroup) {
      if (result.length < count) {
        result.push(q)
      }
    }
    if (result.length >= count) break
  }
  
  return result
}

function selectReadingQuestions(targetDifficulty: DifficultyLevel): UNTQuestion[] {
  const allQuestions = getReadingLiteracyQuestions()
  
  // Group questions by passage
  const passageGroups: Map<string, UNTQuestion[]> = new Map()
  allQuestions.forEach(q => {
    if (q.passageId) {
      if (!passageGroups.has(q.passageId)) passageGroups.set(q.passageId, [])
      passageGroups.get(q.passageId)!.push(q)
    }
  })
  
  // Select passages and their questions (maintaining grouping)
  const result: UNTQuestion[] = []
  const shuffledPassageIds = shuffleArray(Array.from(passageGroups.keys()))
  
  for (const passageId of shuffledPassageIds) {
    if (result.length >= 10) break
    const passageQuestions = passageGroups.get(passageId)!
    // Sort by difficulty closeness
    const sorted = [...passageQuestions].sort((a, b) => {
      const diffA = Math.abs(a.difficulty - targetDifficulty)
      const diffB = Math.abs(b.difficulty - targetDifficulty)
      return diffA - diffB
    })
    for (const q of sorted) {
      if (result.length < 10) result.push(q)
    }
  }
  
  return result
}

export function generateExamQuestions(initialDifficulty: DifficultyLevel = 5): UNTQuestion[] {
  const questions: UNTQuestion[] = []
  
  // Reading Literacy: 10 single choice (grouped by passage)
  const readingQuestions = selectReadingQuestions(initialDifficulty)
  questions.push(...readingQuestions)
  
  // Logical Math: 10 single choice
  const logicalQuestions = selectQuestionsByDifficulty(
    getLogicalMathQuestions(),
    initialDifficulty,
    10,
    'single'
  )
  questions.push(...logicalQuestions)
  
  // Kazakhstan History: 20 single choice
  const historyQuestions = selectQuestionsByDifficulty(
    getKzHistoryQuestions(),
    initialDifficulty,
    20,
    'single'
  )
  questions.push(...historyQuestions)
  
  // Mathematics: 30 single + 10 multiple
  const mathSingleQuestions = selectQuestionsByDifficulty(
    getMathematicsQuestions(),
    initialDifficulty,
    30,
    'single'
  )
  const mathMultipleQuestions = selectQuestionsByDifficulty(
    getMathematicsQuestions(),
    initialDifficulty,
    10,
    'multiple'
  )
  questions.push(...mathSingleQuestions, ...mathMultipleQuestions)
  
  // Physics: 30 single + 10 multiple
  const physicsSingleQuestions = selectQuestionsByDifficulty(
    getPhysicsQuestions(),
    initialDifficulty,
    30,
    'single'
  )
  const physicsMultipleQuestions = selectQuestionsByDifficulty(
    getPhysicsQuestions(),
    initialDifficulty,
    10,
    'multiple'
  )
  questions.push(...physicsSingleQuestions, ...physicsMultipleQuestions)
  
  return questions
}

export function getQuestionsForSubject(
  questions: UNTQuestion[],
  subject: UNTSubject
): UNTQuestion[] {
  return questions.filter(q => q.subject === subject)
}

export function getSubjectConfig(subject: UNTSubject) {
  return UNT_SUBJECTS.find(s => s.subject === subject)
}

export function getSubjectByIndex(index: number): UNTSubject | null {
  if (index < 0 || index >= UNT_SUBJECTS.length) return null
  return UNT_SUBJECTS[index].subject
}

export function getTotalQuestionCount(): number {
  return UNT_SUBJECTS.reduce(
    (acc, config) => acc + config.singleChoiceCount + config.multipleChoiceCount,
    0
  )
}

export function getQuestionIndexInExam(
  questions: UNTQuestion[],
  currentIndex: number
): {
  subject: UNTSubject
  subjectName: string
  questionInSubject: number
  totalInSubject: number
  overallIndex: number
  totalQuestions: number
} {
  const question = questions[currentIndex]
  if (!question) {
    return {
      subject: 'reading_literacy',
      subjectName: 'Оқу сауаттылығы',
      questionInSubject: 0,
      totalInSubject: 0,
      overallIndex: currentIndex,
      totalQuestions: questions.length,
    }
  }
  
  const subjectQuestions = questions.filter(q => q.subject === question.subject)
  const questionInSubject = subjectQuestions.findIndex(q => q.id === question.id) + 1
  const config = getSubjectConfig(question.subject)
  
  return {
    subject: question.subject,
    subjectName: config?.name || '',
    questionInSubject,
    totalInSubject: subjectQuestions.length,
    overallIndex: currentIndex + 1,
    totalQuestions: questions.length,
  }
}

export function createInitialExamState(questions: UNTQuestion[]): ExamState {
  return {
    phase: 'intro',
    questions,
    passages: readingPassages,
    currentIndex: 0,
    answers: [],
    performanceState: createInitialPerformanceState(),
    adaptiveState: createInitialAdaptiveState(),
    globalTimeRemaining: UNT_TOTAL_TIME_SECONDS,
    examStartTime: 0,
    questionStartTime: 0,
    isComplete: false,
    wasAutoSubmitted: false,
  }
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export function getPassageForQuestion(
  passages: ReadingPassage[],
  question: UNTQuestion
): ReadingPassage | null {
  if (!question.passageId) return null
  return passages.find(p => p.id === question.passageId) || null
}

export function getExpectedTimePerQuestion(): number {
  return UNT_TOTAL_TIME_SECONDS / getTotalQuestionCount()
}

export function calculateProgress(currentIndex: number, totalQuestions: number): number {
  return Math.round((currentIndex / totalQuestions) * 100)
}

export function getSubjectProgress(
  questions: UNTQuestion[],
  currentIndex: number
): { current: number; total: number }[] {
  const progress: { current: number; total: number }[] = []
  let cumulative = 0
  
  for (const config of UNT_SUBJECTS) {
    const subjectQuestions = questions.filter(q => q.subject === config.subject)
    const total = subjectQuestions.length
    const startIndex = cumulative
    const endIndex = cumulative + total
    
    let current = 0
    if (currentIndex >= endIndex) {
      current = total
    } else if (currentIndex >= startIndex) {
      current = currentIndex - startIndex
    }
    
    progress.push({ current, total })
    cumulative = endIndex
  }
  
  return progress
}

export function isLastQuestionInSubject(
  questions: UNTQuestion[],
  currentIndex: number
): boolean {
  if (currentIndex >= questions.length - 1) return true
  const currentSubject = questions[currentIndex]?.subject
  const nextSubject = questions[currentIndex + 1]?.subject
  return currentSubject !== nextSubject
}

export function getNextAdaptiveQuestion(
  allQuestions: UNTQuestion[],
  currentSubject: UNTSubject,
  answeredIds: Set<string>,
  adaptiveState: AdaptiveState
): UNTQuestion | null {
  const availableQuestions = allQuestions.filter(
    q => q.subject === currentSubject && !answeredIds.has(q.id)
  )
  
  if (availableQuestions.length === 0) return null
  
  const targetDifficulty = adaptiveState.currentDifficulty
  
  // Sort by difficulty closeness, with preference for trap questions if needed
  const sorted = [...availableQuestions].sort((a, b) => {
    if (adaptiveState.shouldIntroduceTrap) {
      if (a.isLogicalTrap && !b.isLogicalTrap) return -1
      if (!a.isLogicalTrap && b.isLogicalTrap) return 1
    }
    
    const diffA = Math.abs(a.difficulty - targetDifficulty)
    const diffB = Math.abs(b.difficulty - targetDifficulty)
    return diffA - diffB
  })
  
  // Add randomness among top candidates
  const topCandidates = sorted.slice(0, Math.min(3, sorted.length))
  return topCandidates[Math.floor(Math.random() * topCandidates.length)]
}
