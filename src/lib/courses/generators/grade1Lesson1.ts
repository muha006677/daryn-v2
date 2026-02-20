import { Question } from '../types'

const objects = [
  { name: 'алма', emoji: '🍎' },
  { name: 'шар', emoji: '🎈' },
  { name: 'торт', emoji: '🎂' },
  { name: 'жұлдыз', emoji: '⭐' },
  { name: 'гүл', emoji: '🌸' },
  { name: 'кітап', emoji: '📚' },
  { name: 'қарындаш', emoji: '✏️' },
  { name: 'доп', emoji: '⚽' },
  { name: 'құс', emoji: '🐦' },
  { name: 'балық', emoji: '🐟' },
  { name: 'көбелек', emoji: '🦋' },
  { name: 'жүрек', emoji: '❤️' },
  { name: 'апельсин', emoji: '🍊' },
  { name: 'банан', emoji: '🍌' },
  { name: 'машина', emoji: '🚗' },
  { name: 'ұшақ', emoji: '✈️' },
  { name: 'үй', emoji: '🏠' },
  { name: 'ағаш', emoji: '🌳' },
  { name: 'күн', emoji: '☀️' },
  { name: 'ай', emoji: '🌙' },
]

const questionTemplates = [
  (obj: typeof objects[0], count: number) => ({
    question: `Суретте неше ${obj.name} бар? ${obj.emoji.repeat(count)}`,
    explanation: `Суретте ${count} ${obj.name} бар. Біз оларды санадық: ${Array.from({ length: count }, (_, i) => i + 1).join(', ')}.`,
  }),
  (obj: typeof objects[0], count: number) => ({
    question: `${obj.emoji.repeat(count)} — мұнда неше ${obj.name}?`,
    explanation: `Біз ${count}-ке дейін санадық: ${Array.from({ length: count }, (_, i) => i + 1).join(', ')}. Жауап: ${count}.`,
  }),
  (obj: typeof objects[0], count: number) => ({
    question: `Санаңыз: ${obj.emoji.repeat(count)}. Неше ${obj.name} бар?`,
    explanation: `${obj.name.charAt(0).toUpperCase() + obj.name.slice(1)} саны: ${count}. Әр біреуін санаймыз: ${Array.from({ length: count }, (_, i) => i + 1).join(', ')}.`,
  }),
  (obj: typeof objects[0], count: number) => ({
    question: `${obj.emoji} ${obj.emoji.repeat(count - 1)} — барлығы нешеу?`,
    explanation: `Барлығы ${count} ${obj.name}. Саналған сандар: ${Array.from({ length: count }, (_, i) => i + 1).join(', ')}.`,
  }),
]

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function generateWrongOptions(correct: number): number[] {
  const wrongs: number[] = []
  const possibleWrongs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((n) => n !== correct)
  
  const nearNumbers = possibleWrongs.filter((n) => Math.abs(n - correct) <= 2)
  const farNumbers = possibleWrongs.filter((n) => Math.abs(n - correct) > 2)
  
  const shuffledNear = shuffleArray(nearNumbers)
  const shuffledFar = shuffleArray(farNumbers)
  
  while (wrongs.length < 3) {
    if (shuffledNear.length > 0 && (wrongs.length < 2 || shuffledFar.length === 0)) {
      wrongs.push(shuffledNear.pop()!)
    } else if (shuffledFar.length > 0) {
      wrongs.push(shuffledFar.pop()!)
    }
  }
  
  return wrongs
}

export function generateCountingQuestion(id: number): Question {
  const count = Math.floor(Math.random() * 10) + 1
  const obj = objects[Math.floor(Math.random() * objects.length)]
  const template = questionTemplates[Math.floor(Math.random() * questionTemplates.length)]
  
  const { question, explanation } = template(obj, count)
  const correctAnswer = count.toString()
  const wrongAnswers = generateWrongOptions(count).map((n) => n.toString())
  
  const options = shuffleArray([correctAnswer, ...wrongAnswers])
  
  return {
    id: `g1-counting-${id}`,
    type: 'single',
    question,
    options,
    correctAnswer,
    explanation,
    points: 1,
  }
}

export function generateQuestionBank(count: number = 100): Question[] {
  const questions: Question[] = []
  const usedCombinations = new Set<string>()
  
  let attempts = 0
  const maxAttempts = count * 10
  
  while (questions.length < count && attempts < maxAttempts) {
    const question = generateCountingQuestion(questions.length)
    const key = question.question
    
    if (!usedCombinations.has(key)) {
      usedCombinations.add(key)
      questions.push(question)
    }
    attempts++
  }
  
  while (questions.length < count) {
    questions.push(generateCountingQuestion(questions.length))
  }
  
  return questions
}

export interface Lesson1Question {
  id: string
  question: string
  options: number[]
  correct: number
  explanation: string
}

export function generateLesson1Questions(count: number = 100): Lesson1Question[] {
  const questions: Lesson1Question[] = []
  const usedCombinations = new Set<string>()

  let attempts = 0
  const maxAttempts = count * 10

  while (questions.length < count && attempts < maxAttempts) {
    const q = generateCountingQuestion(questions.length)
    const correct = parseInt(q.correctAnswer, 10)
    const options = (q.options ?? []).map((s) => parseInt(s, 10)).filter((n) => !isNaN(n))
    const key = q.question

    if (!usedCombinations.has(key) && options.length >= 4) {
      usedCombinations.add(key)
      questions.push({
        id: q.id,
        question: q.question,
        options,
        correct,
        explanation: q.explanation ?? '',
      })
    }
    attempts++
  }

  while (questions.length < count) {
    const q = generateCountingQuestion(questions.length)
    const correct = parseInt(q.correctAnswer, 10)
    const options = (q.options ?? []).map((s) => parseInt(s, 10)).filter((n) => !isNaN(n))
    questions.push({
      id: q.id,
      question: q.question,
      options: options.length >= 4 ? options : [1, 2, 3, 4],
      correct,
      explanation: q.explanation ?? '',
    })
  }

  return questions
}

export const lesson1Config = {
  id: 'counting-10',
  title: 'Заттарды санау (10-ға дейін)',
  description: '1-ден 10-ға дейін заттарды санау — 100 динамикалық сұрақ',
  questionsPerBatch: 5,
  totalQuestions: 100,
}
