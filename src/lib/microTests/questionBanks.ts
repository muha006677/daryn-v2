// Micro Tests - Question Banks

import type { MicroTestQuestion, MicroTestType } from './types'

// Logical Reaction Test - Pattern recognition and quick logical thinking
const logicalReactionQuestions: MicroTestQuestion[] = [
  {
    id: 'lr_1',
    prompt: 'Тізбекті жалғастырыңыз: 2, 4, 8, 16, ...',
    options: ['24', '32', '20', '30'],
    correctAnswer: 1,
    explanation: 'Әр сан 2-ге көбейтіледі: 16 × 2 = 32',
    difficulty: 3,
    timeLimit: 20,
  },
  {
    id: 'lr_2',
    prompt: 'Тізбекті жалғастырыңыз: 1, 1, 2, 3, 5, 8, ...',
    options: ['11', '13', '10', '12'],
    correctAnswer: 1,
    explanation: 'Фибоначчи тізбегі: 5 + 8 = 13',
    difficulty: 4,
    timeLimit: 25,
  },
  {
    id: 'lr_3',
    prompt: 'A = 1, B = 2, C = 3... болса, CAT = ?',
    options: ['24', '27', '21', '30'],
    correctAnswer: 0,
    explanation: 'C=3, A=1, T=20. 3+1+20 = 24',
    difficulty: 4,
    timeLimit: 30,
  },
  {
    id: 'lr_4',
    prompt: 'Қай сан артық? 2, 5, 8, 11, 15, 17',
    options: ['2', '5', '15', '17'],
    correctAnswer: 2,
    explanation: 'Тізбек +3 қадаммен: 2, 5, 8, 11, 14, 17. 15 артық.',
    difficulty: 5,
    timeLimit: 25,
  },
  {
    id: 'lr_5',
    prompt: 'Егер ○ = 2, △ = 3 болса, ○ + △ × ○ = ?',
    options: ['8', '10', '12', '6'],
    correctAnswer: 0,
    explanation: '2 + 3 × 2 = 2 + 6 = 8',
    difficulty: 3,
    timeLimit: 20,
  },
  {
    id: 'lr_6',
    prompt: '12 : 4 = 15 : ?',
    options: ['3', '5', '4', '6'],
    correctAnswer: 1,
    explanation: '12 ÷ 4 = 3, сондықтан 15 ÷ ? = 3, ? = 5',
    difficulty: 4,
    timeLimit: 25,
  },
  {
    id: 'lr_7',
    prompt: 'Заңдылықты табыңыз: AB, CD, EF, ...',
    options: ['FG', 'GH', 'HI', 'IJ'],
    correctAnswer: 1,
    explanation: 'Қатар әріптер жұптары: AB, CD, EF, GH',
    difficulty: 3,
    timeLimit: 20,
  },
  {
    id: 'lr_8',
    prompt: '3² + 4² = ?',
    options: ['25', '49', '12', '7'],
    correctAnswer: 0,
    explanation: '9 + 16 = 25',
    difficulty: 3,
    timeLimit: 20,
  },
  {
    id: 'lr_9',
    prompt: 'Келесі санды табыңыз: 100, 81, 64, 49, ...',
    options: ['36', '25', '30', '40'],
    correctAnswer: 0,
    explanation: '10², 9², 8², 7², 6² = 36',
    difficulty: 5,
    timeLimit: 30,
  },
  {
    id: 'lr_10',
    prompt: 'Егер барлық А - В, және барлық В - С болса, онда:',
    options: ['Барлық А - С', 'Кейбір А - С', 'А мен С байланыссыз', 'С - А'],
    correctAnswer: 0,
    explanation: 'Транзитивтілік: А → В → С, демек А → С',
    difficulty: 5,
    timeLimit: 25,
  },
]

