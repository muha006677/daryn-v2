/**
 * Question Bank
 * Comprehensive math question generator with 13 topics
 * Each question includes multiple choice options and explanations
 */

import type { Difficulty } from './adaptiveEngine'

export type Topic =
  | 'trigonometric_equations'    // Тригонометриялық теңдеулер
  | 'trigonometric_functions'    // Тригонометриялық функциялар
  | 'calculus'                   // Туынды және интеграл
  | 'quadratic_systems'          // Квадраттық теңдеулер және жүйелер
  | 'arithmetic_roots'           // Арифметикалық түбір
  | 'logarithms'                 // Логарифм
  | 'geometry'                   // Геометрия
  | 'statistics'                 // Статистика
  | 'functions'                  // Функциялар
  | 'logic_math'                 // Логикалық математика
  | 'word_problems'              // Мәтінді есептер
  | 'simple_equations'           // Қарапайым теңдеулер
  | 'basic_arithmetic'           // Қарапайым есептер

export interface Question {
  id: string
  topic: Topic
  difficulty: Difficulty
  statement: string
  options: [string, string, string, string]
  correctIndex: number // 0-3
  answer: number
  explanation: string
  baseTime: number
}

export const TOPIC_LABELS: Record<Topic, string> = {
  trigonometric_equations: 'Тригонометриялық теңдеулер',
  trigonometric_functions: 'Тригонометриялық функциялар',
  calculus: 'Туынды және интеграл',
  quadratic_systems: 'Квадраттық теңдеулер',
  arithmetic_roots: 'Арифметикалық түбір',
  logarithms: 'Логарифм',
  geometry: 'Геометрия',
  statistics: 'Статистика',
  functions: 'Функциялар',
  logic_math: 'Логикалық математика',
  word_problems: 'Мәтінді есептер',
  simple_equations: 'Қарапайым теңдеулер',
  basic_arithmetic: 'Қарапайым есептер',
}

export const ALL_TOPICS: Topic[] = Object.keys(TOPIC_LABELS) as Topic[]

const TOPIC_GENERATORS: Record<Topic, boolean> = {
  trigonometric_equations: true,
  trigonometric_functions: true,
  calculus: true,
  quadratic_systems: true,
  arithmetic_roots: true,
  logarithms: true,
  geometry: true,
  statistics: true,
  functions: true,
  logic_math: true,
  word_problems: true,
  simple_equations: true,
  basic_arithmetic: true,
}

export function getAvailableTopics(): Topic[] {
  return Array.from(
    new Set(
      Object.entries(TOPIC_GENERATORS)
        .filter(([, hasGenerator]) => hasGenerator)
        .map(([topic]) => topic as Topic)
    )
  )
}

export function getTopicLabel(topic: Topic): string {
  return TOPIC_LABELS[topic] || topic
}

function getBaseTime(difficulty: Difficulty): number {
  const baseTimes: Record<Difficulty, number> = {
    1: 60, 2: 55, 3: 50, 4: 45, 5: 40,
    6: 35, 7: 30, 8: 25, 9: 20, 10: 15,
  }
  return baseTimes[difficulty]
}

