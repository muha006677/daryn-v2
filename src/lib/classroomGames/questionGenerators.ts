// Classroom Games - Question Generators

import type { GameQuestion, DifficultyLevel } from './types'

// Logic Sprint Questions
export function generateLogicSprintQuestions(
  grade: number,
  difficulty: DifficultyLevel,
  count: number
): GameQuestion[] {
  const questions: GameQuestion[] = []
  
  for (let i = 0; i < count; i++) {
    const question = createLogicQuestion(grade, difficulty, i)
    questions.push(question)
  }
  
  return questions
}

function createLogicQuestion(grade: number, difficulty: DifficultyLevel, index: number): GameQuestion {
  const baseTime = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 15 : 10
  
  // Pattern sequences based on difficulty
  if (difficulty === 'easy') {
    const patterns = [
      { seq: [2, 4, 6, 8], next: 10, hint: '+2' },
      { seq: [5, 10, 15, 20], next: 25, hint: '+5' },
      { seq: [1, 3, 5, 7], next: 9, hint: '+2' },
      { seq: [10, 20, 30, 40], next: 50, hint: '+10' },
      { seq: [3, 6, 9, 12], next: 15, hint: '+3' },
    ]
    const p = patterns[index % patterns.length]
    return {
      id: `logic_${difficulty}_${index}`,
      prompt: `Тізбекті жалғастыр: ${p.seq.join(', ')}, ?`,
      options: [String(p.next), String(p.next + 2), String(p.next - 1), String(p.next + 5)],
      correctAnswer: 0,
      difficulty,
      timeLimit: baseTime,
      hiddenLogic: `Заңдылық: ${p.hint}`,
    }
  } else if (difficulty === 'medium') {
    const patterns = [
      { seq: [1, 2, 4, 8], next: 16, hint: '×2' },
      { seq: [1, 4, 9, 16], next: 25, hint: 'Квадраттар' },
      { seq: [2, 3, 5, 8], next: 13, hint: '+алдыңғы' },
      { seq: [1, 1, 2, 3, 5], next: 8, hint: 'Фибоначчи' },
      { seq: [100, 90, 81, 73], next: 66, hint: '-10, -9, -8...' },
    ]
    const p = patterns[index % patterns.length]
    return {
      id: `logic_${difficulty}_${index}`,
      prompt: `Тізбекті жалғастыр: ${p.seq.join(', ')}, ?`,
      options: [String(p.next), String(p.next + 1), String(p.next - 2), String(p.next + 3)],
      correctAnswer: 0,
      difficulty,
      timeLimit: baseTime,
      hiddenLogic: `Заңдылық: ${p.hint}`,
    }
  } else {
    const patterns = [
      { seq: [2, 6, 12, 20], next: 30, hint: '+4, +6, +8, +10' },
      { seq: [1, 3, 7, 15], next: 31, hint: '×2+1' },
      { seq: [3, 5, 9, 17], next: 33, hint: '×2-1' },
      { seq: [1, 2, 6, 24], next: 120, hint: '×2, ×3, ×4, ×5' },
      { seq: [2, 5, 11, 23], next: 47, hint: '×2+1' },
    ]
    const p = patterns[index % patterns.length]
    return {
      id: `logic_${difficulty}_${index}`,
      prompt: `Тізбекті жалғастыр: ${p.seq.join(', ')}, ?`,
      options: [String(p.next), String(p.next + 2), String(p.next - 3), String(p.next + 5)],
      correctAnswer: 0,
      difficulty,
      timeLimit: baseTime,
      hiddenLogic: `Заңдылық: ${p.hint}`,
    }
  }
}

export function generateLogicChallengeQuestion(grade: number): GameQuestion {
  const challenges = [
    {
      prompt: '🧩 ЧЕЛЛЕНДЖ: 1, 4, 9, 16, 25, ? — келесі санды тап!',
      options: ['30', '36', '35', '40'],
      correct: 1,
      hint: 'Квадраттар: 1², 2², 3²...',
    },
    {
      prompt: '🧩 ЧЕЛЛЕНДЖ: A=1, B=2, C=3... CAT сөзінің қосындысы?',
      options: ['24', '21', '27', '30'],
      correct: 0,
      hint: 'C=3, A=1, T=20',
    },
    {
      prompt: '🧩 ЧЕЛЛЕНДЖ: 🔴+🔵=10, 🔴-🔵=4. 🔴=?',
      options: ['6', '7', '8', '5'],
      correct: 1,
      hint: 'Теңдеулер жүйесі',
    },
  ]
  const c = challenges[Math.floor(Math.random() * challenges.length)]
  
  return {
    id: 'logic_challenge',
    prompt: c.prompt,
    options: c.options,
    correctAnswer: c.correct,
    difficulty: 'hard',
    isChallenge: true,
    timeLimit: 30,
    hiddenLogic: c.hint,
  }
}