// Calculation Accuracy Test
const calculationAccuracyQuestions: MicroTestQuestion[] = [
  {
    id: 'ca_1',
    prompt: '47 + 38 = ?',
    options: ['85', '75', '95', '84'],
    correctAnswer: 0,
    explanation: '47 + 38 = 85',
    difficulty: 2,
    timeLimit: 15,
  },
  {
    id: 'ca_2',
    prompt: '156 - 89 = ?',
    options: ['67', '77', '57', '87'],
    correctAnswer: 0,
    explanation: '156 - 89 = 67',
    difficulty: 3,
    timeLimit: 20,
  },
  {
    id: 'ca_3',
    prompt: '12 × 15 = ?',
    options: ['180', '170', '190', '175'],
    correctAnswer: 0,
    explanation: '12 × 15 = 180',
    difficulty: 3,
    timeLimit: 20,
  },
  {
    id: 'ca_4',
    prompt: '144 ÷ 12 = ?',
    options: ['12', '14', '11', '13'],
    correctAnswer: 0,
    explanation: '144 ÷ 12 = 12',
    difficulty: 3,
    timeLimit: 15,
  },
  {
    id: 'ca_5',
    prompt: '25% of 80 = ?',
    options: ['20', '25', '15', '30'],
    correctAnswer: 0,
    explanation: '80 × 0.25 = 20',
    difficulty: 4,
    timeLimit: 25,
  },
  {
    id: 'ca_6',
    prompt: '√121 = ?',
    options: ['11', '12', '10', '13'],
    correctAnswer: 0,
    explanation: '11 × 11 = 121',
    difficulty: 3,
    timeLimit: 15,
  },
  {
    id: 'ca_7',
    prompt: '3.5 × 4 = ?',
    options: ['14', '12', '15', '13.5'],
    correctAnswer: 0,
    explanation: '3.5 × 4 = 14',
    difficulty: 3,
    timeLimit: 20,
  },
  {
    id: 'ca_8',
    prompt: '1000 - 247 = ?',
    options: ['753', '763', '743', '853'],
    correctAnswer: 0,
    explanation: '1000 - 247 = 753',
    difficulty: 3,
    timeLimit: 20,
  },
  {
    id: 'ca_9',
    prompt: '2³ + 3² = ?',
    options: ['17', '15', '13', '19'],
    correctAnswer: 0,
    explanation: '8 + 9 = 17',
    difficulty: 4,
    timeLimit: 20,
  },
  {
    id: 'ca_10',
    prompt: '7 × 8 + 6 × 9 = ?',
    options: ['110', '100', '120', '105'],
    correctAnswer: 0,
    explanation: '56 + 54 = 110',
    difficulty: 4,
    timeLimit: 25,
  },
]

// Pressure Decision Test - Quick decisions under time pressure
const pressureDecisionQuestions: MicroTestQuestion[] = [
  {
    id: 'pd_1',
    prompt: 'Оқушы 50 минутта 10 есеп шығарады. 5 есепке қанша минут керек?',
    options: ['25 минут', '30 минут', '20 минут', '15 минут'],
    correctAnswer: 0,
    explanation: '50 ÷ 10 × 5 = 25 минут',
    difficulty: 3,
    timeLimit: 30,
  },
  {
    id: 'pd_2',
    prompt: '3 жұмысшы 6 күнде жұмысты бітіреді. 6 жұмысшы қанша күнде бітіреді?',
    options: ['3 күн', '12 күн', '2 күн', '4 күн'],
    correctAnswer: 0,
    explanation: 'Жұмысшы саны 2 есе артса, уақыт 2 есе кемиді: 6 ÷ 2 = 3',
    difficulty: 4,
    timeLimit: 35,
  },
  {
    id: 'pd_3',
    prompt: 'Автобус А-дан В-ға 4 сағатта, В-дан А-ға 3 сағатта барады. Орташа жылдамдық?',
    options: ['Есептеуге деректер жетіспейді', '100 км/сағ', '80 км/сағ', '70 км/сағ'],
    correctAnswer: 0,
    explanation: 'Қашықтық белгісіз, орташа жылдамдықты есептеу мүмкін емес.',
    difficulty: 6,
    timeLimit: 40,
  },
  {
    id: 'pd_4',
    prompt: 'Қай жауап ҚАТЕ? 8 × 7 = 56, 9 × 6 = 54, 7 × 9 = 62, 6 × 8 = 48',
    options: ['8 × 7 = 56', '9 × 6 = 54', '7 × 9 = 62', '6 × 8 = 48'],
    correctAnswer: 2,
    explanation: '7 × 9 = 63, 62 емес',
    difficulty: 3,
    timeLimit: 25,
  },
  {
    id: 'pd_5',
    prompt: 'Уақыт 15:45. 2 сағат 30 минуттан кейін қанша болады?',
    options: ['18:15', '17:15', '18:45', '17:45'],
    correctAnswer: 0,
    explanation: '15:45 + 2:30 = 18:15',
    difficulty: 3,
    timeLimit: 25,
  },
  {
    id: 'pd_6',
    prompt: 'Дүкенде 20% жеңілдік. Бағасы 5000 теңге болса, қанша төлейсіз?',
    options: ['4000 теңге', '4500 теңге', '3500 теңге', '4200 теңге'],
    correctAnswer: 0,
    explanation: '5000 × 0.8 = 4000 теңге',
    difficulty: 4,
    timeLimit: 30,
  },
  {
    id: 'pd_7',
    prompt: 'Қай тұжырым дұрыс? A: 1/2 > 1/3, B: 0.4 > 0.5, C: -3 > -2',
    options: ['Тек A', 'Тек B', 'Тек C', 'A және B'],
    correctAnswer: 0,
    explanation: '1/2 = 0.5, 1/3 ≈ 0.33. 0.5 > 0.33, демек тек A дұрыс.',
    difficulty: 4,
    timeLimit: 35,
  },
  {
    id: 'pd_8',
    prompt: 'x + y = 10, x - y = 4 болса, x = ?',
    options: ['7', '6', '8', '5'],
    correctAnswer: 0,
    explanation: 'Қосу: 2x = 14, x = 7',
    difficulty: 4,
    timeLimit: 30,
  },
]