function generateId(): string {
  return `q_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function createOptions(correct: number, generateWrong: () => number[]): [string, string, string, string, number] {
  const wrongs = generateWrong().filter(w => w !== correct).slice(0, 3)
  while (wrongs.length < 3) {
    const w = correct + randInt(-5, 5)
    if (w !== correct && !wrongs.includes(w)) wrongs.push(w)
  }
  const allOptions = [correct, ...wrongs]
  const shuffled = shuffle(allOptions)
  const correctIndex = shuffled.indexOf(correct)
  return [
    shuffled[0].toString(),
    shuffled[1].toString(),
    shuffled[2].toString(),
    shuffled[3].toString(),
    correctIndex,
  ]
}

// ============ TOPIC GENERATORS ============

// 1. Тригонометриялық теңдеулер
function generateTrigonometricEquations(d: Difficulty): Omit<Question, 'id' | 'baseTime'> {
  let statement: string, answer: number, explanation: string

  if (d <= 2) {
    // sin x = 0, cos x = 1
    const type = randInt(0, 1)
    if (type === 0) {
      statement = 'sin x = 0 теңдеуінің [0; 2π] аралығындағы шешімдер саны'
      answer = 3
      explanation = 'sin x = 0 болғанда x = 0, π, 2π. Барлығы 3 шешім.'
    } else {
      statement = 'cos x = 1 теңдеуінің [0; 2π] аралығындағы шешімдер саны'
      answer = 2
      explanation = 'cos x = 1 болғанда x = 0, 2π. Барлығы 2 шешім.'
    }
  } else if (d <= 4) {
    // sin x = 1/2, cos x = √2/2
    const type = randInt(0, 1)
    if (type === 0) {
      statement = 'sin x = 1/2 теңдеуінің [0; 2π] аралығындағы шешімдер саны'
      answer = 2
      explanation = 'sin x = 1/2 болғанда x = π/6 және x = 5π/6. Барлығы 2 шешім.'
    } else {
      statement = 'cos x = 0 теңдеуінің [0; 2π] аралығындағы шешімдер саны'
      answer = 2
      explanation = 'cos x = 0 болғанда x = π/2 және x = 3π/2. Барлығы 2 шешім.'
    }
  } else if (d <= 6) {
    // 2sin x - 1 = 0
    const a = randInt(2, 4)
    statement = `${a}sin x = ${a / 2} теңдеуінің [0; 2π] аралығындағы шешімдер саны`
    answer = 2
    explanation = `sin x = 1/2 теңдеуіне келтіріледі. x = π/6, 5π/6. Барлығы 2 шешім.`
  } else if (d <= 8) {
    // sin²x = 1/4
    statement = 'sin²x = 1/4 теңдеуінің [0; 2π] аралығындағы шешімдер саны'
    answer = 4
    explanation = 'sin x = ±1/2. Әр мән үшін 2 шешім, барлығы 4 шешім.'
  } else {
    // sin x · cos x = 0
    statement = 'sin x · cos x = 0 теңдеуінің [0; 2π] аралығындағы шешімдер саны'
    answer = 4
    explanation = 'sin x = 0 немесе cos x = 0. x = 0, π/2, π, 3π/2. Барлығы 4 шешім.'
  }

  const [opt0, opt1, opt2, opt3, correctIndex] = createOptions(answer, () => [answer - 1, answer + 1, answer + 2])
  return {
    topic: 'trigonometric_equations',
    difficulty: d,
    statement,
    options: [opt0, opt1, opt2, opt3],
    correctIndex,
    answer,
    explanation,
  }
}

// 2. Тригонометриялық функциялар
function generateTrigonometricFunctions(d: Difficulty): Omit<Question, 'id' | 'baseTime'> {
  let statement: string, answer: number, explanation: string

  if (d <= 2) {
    // sin 0, cos 0
    const type = randInt(0, 1)
    if (type === 0) {
      statement = 'sin 0° мәнін табыңыз'
      answer = 0
      explanation = 'sin 0° = 0 анықтама бойынша.'
    } else {
      statement = 'cos 0° мәнін табыңыз'
      answer = 1
      explanation = 'cos 0° = 1 анықтама бойынша.'
    }
  } else if (d <= 4) {
    // sin 90, cos 90
    const type = randInt(0, 1)
    if (type === 0) {
      statement = 'sin 90° мәнін табыңыз'
      answer = 1
      explanation = 'sin 90° = 1 бірлік шеңбер бойынша.'
    } else {
      statement = 'cos 90° мәнін табыңыз'
      answer = 0
      explanation = 'cos 90° = 0 бірлік шеңбер бойынша.'
    }
  } else if (d <= 6) {
    // sin 30 = 1/2, written as fraction comparison
    statement = 'sin 30° қандай санға тең?'
    answer = 0.5
    explanation = 'sin 30° = 1/2 = 0.5'
    const [opt0, opt1, opt2, opt3, correctIndex] = createOptions(0.5, () => [0, 1, 0.25])
    return {
      topic: 'trigonometric_functions',
      difficulty: d,
      statement,
      options: [opt0, opt1, opt2, opt3],
      correctIndex,
      answer,
      explanation,
    }
  } else if (d <= 8) {
    // sin²x + cos²x
    statement = 'sin²45° + cos²45° мәнін табыңыз'
    answer = 1
    explanation = 'Негізгі тригонометриялық тепе-теңдік: sin²x + cos²x = 1'
  } else {
    // tan 45
    statement = 'tg 45° мәнін табыңыз'
    answer = 1
    explanation = 'tg 45° = sin 45° / cos 45° = 1'
  }

  const [opt0, opt1, opt2, opt3, correctIndex] = createOptions(answer, () => [answer - 1, answer + 1, 2])
  return {
    topic: 'trigonometric_functions',
    difficulty: d,
    statement,
    options: [opt0, opt1, opt2, opt3],
    correctIndex,
    answer,
    explanation,
  }
}

// 3. Туынды және интеграл
function generateCalculus(d: Difficulty): Omit<Question, 'id' | 'baseTime'> {
  let statement: string, answer: number, explanation: string

  if (d <= 2) {
    // f(x) = x², f'(x) = ?
    const n = randInt(2, 4)
    statement = `f(x) = x^${n} функциясының туындысындағы x дәрежесі қандай?`
    answer = n - 1
    explanation = `(x^${n})' = ${n}x^${n - 1}. Дәрежесі ${n - 1}.`
  } else if (d <= 4) {
    // f(x) = 3x², f'(x) коэффициенті
    const a = randInt(2, 5)
    statement = `f(x) = ${a}x² функциясының туындысындағы x коэффициенті қандай?`
    answer = a * 2
    explanation = `(${a}x²)' = ${a * 2}x. Коэффициент ${a * 2}.`
  } else if (d <= 6) {
    // f(x) = x³ + x, f'(1)
    statement = 'f(x) = x³ + x функциясы үшін f\'(1) мәнін табыңыз'
    answer = 4
    explanation = 'f\'(x) = 3x² + 1. f\'(1) = 3·1 + 1 = 4.'
  } else if (d <= 8) {
    // Интеграл ∫x dx
    statement = '∫2x dx интегралының нәтижесіндегі x² коэффициенті қандай?'
    answer = 1
    explanation = '∫2x dx = x² + C. Коэффициент 1.'
  } else {
    // f(x) = x⁴, f'(2)
    statement = 'f(x) = x⁴ функциясы үшін f\'(2) мәнін табыңыз'
    answer = 32
    explanation = 'f\'(x) = 4x³. f\'(2) = 4·8 = 32.'
  }

  const [opt0, opt1, opt2, opt3, correctIndex] = createOptions(answer, () => [answer - 2, answer + 2, answer * 2])
  return {
    topic: 'calculus',
    difficulty: d,
    statement,
    options: [opt0, opt1, opt2, opt3],
    correctIndex,
    answer,
    explanation,
  }
}

