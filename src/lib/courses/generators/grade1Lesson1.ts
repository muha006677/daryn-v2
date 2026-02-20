import { Question } from '../types'
import { ObjectType, objectNames, objectTypes } from '@/components/VisualCounter'

export interface AdaptiveQuestion extends Question {
  level: number
  objectType: ObjectType
  count: number
  visualClutter?: number
}

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5

interface LevelConfig {
  minNumber: number
  maxNumber: number
  distractorRange: number
  visualClutter: number
  questionStyle: 'simple' | 'mixed' | 'reverse' | 'word'
}

const levelConfigs: Record<DifficultyLevel, LevelConfig> = {
  1: { minNumber: 1, maxNumber: 5, distractorRange: 1, visualClutter: 0, questionStyle: 'simple' },
  2: { minNumber: 1, maxNumber: 10, distractorRange: 2, visualClutter: 0, questionStyle: 'simple' },
  3: { minNumber: 1, maxNumber: 10, distractorRange: 2, visualClutter: 2, questionStyle: 'mixed' },
  4: { minNumber: 1, maxNumber: 10, distractorRange: 3, visualClutter: 3, questionStyle: 'reverse' },
  5: { minNumber: 3, maxNumber: 10, distractorRange: 3, visualClutter: 4, questionStyle: 'word' },
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateWrongOptions(correct: number, level: DifficultyLevel): number[] {
  const config = levelConfigs[level]
  const wrongs: number[] = []
  const range = config.distractorRange
  
  const possibleWrongs = Array.from({ length: 10 }, (_, i) => i + 1)
    .filter((n) => n !== correct && n >= 1 && n <= 10)
  
  const nearNumbers = possibleWrongs.filter((n) => Math.abs(n - correct) <= range)
  const farNumbers = possibleWrongs.filter((n) => Math.abs(n - correct) > range)
  
  const shuffledNear = shuffleArray(nearNumbers)
  const shuffledFar = shuffleArray(farNumbers)
  
  while (wrongs.length < 3) {
    if (shuffledNear.length > 0 && (wrongs.length < 2 || shuffledFar.length === 0)) {
      wrongs.push(shuffledNear.pop()!)
    } else if (shuffledFar.length > 0) {
      wrongs.push(shuffledFar.pop()!)
    } else {
      const remaining = possibleWrongs.filter((n) => !wrongs.includes(n))
      if (remaining.length > 0) {
        wrongs.push(remaining[0])
      }
    }
  }
  
  return wrongs.slice(0, 3)
}

function generateQuestionText(
  objectType: ObjectType, 
  count: number, 
  style: LevelConfig['questionStyle']
): { question: string; explanation: string } {
  const name = objectNames[objectType]
  const countStr = Array.from({ length: count }, (_, i) => i + 1).join(', ')
  
  switch (style) {
    case 'simple':
      return {
        question: `Суретте неше ${name} бар?`,
        explanation: `Суретте ${count} ${name} бар. Біз оларды санадық: ${countStr}.`,
      }
    
    case 'mixed':
      const templates = [
        `Суретте неше ${name} бар?`,
        `${name.charAt(0).toUpperCase() + name.slice(1)} санын анықтаңыз`,
        `Барлық ${name} санаңыз`,
      ]
      return {
        question: templates[Math.floor(Math.random() * templates.length)],
        explanation: `Дұрыс жауап: ${count}. Санау: ${countStr}.`,
      }
    
    case 'reverse':
      return {
        question: `Суреттегі ${name} санын табыңыз. Кері санаңыз!`,
        explanation: `${count} ${name}. Кері санау: ${Array.from({ length: count }, (_, i) => count - i).join(', ')}.`,
      }
    
    case 'word':
      const wordProblems = [
        `Бақшада ${name} өсіп тұр. Барлығы неше ${name} бар?`,
        `Үстелде ${name} жатыр. Оларды санаңыз.`,
        `Алма ағашында ${name} көрінеді. Неше ${name} бар?`,
      ]
      return {
        question: wordProblems[Math.floor(Math.random() * wordProblems.length)],
        explanation: `Есептегенде ${count} ${name} шықты. Санау: ${countStr}.`,
      }
  }
}

export function generateCountingQuestion(id: number, level: DifficultyLevel = 2): AdaptiveQuestion {
  const config = levelConfigs[level]
  const count = getRandomInt(config.minNumber, config.maxNumber)
  const objectType = objectTypes[Math.floor(Math.random() * objectTypes.length)]
  
  const { question, explanation } = generateQuestionText(objectType, count, config.questionStyle)
  const correctAnswer = count.toString()
  const wrongAnswers = generateWrongOptions(count, level).map((n) => n.toString())
  
  const options = shuffleArray([correctAnswer, ...wrongAnswers])
  
  return {
    id: `g1-counting-${id}-L${level}`,
    type: 'single',
    question,
    options,
    correctAnswer,
    explanation,
    points: level,
    level,
    objectType,
    count,
    visualClutter: config.visualClutter,
  }
}

export function generateQuestionBank(totalCount: number = 100, level: DifficultyLevel = 2): AdaptiveQuestion[] {
  const questions: AdaptiveQuestion[] = []
  const usedCombinations = new Set<string>()
  
  let attempts = 0
  const maxAttempts = totalCount * 10
  
  while (questions.length < totalCount && attempts < maxAttempts) {
    const question = generateCountingQuestion(questions.length, level)
    const key = `${question.objectType}-${question.count}-${question.question.slice(0, 20)}`
    
    if (!usedCombinations.has(key)) {
      usedCombinations.add(key)
      questions.push(question)
    }
    attempts++
  }
  
  while (questions.length < totalCount) {
    questions.push(generateCountingQuestion(questions.length, level))
  }
  
  return questions
}

export function generateAdaptiveQuestion(id: number, level: DifficultyLevel): AdaptiveQuestion {
  return generateCountingQuestion(id, level)
}

export const lesson1Config = {
  id: 'counting-10',
  title: 'Заттарды санау (10-ға дейін)',
  description: '1-ден 10-ға дейін заттарды санау',
  questionsPerBatch: 5,
  totalQuestions: 100,
  minLevel: 1 as DifficultyLevel,
  maxLevel: 5 as DifficultyLevel,
}

export const levelNames: Record<DifficultyLevel, string> = {
  1: 'Оңай (1-5)',
  2: 'Қарапайым (1-10)',
  3: 'Орташа',
  4: 'Қиын',
  5: 'Күрделі',
}

export const levelColors: Record<DifficultyLevel, string> = {
  1: 'bg-emerald-100 text-emerald-700',
  2: 'bg-blue-100 text-blue-700',
  3: 'bg-amber-100 text-amber-700',
  4: 'bg-orange-100 text-orange-700',
  5: 'bg-red-100 text-red-700',
}