// Text Analysis Test
const textAnalysisQuestions: MicroTestQuestion[] = [
  {
    id: 'ta_1',
    prompt: '"Күн батқан соң, түн түсті. Жұлдыздар жарқырады." Мәтіннің негізгі ойы:',
    options: ['Түннің келуі', 'Күннің батуы', 'Жұлдыздардың сұлулығы', 'Уақыттың өтуі'],
    correctAnswer: 0,
    explanation: 'Мәтін түннің келуін суреттейді.',
    difficulty: 3,
    timeLimit: 40,
  },
  {
    id: 'ta_2',
    prompt: '"Адам білімді болса, ол кедейліктен қорықпайды." Бұл сөздің мағынасы:',
    options: ['Білім — байлық', 'Кедейлік — жаман', 'Білім — қуат', 'Адам — мықты'],
    correctAnswer: 0,
    explanation: 'Білім адамға байлық сияқты қорғаныш береді.',
    difficulty: 4,
    timeLimit: 45,
  },
  {
    id: 'ta_3',
    prompt: '"Оқу — білім бұлағы, білім — өмір шырағы." Бұл сөзден шығатын қорытынды:',
    options: ['Оқу маңызды', 'Шырақ керек', 'Бұлақ таза', 'Өмір қиын'],
    correctAnswer: 0,
    explanation: 'Оқу мен білімнің өмірге қаншалықты маңызды екендігі айтылған.',
    difficulty: 3,
    timeLimit: 40,
  },
  {
    id: 'ta_4',
    prompt: '"Жаңбыр жауғандықтан, біз үйде қалдық." Себеп-салдар байланысы қандай?',
    options: ['Жаңбыр → үйде қалу', 'Үйде қалу → жаңбыр', 'Байланыс жоқ', 'Кездейсоқ'],
    correctAnswer: 0,
    explanation: 'Жаңбыр — себеп, үйде қалу — салдар.',
    difficulty: 3,
    timeLimit: 35,
  },
  {
    id: 'ta_5',
    prompt: '"Барлық құстар ұшады. Қарлығаш — құс." Демек:',
    options: ['Қарлығаш ұшады', 'Қарлығаш ұшпайды', 'Кейбір құстар ұшады', 'Белгісіз'],
    correctAnswer: 0,
    explanation: 'Логикалық силлогизм: барлық құс ұшады + қарлығаш құс = қарлығаш ұшады.',
    difficulty: 4,
    timeLimit: 35,
  },
  {
    id: 'ta_6',
    prompt: '"Дала тыныш еді. Бірақ кенеттен дауыс шықты." "Бірақ" сөзінің қызметі:',
    options: ['Қарама-қайшылық', 'Себеп', 'Салдар', 'Қосу'],
    correctAnswer: 0,
    explanation: '"Бірақ" қарама-қайшылықты білдіреді.',
    difficulty: 3,
    timeLimit: 30,
  },
  {
    id: 'ta_7',
    prompt: '"Ерте тұрған — еңбегін жеген." Бұл қандай сөз түрі?',
    options: ['Мақал', 'Жұмбақ', 'Өлең', 'Ертегі'],
    correctAnswer: 0,
    explanation: 'Бұл — мақал-мәтел.',
    difficulty: 2,
    timeLimit: 25,
  },
  {
    id: 'ta_8',
    prompt: '"Жел соқты, бұлт жиналды, жаңбыр жауды." Оқиғалар реті:',
    options: ['Жел → бұлт → жаңбыр', 'Жаңбыр → бұлт → жел', 'Бұлт → жел → жаңбыр', 'Кездейсоқ'],
    correctAnswer: 0,
    explanation: 'Табиғи реттілік: жел, бұлт, жаңбыр.',
    difficulty: 3,
    timeLimit: 30,
  },
]