// 4. Квадраттық теңдеулер және жүйелер
function generateQuadraticSystems(d: Difficulty): Omit<Question, 'id' | 'baseTime'> {
  let statement: string, answer: number, explanation: string

  if (d <= 2) {
    // x² = 4
    const a = randInt(2, 5)
    const sq = a * a
    statement = `x² = ${sq} теңдеуінің оң шешімі`
    answer = a
    explanation = `x² = ${sq}, x = ±${a}. Оң шешім: ${a}.`
  } else if (d <= 4) {
    // x² - 5x + 6 = 0, түбірлер қосындысы
    const r1 = randInt(2, 5)
    const r2 = randInt(2, 5)
    const sum = r1 + r2
    const prod = r1 * r2
    statement = `x² - ${sum}x + ${prod} = 0 теңдеуінің түбірлер қосындысы`
    answer = sum
    explanation = `Виет теоремасы бойынша: x₁ + x₂ = ${sum}.`
  } else if (d <= 6) {
    // Түбірлер көбейтіндісі
    const r1 = randInt(2, 4)
    const r2 = randInt(2, 4)
    const sum = r1 + r2
    const prod = r1 * r2
    statement = `x² - ${sum}x + ${prod} = 0 теңдеуінің түбірлер көбейтіндісі`
    answer = prod
    explanation = `Виет теоремасы бойынша: x₁ · x₂ = ${prod}.`
  } else if (d <= 8) {
    // Дискриминант
    const a = 1
    const b = randInt(4, 8)
    const c = randInt(1, 5)
    const D = b * b - 4 * a * c
    statement = `x² - ${b}x + ${c} = 0 теңдеуінің дискриминанты`
    answer = D
    explanation = `D = b² - 4ac = ${b}² - 4·1·${c} = ${b * b} - ${4 * c} = ${D}.`
  } else {
    // Жүйе: x + y = 5, xy = 6
    const x = 2
    const y = 3
    statement = 'x + y = 5 және xy = 6 жүйесінің үлкен шешімі'
    answer = 3
    explanation = 'x және y — t² - 5t + 6 = 0 теңдеуінің түбірлері: 2 және 3. Үлкені 3.'
  }

  const [opt0, opt1, opt2, opt3, correctIndex] = createOptions(answer, () => [answer - 2, answer + 1, answer + 3])
  return {
    topic: 'quadratic_systems',
    difficulty: d,
    statement,
    options: [opt0, opt1, opt2, opt3],
    correctIndex,
    answer,
    explanation,
  }
}