// Mental Math Questions
export function generateMentalMathQuestions(
  grade: number,
  difficulty: DifficultyLevel,
  count: number
): GameQuestion[] {
  const questions: GameQuestion[] = []
  
  for (let i = 0; i < count; i++) {
    const question = createMathQuestion(grade, difficulty, i)
    questions.push(question)
  }
  
  return questions
}

function createMathQuestion(grade: number, difficulty: DifficultyLevel, index: number): GameQuestion {
  const baseTime = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 10 : 7
  
  if (difficulty === 'easy') {
    const a = Math.floor(Math.random() * 10) + 1
    const b = Math.floor(Math.random() * 10) + 1
    const ops = ['+', '-']
    const op = ops[index % 2]
    const result = op === '+' ? a + b : Math.max(a, b) - Math.min(a, b)
    const num1 = op === '-' ? Math.max(a, b) : a
    const num2 = op === '-' ? Math.min(a, b) : b
    
    return {
      id: `math_${difficulty}_${index}`,
      prompt: `${num1} ${op} ${num2} = ?`,
      options: [String(result), String(result + 1), String(result - 1), String(result + 2)],
      correctAnswer: 0,
      difficulty,
      timeLimit: baseTime,
    }
  } else if (difficulty === 'medium') {
    const a = Math.floor(Math.random() * 20) + 10
    const b = Math.floor(Math.random() * 10) + 1
    const ops = ['+', '-', '×']
    const op = ops[index % 3]
    let result: number
    if (op === '+') result = a + b
    else if (op === '-') result = a - b
    else result = b * (Math.floor(Math.random() * 5) + 2)
    
    const displayOp = op === '×' ? '×' : op
    const num1 = op === '×' ? Math.floor(result / b) : a
    
    return {
      id: `math_${difficulty}_${index}`,
      prompt: op === '×' ? `${num1} × ${b} = ?` : `${a} ${displayOp} ${b} = ?`,
      options: [String(result), String(result + 2), String(result - 1), String(result + 3)],
      correctAnswer: 0,
      difficulty,
      timeLimit: baseTime,
    }
  } else {
    const questions = [
      { prompt: '25 × 4 = ?', answer: 100 },
      { prompt: '144 ÷ 12 = ?', answer: 12 },
      { prompt: '17 + 28 + 5 = ?', answer: 50 },
      { prompt: '100 - 37 = ?', answer: 63 },
      { prompt: '8 × 7 = ?', answer: 56 },
      { prompt: '15 × 6 = ?', answer: 90 },
      { prompt: '81 ÷ 9 = ?', answer: 9 },
      { prompt: '125 - 48 = ?', answer: 77 },
    ]
    const q = questions[index % questions.length]
    
    return {
      id: `math_${difficulty}_${index}`,
      prompt: q.prompt,
      options: [String(q.answer), String(q.answer + 1), String(q.answer - 2), String(q.answer + 3)],
      correctAnswer: 0,
      difficulty,
      timeLimit: baseTime,
    }
  }
}

export function generateMathChallengeQuestion(grade: number): GameQuestion {
  const challenges = [
    {
      prompt: '🔥 ЧЕЛЛЕНДЖ: (5 + 3) × (10 - 6) = ?',
      options: ['32', '28', '36', '24'],
      correct: 0,
    },
    {
      prompt: '🔥 ЧЕЛЛЕНДЖ: 1+2+3+4+5+6+7+8+9+10 = ?',
      options: ['50', '55', '45', '60'],
      correct: 1,
    },
    {
      prompt: '🔥 ЧЕЛЛЕНДЖ: 99 + 99 + 99 = ?',
      options: ['297', '299', '296', '300'],
      correct: 0,
    },
  ]
  const c = challenges[Math.floor(Math.random() * challenges.length)]
  
  return {
    id: 'math_challenge',
    prompt: c.prompt,
    options: c.options,
    correctAnswer: c.correct,
    difficulty: 'hard',
    isChallenge: true,
    timeLimit: 25,
  }
}

