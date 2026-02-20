import { Question, AnswerState, PracticeResult, QuestionResult } from './types'

export function checkAnswer(question: Question, userAnswer: string | string[]): boolean {
  if (question.type === 'multiple') {
    const correctSet = new Set(question.correctAnswer as string[])
    const userSet = new Set(userAnswer as string[])
    
    if (correctSet.size !== userSet.size) return false
    for (const item of correctSet) {
      if (!userSet.has(item)) return false
    }
    return true
  }
  
  const normalizedUser = String(userAnswer).trim().toLowerCase()
  const normalizedCorrect = String(question.correctAnswer).trim().toLowerCase()
  
  return normalizedUser === normalizedCorrect
}

export function calculateResults(questions: Question[], answers: AnswerState): PracticeResult {
  const results: QuestionResult[] = []
  let correctAnswers = 0
  let totalPoints = 0
  let earnedPoints = 0

  for (const question of questions) {
    const userAnswer = answers[question.id] || (question.type === 'multiple' ? [] : '')
    const isCorrect = checkAnswer(question, userAnswer)
    const points = isCorrect ? question.points : 0

    totalPoints += question.points
    earnedPoints += points
    if (isCorrect) correctAnswers++

    results.push({
      questionId: question.id,
      isCorrect,
      userAnswer,
      correctAnswer: question.correctAnswer,
      points: question.points,
      earnedPoints: points,
    })
  }

  return {
    totalQuestions: questions.length,
    correctAnswers,
    totalPoints,
    earnedPoints,
    percentage: totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0,
    results,
  }
}