// 5. Арифметикалық түбір
function generateArithmeticRoots(d: Difficulty): Omit<Question, 'id' | 'baseTime'> {
  let statement: string, answer: number, explanation: string

  if (d <= 2) {
    // √4, √9, √16
    const squares = [4, 9, 16, 25]
    const sq = squares[randInt(0, squares.length - 1)]
    answer = Math.sqrt(sq)
    statement = `√${sq} мәнін табыңыз`
    explanation = `√${sq} = ${answer}, себебі ${answer}² = ${sq}.`
  } else if (d <= 4) {
    // √36, √49, √64
    const squares = [36, 49, 64, 81, 100]
    const sq = squares[randInt(0, squares.length - 1)]
    answer = Math.sqrt(sq)
    statement = `√${sq} мәнін табыңыз`
    explanation = `√${sq} = ${answer}, себебі ${answer}² = ${sq}.`
  } else if (d <= 6) {
    // √a · √b = √(ab)
    const a = randInt(2, 5)
    const b = randInt(2, 5)
    const product = a * a * b * b
    answer = a * b
    statement = `√${a * a} · √${b * b} мәнін табыңыз`
    explanation = `√${a * a} · √${b * b} = ${a} · ${b} = ${a * b}.`
  } else if (d <= 8) {
    // ³√8, ³√27
    const cubes = [[8, 2], [27, 3], [64, 4]]
    const [cube, root] = cubes[randInt(0, cubes.length - 1)]
    answer = root
    statement = `³√${cube} мәнін табыңыз`
    explanation = `³√${cube} = ${root}, себебі ${root}³ = ${cube}.`
  } else {
    // √50 simplified
    statement = '√50 = a√2 түрінде жазғанда a мәні'
    answer = 5
    explanation = '√50 = √(25·2) = 5√2. Демек a = 5.'
  }

  const [opt0, opt1, opt2, opt3, correctIndex] = createOptions(answer, () => [answer - 1, answer + 1, answer + 2])
  return {
    topic: 'arithmetic_roots',
    difficulty: d,
    statement,
    options: [opt0, opt1, opt2, opt3],
    correctIndex,
    answer,
    explanation,
  }
}

// 6. Логарифм
function generateLogarithms(d: Difficulty): Omit<Question, 'id' | 'baseTime'> {
  let statement: string, answer: number, explanation: string

  if (d <= 2) {
    // log₁₀(10), log₂(2)
    const base = [2, 10][randInt(0, 1)]
    statement = `log${base === 10 ? '' : '₂'}(${base}) мәнін табыңыз`
    answer = 1
    explanation = `log_a(a) = 1 кез келген a > 0, a ≠ 1 үшін.`
  } else if (d <= 4) {
    // log₂(8), log₃(9)
    const bases = [[2, 8, 3], [2, 16, 4], [3, 9, 2], [3, 27, 3]]
    const [base, num, result] = bases[randInt(0, bases.length - 1)]
    answer = result
    statement = `log₂(${num}) мәнін табыңыз (егер табан 2 болса)`
    if (base === 2) {
      statement = `log₂(${num}) мәнін табыңыз`
      explanation = `log₂(${num}) = ${result}, себебі 2^${result} = ${num}.`
    } else {
      statement = `log₃(${num}) мәнін табыңыз`
      explanation = `log₃(${num}) = ${result}, себебі 3^${result} = ${num}.`
    }
  } else if (d <= 6) {
    // log₂(4) + log₂(2)
    statement = 'log₂(4) + log₂(2) мәнін табыңыз'
    answer = 3
    explanation = 'log₂(4) = 2, log₂(2) = 1. Қосындысы = 3.'
  } else if (d <= 8) {
    // log₁₀(100)
    statement = 'log₁₀(1000) мәнін табыңыз'
    answer = 3
    explanation = 'log₁₀(1000) = 3, себебі 10³ = 1000.'
  } else {
    // log_a(1) = 0
    statement = 'log₅(1) мәнін табыңыз'
    answer = 0
    explanation = 'log_a(1) = 0 кез келген a үшін, себебі a⁰ = 1.'
  }

  const [opt0, opt1, opt2, opt3, correctIndex] = createOptions(answer, () => [answer - 1, answer + 1, answer + 2])
  return {
    topic: 'logarithms',
    difficulty: d,
    statement,
    options: [opt0, opt1, opt2, opt3],
    correctIndex,
    answer,
    explanation,
  }
}