// Flash Memory Questions
export function generateFlashMemoryQuestions(
  grade: number,
  difficulty: DifficultyLevel,
  count: number
): GameQuestion[] {
  const questions: GameQuestion[] = []
  
  for (let i = 0; i < count; i++) {
    const question = createMemoryQuestion(grade, difficulty, i)
    questions.push(question)
  }
  
  return questions
}

function createMemoryQuestion(grade: number, difficulty: DifficultyLevel, index: number): GameQuestion {
  const baseTime = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 15 : 12
  
  if (difficulty === 'easy') {
    const length = 4
    const numbers = Array.from({ length }, () => Math.floor(Math.random() * 10))
    const sequence = numbers.join(' ')
    
    return {
      id: `memory_${difficulty}_${index}`,
      prompt: `Санды есте сақта: ${sequence}\n\n🔒 Келесі санды тап: ${numbers.slice(0, -1).join(' ')} ?`,
      options: [String(numbers[length - 1]), String((numbers[length - 1] + 1) % 10), String((numbers[length - 1] + 2) % 10), String((numbers[length - 1] + 3) % 10)],
      correctAnswer: 0,
      difficulty,
      timeLimit: baseTime,
    }
  } else if (difficulty === 'medium') {
    const length = 5
    const numbers = Array.from({ length }, () => Math.floor(Math.random() * 10))
    const sequence = numbers.join(' ')
    const hiddenIndex = Math.floor(Math.random() * length)
    const hiddenNum = numbers[hiddenIndex]
    const displaySeq = numbers.map((n, i) => i === hiddenIndex ? '?' : n).join(' ')
    
    return {
      id: `memory_${difficulty}_${index}`,
      prompt: `Санды есте сақта: ${sequence}\n\n🔒 Жасырын санды тап: ${displaySeq}`,
      options: [String(hiddenNum), String((hiddenNum + 1) % 10), String((hiddenNum + 2) % 10), String((hiddenNum + 3) % 10)],
      correctAnswer: 0,
      difficulty,
      timeLimit: baseTime,
    }
  } else {
    const length = 6
    const numbers = Array.from({ length }, () => Math.floor(Math.random() * 10))
    const sequence = numbers.join(' ')
    const reversed = [...numbers].reverse()
    
    return {
      id: `memory_${difficulty}_${index}`,
      prompt: `Санды есте сақта: ${sequence}\n\n🔒 Кері ретпен бірінші сан қандай?`,
      options: [String(reversed[0]), String(numbers[0]), String(reversed[1]), String(numbers[1])],
      correctAnswer: 0,
      difficulty,
      timeLimit: baseTime,
    }
  }
}

export function generateMemoryChallengeQuestion(): GameQuestion {
  const colors = ['🔴', '🔵', '🟢', '🟡', '🟣']
  const shuffled = [...colors].sort(() => Math.random() - 0.5)
  const sequence = shuffled.slice(0, 4).join(' ')
  const missing = shuffled[2]
  
  return {
    id: 'memory_challenge',
    prompt: `🌟 ЧЕЛЛЕНДЖ: Түстерді есте сақта: ${sequence}\n\n🔒 3-ші түс қандай болды?`,
    options: [missing, shuffled[0], shuffled[1], shuffled[3]],
    correctAnswer: 0,
    difficulty: 'hard',
    isChallenge: true,
    timeLimit: 20,
  }
}

// Generate progressive difficulty questions
export function generateProgressiveQuestions(
  generator: (grade: number, difficulty: DifficultyLevel, count: number) => GameQuestion[],
  grade: number,
  totalCount: number
): GameQuestion[] {
  const easyCount = Math.ceil(totalCount * 0.4)
  const mediumCount = Math.ceil(totalCount * 0.4)
  const hardCount = totalCount - easyCount - mediumCount
  
  const easy = generator(grade, 'easy', easyCount)
  const medium = generator(grade, 'medium', mediumCount)
  const hard = generator(grade, 'hard', hardCount)
  
  return [...easy, ...medium, ...hard]
}