// Error Detection Test
const errorDetectionQuestions: MicroTestQuestion[] = [
  {
    id: 'ed_1',
    prompt: 'Қатені табыңыз: 15 + 27 = 42',
    options: ['Қате жоқ', 'Жауап 43 болуы керек', 'Жауап 52 болуы керек', 'Жауап 32 болуы керек'],
    correctAnswer: 0,
    explanation: '15 + 27 = 42. Қате жоқ.',
    difficulty: 2,
    timeLimit: 20,
  },
  {
    id: 'ed_2',
    prompt: 'Қатені табыңыз: 8 × 9 = 72',
    options: ['Қате жоқ', 'Жауап 63 болуы керек', 'Жауап 81 болуы керек', 'Жауап 64 болуы керек'],
    correctAnswer: 0,
    explanation: '8 × 9 = 72. Қате жоқ.',
    difficulty: 2,
    timeLimit: 15,
  },
  {
    id: 'ed_3',
    prompt: 'Қатені табыңыз: 100 - 37 = 73',
    options: ['Жауап 63 болуы керек', 'Қате жоқ', 'Жауап 67 болуы керек', 'Жауап 53 болуы керек'],
    correctAnswer: 0,
    explanation: '100 - 37 = 63, 73 емес.',
    difficulty: 3,
    timeLimit: 20,
  },
  {
    id: 'ed_4',
    prompt: 'Қатені табыңыз: √144 = 14',
    options: ['Жауап 12 болуы керек', 'Қате жоқ', 'Жауап 16 болуы керек', 'Жауап 11 болуы керек'],
    correctAnswer: 0,
    explanation: '√144 = 12, 14 емес.',
    difficulty: 3,
    timeLimit: 20,
  },
  {
    id: 'ed_5',
    prompt: 'Қатені табыңыз: 3² + 4² = 5²',
    options: ['Қате жоқ', 'Сол жақ 25 емес', 'Оң жақ 25 емес', 'Теңдік орындалмайды'],
    correctAnswer: 0,
    explanation: '9 + 16 = 25, 5² = 25. Пифагор үштігі.',
    difficulty: 4,
    timeLimit: 25,
  },
  {
    id: 'ed_6',
    prompt: 'Қатені табыңыз: 50% of 200 = 150',
    options: ['Жауап 100 болуы керек', 'Қате жоқ', 'Жауап 120 болуы керек', 'Жауап 75 болуы керек'],
    correctAnswer: 0,
    explanation: '200 × 0.5 = 100, 150 емес.',
    difficulty: 3,
    timeLimit: 25,
  },
  {
    id: 'ed_7',
    prompt: 'Қатені табыңыз: 2 + 3 × 4 = 20',
    options: ['Жауап 14 болуы керек', 'Қате жоқ', 'Жауап 24 болуы керек', 'Жауап 9 болуы керек'],
    correctAnswer: 0,
    explanation: 'Көбейту алдымен: 2 + 12 = 14, 20 емес.',
    difficulty: 4,
    timeLimit: 25,
  },
  {
    id: 'ed_8',
    prompt: 'Логикалық қатені табыңыз: "Барлық адамдар өледі. Сократ өлді. Демек, Сократ адам."',
    options: ['Қате бар — кері логика', 'Қате жоқ', 'Сократ адам емес', 'Барлық адам өлмейді'],
    correctAnswer: 0,
    explanation: '"A → B, B" деген логикадан "A" шықпайды. Бұл — кері логика қатесі.',
    difficulty: 6,
    timeLimit: 45,
  },
  {
    id: 'ed_9',
    prompt: 'Қатені табыңыз: 1/2 + 1/3 = 2/5',
    options: ['Жауап 5/6 болуы керек', 'Қате жоқ', 'Жауап 1/5 болуы керек', 'Жауап 2/6 болуы керек'],
    correctAnswer: 0,
    explanation: '1/2 + 1/3 = 3/6 + 2/6 = 5/6.',
    difficulty: 4,
    timeLimit: 30,
  },
  {
    id: 'ed_10',
    prompt: 'Қатені табыңыз: (a + b)² = a² + b²',
    options: ['Жауап a² + 2ab + b² болуы керек', 'Қате жоқ', 'Жауап 2ab болуы керек', 'Жауап a²b² болуы керек'],
    correctAnswer: 0,
    explanation: '(a + b)² = a² + 2ab + b². 2ab қалып кеткен.',
    difficulty: 5,
    timeLimit: 30,
  },
]

export function getQuestionsForTest(testType: MicroTestType): MicroTestQuestion[] {
  switch (testType) {
    case 'logical_reaction':
      return shuffleArray([...logicalReactionQuestions])
    case 'calculation_accuracy':
      return shuffleArray([...calculationAccuracyQuestions])
    case 'pressure_decision':
      return shuffleArray([...pressureDecisionQuestions])
    case 'text_analysis':
      return shuffleArray([...textAnalysisQuestions])
    case 'error_detection':
      return shuffleArray([...errorDetectionQuestions])
    default:
      return []
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