// 7. Геометрия
function generateGeometry(d: Difficulty): Omit<Question, 'id' | 'baseTime'> {
  let statement: string, answer: number, explanation: string

  if (d <= 2) {
    // Квадрат периметрі
    const side = randInt(3, 10)
    answer = side * 4
    statement = `Қабырғасы ${side} см квадраттың периметрі (см)`
    explanation = `P = 4a = 4 · ${side} = ${answer} см.`
  } else if (d <= 4) {
    // Тіктөртбұрыш ауданы
    const a = randInt(3, 8)
    const b = randInt(3, 8)
    answer = a * b
    statement = `${a} см × ${b} см тіктөртбұрыштың ауданы (см²)`
    explanation = `S = a · b = ${a} · ${b} = ${answer} см².`
  } else if (d <= 6) {
    // Үшбұрыш ауданы
    const base = randInt(4, 12) * 2
    const height = randInt(3, 8)
    answer = (base * height) / 2
    statement = `Табаны ${base} см, биіктігі ${height} см үшбұрыштың ауданы (см²)`
    explanation = `S = (a · h) / 2 = (${base} · ${height}) / 2 = ${answer} см².`
  } else if (d <= 8) {
    // Шеңбер ұзындығы (π ≈ 3.14 деп)
    const r = randInt(5, 10)
    answer = r * 2
    statement = `Радиусы ${r} см шеңбердің диаметрі (см)`
    explanation = `d = 2r = 2 · ${r} = ${answer} см.`
  } else {
    // Пифагор теоремасы
    const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10]]
    const [a, b, c] = triples[randInt(0, triples.length - 1)]
    answer = c
    statement = `Катеттері ${a} және ${b} болатын тікбұрышты үшбұрыштың гипотенузасы`
    explanation = `c = √(a² + b²) = √(${a * a} + ${b * b}) = √${a * a + b * b} = ${c}.`
  }

  const [opt0, opt1, opt2, opt3, correctIndex] = createOptions(answer, () => [answer - 2, answer + 2, answer + 5])
  return {
    topic: 'geometry',
    difficulty: d,
    statement,
    options: [opt0, opt1, opt2, opt3],
    correctIndex,
    answer,
    explanation,
  }
}

// 8. Статистика
function generateStatistics(d: Difficulty): Omit<Question, 'id' | 'baseTime'> {
  let statement: string, answer: number, explanation: string

  if (d <= 2) {
    // Орта арифметикалық
    const nums = [randInt(2, 8), randInt(2, 8), randInt(2, 8)]
    const sum = nums.reduce((a, b) => a + b, 0)
    answer = sum / 3
    if (sum % 3 !== 0) {
      const n1 = randInt(3, 6)
      const n2 = n1 + 3
      const n3 = n1 + 6
      answer = n1 + 3
      statement = `${n1}, ${n2}, ${n3} сандарының орта арифметикалығы`
      explanation = `(${n1} + ${n2} + ${n3}) / 3 = ${n1 + n2 + n3} / 3 = ${answer}.`
    } else {
      statement = `${nums[0]}, ${nums[1]}, ${nums[2]} сандарының орта арифметикалығы`
      explanation = `(${nums[0]} + ${nums[1]} + ${nums[2]}) / 3 = ${sum} / 3 = ${answer}.`
    }
  } else if (d <= 4) {
    // Медиана
    const nums = [randInt(1, 5), randInt(6, 10), randInt(11, 15)]
    nums.sort((a, b) => a - b)
    answer = nums[1]
    statement = `${nums[0]}, ${nums[1]}, ${nums[2]} сандарының медианасы`
    explanation = `Реттелген қатардың ортаңғы элементі: ${answer}.`
  } else if (d <= 6) {
    // Мода
    const base = randInt(2, 8)
    const nums = [base, base, base + 2, base + 4]
    answer = base
    statement = `${nums.join(', ')} сандарының модасы`
    explanation = `Ең көп кездесетін сан: ${base} (2 рет).`
  } else if (d <= 8) {
    // Ауқым (range)
    const min = randInt(3, 10)
    const max = min + randInt(5, 15)
    answer = max - min
    statement = `${min}, ${min + 2}, ${min + 5}, ${max} сандарының ауқымы`
    explanation = `Ауқым = max - min = ${max} - ${min} = ${answer}.`
  } else {
    // 5 санның ортасы
    const n = randInt(10, 20)
    const sum = n * 5
    answer = n
    statement = `5 санның қосындысы ${sum}. Олардың орта арифметикалығы қандай?`
    explanation = `Орта = ${sum} / 5 = ${answer}.`
  }

  const [opt0, opt1, opt2, opt3, correctIndex] = createOptions(answer, () => [answer - 1, answer + 1, answer + 3])
  return {
    topic: 'statistics',
    difficulty: d,
    statement,
    options: [opt0, opt1, opt2, opt3],
    correctIndex,
    answer,
    explanation,
  }
}

// 9. Функциялар
function generateFunctions(d: Difficulty): Omit<Question, 'id' | 'baseTime'> {
  let statement: string, answer: number, explanation: string

  if (d <= 2) {
    // f(x) = x + a, f(2)
    const a = randInt(1, 5)
    answer = 2 + a
    statement = `f(x) = x + ${a} функциясы үшін f(2) мәнін табыңыз`
    explanation = `f(2) = 2 + ${a} = ${answer}.`
  } else if (d <= 4) {
    // f(x) = 2x, f(5)
    const a = randInt(2, 4)
    const x = randInt(3, 6)
    answer = a * x
    statement = `f(x) = ${a}x функциясы үшін f(${x}) мәнін табыңыз`
    explanation = `f(${x}) = ${a} · ${x} = ${answer}.`
  } else if (d <= 6) {
    // f(x) = x², f(3)
    const x = randInt(2, 5)
    answer = x * x
    statement = `f(x) = x² функциясы үшін f(${x}) мәнін табыңыз`
    explanation = `f(${x}) = ${x}² = ${answer}.`
  } else if (d <= 8) {
    // f(x) = 2x + 3, f(4)
    const a = randInt(2, 4)
    const b = randInt(2, 5)
    const x = randInt(2, 5)
    answer = a * x + b
    statement = `f(x) = ${a}x + ${b} функциясы үшін f(${x}) мәнін табыңыз`
    explanation = `f(${x}) = ${a} · ${x} + ${b} = ${a * x} + ${b} = ${answer}.`
  } else {
    // f(g(x))
    const x = 2
    answer = 10
    statement = 'f(x) = 2x, g(x) = x + 3. f(g(2)) мәнін табыңыз'
    explanation = 'g(2) = 2 + 3 = 5. f(5) = 2 · 5 = 10.'
  }

  const [opt0, opt1, opt2, opt3, correctIndex] = createOptions(answer, () => [answer - 2, answer + 2, answer + 4])
  return {
    topic: 'functions',
    difficulty: d,
    statement,
    options: [opt0, opt1, opt2, opt3],
    correctIndex,
    answer,
    explanation,
  }
}

// 10. Логикалық математика
function generateLogicMath(d: Difficulty): Omit<Question, 'id' | 'baseTime'> {
  let statement: string, answer: number, explanation: string

  if (d <= 2) {
    // Заңдылықты тап: 2, 4, 6, ?
    const start = randInt(1, 3) * 2
    const pattern = [start, start + 2, start + 4]
    answer = start + 6
    statement = `${pattern.join(', ')}, ? — келесі сан қандай?`
    explanation = `Әр қадамда +2 қосылады. ${pattern[2]} + 2 = ${answer}.`
  } else if (d <= 4) {
    // 1, 4, 9, 16, ?
    statement = '1, 4, 9, 16, ? — келесі сан қандай?'
    answer = 25
    explanation = 'Бұл толық квадраттар: 1², 2², 3², 4², 5² = 25.'
  } else if (d <= 6) {
    // 2, 6, 12, 20, ?
    statement = '2, 6, 12, 20, ? — келесі сан қандай?'
    answer = 30
    explanation = 'n(n+1) формуласы: 1·2, 2·3, 3·4, 4·5, 5·6 = 30.'
  } else if (d <= 8) {
    // Fibonacci: 1, 1, 2, 3, 5, ?
    statement = '1, 1, 2, 3, 5, ? — келесі сан қандай?'
    answer = 8
    explanation = 'Фибоначчи тізбегі: келесі = алдыңғы екеуінің қосындысы. 3 + 5 = 8.'
  } else {
    // 3, 6, 11, 18, ?
    statement = '3, 6, 11, 18, ? — келесі сан қандай?'
    answer = 27
    explanation = 'Айырмалар: +3, +5, +7, +9. Келесі: 18 + 9 = 27.'
  }

  const [opt0, opt1, opt2, opt3, correctIndex] = createOptions(answer, () => [answer - 2, answer + 1, answer + 3])
  return {
    topic: 'logic_math',
    difficulty: d,
    statement,
    options: [opt0, opt1, opt2, opt3],
    correctIndex,
    answer,
    explanation,
  }
}

// 11. Мәтінді есептер
function generateWordProblems(d: Difficulty): Omit<Question, 'id' | 'baseTime'> {
  let statement: string, answer: number, explanation: string

  if (d <= 2) {
    // Базарда алма
    const apples = randInt(3, 8)
    const oranges = randInt(2, 5)
    answer = apples + oranges
    statement = `Айгүлде ${apples} алма және ${oranges} апельсин бар. Барлығы неше жеміс?`
    explanation = `${apples} + ${oranges} = ${answer} жеміс.`
  } else if (d <= 4) {
    // Жасы
    const age = randInt(10, 15)
    const diff = randInt(3, 6)
    answer = age + diff
    statement = `Арман ${age} жаста. Ағасы одан ${diff} жас үлкен. Ағасы неше жаста?`
    explanation = `${age} + ${diff} = ${answer} жас.`
  } else if (d <= 6) {
    // Бағасы
    const price = randInt(100, 200)
    const qty = randInt(2, 5)
    answer = price * qty
    statement = `Бір кітаптың бағасы ${price} тг. ${qty} кітаптың жалпы бағасы қандай?`
    explanation = `${price} × ${qty} = ${answer} тг.`
  } else if (d <= 8) {
    // Жылдамдық
    const speed = randInt(40, 80)
    const time = randInt(2, 4)
    answer = speed * time
    statement = `Көлік сағатына ${speed} км жылдамдықпен ${time} сағат жүрді. Жүрген жолы қанша км?`
    explanation = `S = v · t = ${speed} · ${time} = ${answer} км.`
  } else {
    // Жұмыс
    const total = randInt(30, 60)
    const done = randInt(10, total - 10)
    answer = total - done
    statement = `${total} есептің ${done}-і шешілді. Қанша есеп қалды?`
    explanation = `${total} - ${done} = ${answer} есеп қалды.`
  }

  const [opt0, opt1, opt2, opt3, correctIndex] = createOptions(answer, () => [answer - 3, answer + 2, answer + 5])
  return {
    topic: 'word_problems',
    difficulty: d,
    statement,
    options: [opt0, opt1, opt2, opt3],
    correctIndex,
    answer,
    explanation,
  }
}

// 12. Қарапайым теңдеулер
function generateSimpleEquations(d: Difficulty): Omit<Question, 'id' | 'baseTime'> {
  let statement: string, answer: number, explanation: string

  if (d <= 2) {
    // x + a = b
    const x = randInt(2, 10)
    const a = randInt(1, 8)
    const b = x + a
    answer = x
    statement = `x + ${a} = ${b} теңдеуін шешіңіз`
    explanation = `x = ${b} - ${a} = ${answer}.`
  } else if (d <= 4) {
    // x - a = b
    const x = randInt(10, 20)
    const a = randInt(3, 8)
    const b = x - a
    answer = x
    statement = `x - ${a} = ${b} теңдеуін шешіңіз`
    explanation = `x = ${b} + ${a} = ${answer}.`
  } else if (d <= 6) {
    // ax = b
    const x = randInt(2, 10)
    const a = randInt(2, 6)
    const b = a * x
    answer = x
    statement = `${a}x = ${b} теңдеуін шешіңіз`
    explanation = `x = ${b} ÷ ${a} = ${answer}.`
  } else if (d <= 8) {
    // x / a = b
    const x = randInt(2, 8) * randInt(2, 5)
    const a = randInt(2, 5)
    const b = x / a
    if (x % a !== 0) {
      const newX = a * randInt(3, 8)
      const newB = newX / a
      answer = newX
      statement = `x ÷ ${a} = ${newB} теңдеуін шешіңіз`
      explanation = `x = ${newB} × ${a} = ${answer}.`
    } else {
      answer = x
      statement = `x ÷ ${a} = ${b} теңдеуін шешіңіз`
      explanation = `x = ${b} × ${a} = ${answer}.`
    }
  } else {
    // ax + b = c
    const x = randInt(2, 8)
    const a = randInt(2, 5)
    const b = randInt(3, 10)
    const c = a * x + b
    answer = x
    statement = `${a}x + ${b} = ${c} теңдеуін шешіңіз`
    explanation = `${a}x = ${c} - ${b} = ${c - b}. x = ${(c - b) / a} = ${answer}.`
  }

  const [opt0, opt1, opt2, opt3, correctIndex] = createOptions(answer, () => [answer - 2, answer + 1, answer + 3])
  return {
    topic: 'simple_equations',
    difficulty: d,
    statement,
    options: [opt0, opt1, opt2, opt3],
    correctIndex,
    answer,
    explanation,
  }
}

// 13. Қарапайым есептер
function generateBasicArithmetic(d: Difficulty): Omit<Question, 'id' | 'baseTime'> {
  let statement: string, answer: number, explanation: string

  if (d <= 2) {
    // Қосу
    const a = randInt(1, 10)
    const b = randInt(1, 10)
    answer = a + b
    statement = `${a} + ${b} = ?`
    explanation = `${a} + ${b} = ${answer}.`
  } else if (d <= 4) {
    // Азайту
    const a = randInt(10, 30)
    const b = randInt(1, a - 1)
    answer = a - b
    statement = `${a} - ${b} = ?`
    explanation = `${a} - ${b} = ${answer}.`
  } else if (d <= 6) {
    // Көбейту
    const a = randInt(2, 9)
    const b = randInt(2, 9)
    answer = a * b
    statement = `${a} × ${b} = ?`
    explanation = `${a} × ${b} = ${answer}.`
  } else if (d <= 8) {
    // Бөлу
    const b = randInt(2, 9)
    const answer_val = randInt(2, 10)
    const a = b * answer_val
    answer = answer_val
    statement = `${a} ÷ ${b} = ?`
    explanation = `${a} ÷ ${b} = ${answer}.`
  } else {
    // Аралас
    const a = randInt(10, 20)
    const b = randInt(2, 5)
    const c = randInt(5, 15)
    answer = a * b - c
    statement = `${a} × ${b} - ${c} = ?`
    explanation = `${a} × ${b} = ${a * b}. ${a * b} - ${c} = ${answer}.`
  }

  const [opt0, opt1, opt2, opt3, correctIndex] = createOptions(answer, () => [answer - 2, answer + 1, answer + 3])
  return {
    topic: 'basic_arithmetic',
    difficulty: d,
    statement,
    options: [opt0, opt1, opt2, opt3],
    correctIndex,
    answer,
    explanation,
  }
}

// ============ MAIN EXPORT ============

const topicGenerators: Record<Topic, (d: Difficulty) => Omit<Question, 'id' | 'baseTime'>> = {
  trigonometric_equations: generateTrigonometricEquations,
  trigonometric_functions: generateTrigonometricFunctions,
  calculus: generateCalculus,
  quadratic_systems: generateQuadraticSystems,
  arithmetic_roots: generateArithmeticRoots,
  logarithms: generateLogarithms,
  geometry: generateGeometry,
  statistics: generateStatistics,
  functions: generateFunctions,
  logic_math: generateLogicMath,
  word_problems: generateWordProblems,
  simple_equations: generateSimpleEquations,
  basic_arithmetic: generateBasicArithmetic,
}

export function getQuestionByDifficulty(
  difficulty: Difficulty,
  topics: Topic[] = ALL_TOPICS
): Question {
  const topic = topics[randInt(0, topics.length - 1)]
  const generator = topicGenerators[topic]
  const questionData = generator(difficulty)
  const baseTime = getBaseTime(difficulty)

  return {
    id: generateId(),
    baseTime,
    ...questionData,
  }
}

export function validateAnswer(question: Question, userAnswer: number): boolean {
  return Math.abs(question.answer - userAnswer) < 0.01
}

export function validateAnswerByIndex(question: Question, selectedIndex: number): boolean {
  return selectedIndex === question.correctIndex
}
