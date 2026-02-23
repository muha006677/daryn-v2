import { Curriculum, CourseData, Category, CategoryKey, Grade } from './types'

export type GradeType = {
  topics: Record<string, any>
}

export const categories: Category[] = [
  {
    id: 'primary',
    label: 'Primary',
    labelKz: 'Бастауыш',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    grades: [1, 2, 3, 4],
  },
  {
    id: 'middle',
    label: 'Middle',
    labelKz: 'Негізгі',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    grades: [5, 6, 7, 8],
  },
  {
    id: 'high',
    label: 'High',
    labelKz: 'Жоғары',
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
    grades: [9, 10, 11],
  },
]

export const curriculum: Curriculum = {
  primary: {
    1: {
      id: 1,
      label: '1 сынып',
      topics: {
        "counting-10": {
          title: 'Заттарды санау (10-ға дейін)',
          description: '1-ден 10-ға дейін заттарды санау — 100 динамикалық сұрақ',
          questions: [],
          generator: 'grade1Lesson1',
        },
        "counting": {
          title: 'Санау және сандар',
          description: '1-ден 20-ға дейін санау',
          questions: [
            {
              id: '1-count-1',
              type: 'single',
              question: '5 + 3 = ?',
              options: ['6', '7', '8', '9'],
              correctAnswer: '8',
              explanation: '5 + 3 = 8',
              points: 1,
            },
            {
              id: '1-count-2',
              type: 'single',
              question: '10 - 4 = ?',
              options: ['5', '6', '7', '8'],
              correctAnswer: '6',
              explanation: '10 - 4 = 6',
              points: 1,
            },
            {
              id: '1-count-3',
              type: 'input',
              question: '7 + 2 қанша болады?',
              correctAnswer: '9',
              explanation: '7 + 2 = 9',
              points: 2,
            },
          ],
        },
        "shapes": {
          title: 'Геометриялық фигуралар',
          description: 'Қарапайым фигураларды тану',
          questions: [
            {
              id: '1-shape-1',
              type: 'single',
              question: 'Үшбұрыштың неше қабырғасы бар?',
              options: ['2', '3', '4', '5'],
              correctAnswer: '3',
              explanation: 'Үшбұрыштың 3 қабырғасы бар',
              points: 1,
            },
            {
              id: '1-shape-2',
              type: 'single',
              question: 'Квадраттың барлық қабырғалары қандай?',
              options: ['Әртүрлі', 'Тең', 'Ұзын', 'Қысқа'],
              correctAnswer: 'Тең',
              explanation: 'Квадраттың барлық қабырғалары тең',
              points: 1,
            },
          ],
        },
        "counting-objects": {
          title: "Заттарды санау (10-ға дейін)",
          questions: [
            {
              id: "g1l1-q1",
              type: "single",
              text: "Суреттегі алма саны қанша?",
              options: [3, 4, 5, 6],
              correctAnswer: 5,
              explanation: "Алмаларды санағанда 5 алма бар."
            },
            {
              id: "g1l1-q2",
              type: "single",
              text: "Қай сан 7-ден кейін келеді?",
              options: [6, 7, 8, 9],
              correctAnswer: 8,
              explanation: "7-ден кейін 8 келеді."
            },
            {
              id: "g1l1-q3",
              type: "single",
              text: "3 нүктені көрсет.",
              options: [1, 2, 3, 4],
              correctAnswer: 3,
              explanation: "Дұрыс жауап — 3."
            },
            {
              id: "g1l1-q4",
              type: "single",
              text: "Қайсысы 10 саны?",
              options: [8, 9, 10, 11],
              correctAnswer: 10,
              explanation: "10 саны дұрыс жауап."
            },
            {
              id: "g1l1-q5",
              type: "single",
              text: "Қуыршақтар саны қанша?",
              options: [2, 3, 4, 5],
              correctAnswer: 4,
              explanation: "Суретте 4 қуыршақ бар."
            }
          ]
        },
      },
    },
    2: {
      id: 2,
      label: '2 сынып',
      topics: [
        {
          id: 'addition-subtraction',
          title: 'Қосу және азайту',
          description: '100-ге дейін қосу және азайту',
          questions: [
            {
              id: '2-add-1',
              type: 'single',
              question: '25 + 17 = ?',
              options: ['40', '41', '42', '43'],
              correctAnswer: '42',
              explanation: '25 + 17 = 42',
              points: 1,
            },
            {
              id: '2-add-2',
              type: 'single',
              question: '50 - 23 = ?',
              options: ['25', '26', '27', '28'],
              correctAnswer: '27',
              explanation: '50 - 23 = 27',
              points: 1,
            },
            {
              id: '2-add-3',
              type: 'input',
              question: '34 + 28 қанша болады?',
              correctAnswer: '62',
              explanation: '34 + 28 = 62',
              points: 2,
            },
          ],
        },
        {
          id: 'multiplication-intro',
          title: 'Көбейту негіздері',
          description: 'Көбейту кестесіне кіріспе',
          questions: [
            {
              id: '2-mult-1',
              type: 'single',
              question: '2 × 5 = ?',
              options: ['8', '9', '10', '11'],
              correctAnswer: '10',
              explanation: '2 × 5 = 10',
              points: 1,
            },
            {
              id: '2-mult-2',
              type: 'single',
              question: '3 × 4 = ?',
              options: ['10', '11', '12', '13'],
              correctAnswer: '12',
              explanation: '3 × 4 = 12',
              points: 1,
            },
          ],
        },
      ],
    },
    3: {
      id: 3,
      label: '3 сынып',
      topics: [
        {
          id: 'multiplication-table',
          title: 'Көбейту кестесі',
          description: 'Көбейту кестесін толық меңгеру',
          questions: [
            {
              id: '3-mult-1',
              type: 'single',
              question: '7 × 8 = ?',
              options: ['54', '55', '56', '57'],
              correctAnswer: '56',
              explanation: '7 × 8 = 56',
              points: 1,
            },
            {
              id: '3-mult-2',
              type: 'single',
              question: '9 × 6 = ?',
              options: ['52', '53', '54', '55'],
              correctAnswer: '54',
              explanation: '9 × 6 = 54',
              points: 1,
            },
            {
              id: '3-mult-3',
              type: 'input',
              question: '8 × 9 қанша болады?',
              correctAnswer: '72',
              explanation: '8 × 9 = 72',
              points: 2,
            },
          ],
        },
        {
          id: 'division',
          title: 'Бөлу',
          description: 'Бөлу амалы негіздері',
          questions: [
            {
              id: '3-div-1',
              type: 'single',
              question: '24 ÷ 6 = ?',
              options: ['3', '4', '5', '6'],
              correctAnswer: '4',
              explanation: '24 ÷ 6 = 4',
              points: 1,
            },
            {
              id: '3-div-2',
              type: 'input',
              question: '45 ÷ 9 неге тең?',
              correctAnswer: '5',
              explanation: '45 ÷ 9 = 5',
              points: 2,
            },
          ],
        },
      ],
    },
    4: {
      id: 4,
      label: '4 сынып',
      topics: [
        {
          id: 'multi-digit',
          title: 'Көп таңбалы сандар',
          description: 'Мыңдықтар және одан үлкен сандар',
          questions: [
            {
              id: '4-multi-1',
              type: 'single',
              question: '1234 + 567 = ?',
              options: ['1791', '1801', '1811', '1821'],
              correctAnswer: '1801',
              explanation: '1234 + 567 = 1801',
              points: 1,
            },
            {
              id: '4-multi-2',
              type: 'single',
              question: '2000 - 456 = ?',
              options: ['1544', '1554', '1564', '1574'],
              correctAnswer: '1544',
              explanation: '2000 - 456 = 1544',
              points: 1,
            },
            {
              id: '4-multi-3',
              type: 'input',
              question: '125 × 8 қанша болады?',
              correctAnswer: '1000',
              explanation: '125 × 8 = 1000',
              points: 2,
            },
          ],
        },
        {
          id: 'fractions-intro',
          title: 'Бөлшектер негіздері',
          description: 'Жай бөлшектерге кіріспе',
          questions: [
            {
              id: '4-frac-1',
              type: 'single',
              question: '1/2 қандай санды білдіреді?',
              options: ['Жарты', 'Ширек', 'Бүтін', 'Ештеңе'],
              correctAnswer: 'Жарты',
              explanation: '1/2 — жартыны білдіреді',
              points: 1,
            },
            {
              id: '4-frac-2',
              type: 'single',
              question: 'Қай бөлшек үлкен: 1/2 немесе 1/4?',
              options: ['1/2', '1/4', 'Тең', 'Анықтау мүмкін емес'],
              correctAnswer: '1/2',
              explanation: '1/2 > 1/4',
              points: 1,
            },
          ],
        },
      ],
    },
  },
  middle: {
    5: {
      id: 5,
      label: '5 сынып',
      topics: [
        {
          id: 'natural-numbers',
          title: 'Натурал сандар',
          description: 'Натурал сандармен амалдар, бөлгіштік белгілері',
          questions: [
            {
              id: '5-nat-1',
              type: 'single',
              question: '245 + 378 қосындысын табыңыз',
              options: ['613', '623', '633', '523'],
              correctAnswer: '623',
              explanation: '245 + 378 = 623',
              points: 1,
            },
            {
              id: '5-nat-2',
              type: 'single',
              question: '1000 - 456 айырмасын табыңыз',
              options: ['544', '554', '454', '444'],
              correctAnswer: '544',
              explanation: '1000 - 456 = 544',
              points: 1,
            },
            {
              id: '5-nat-3',
              type: 'input',
              question: '25 × 4 көбейтіндісін есептеңіз',
              correctAnswer: '100',
              explanation: '25 × 4 = 100',
              points: 2,
            },
            {
              id: '5-nat-4',
              type: 'multiple',
              question: '36 санының бөлгіштерін таңдаңыз',
              options: ['1', '2', '3', '4', '5', '6', '7', '9'],
              correctAnswer: ['1', '2', '3', '4', '6', '9'],
              explanation: '36 = 1×36 = 2×18 = 3×12 = 4×9 = 6×6',
              points: 2,
            },
            {
              id: '5-nat-5',
              type: 'single',
              question: '144 ÷ 12 бөліндісін табыңыз',
              options: ['10', '11', '12', '13'],
              correctAnswer: '12',
              explanation: '144 ÷ 12 = 12',
              points: 1,
            },
          ],
        },
        {
          id: 'fractions',
          title: 'Жай бөлшектер',
          description: 'Жай бөлшектерді салыстыру және амалдар',
          questions: [
            {
              id: '5-frac-1',
              type: 'single',
              question: '1/2 + 1/4 қосындысын табыңыз',
              options: ['1/6', '2/6', '3/4', '1/4'],
              correctAnswer: '3/4',
              explanation: '1/2 + 1/4 = 2/4 + 1/4 = 3/4',
              points: 1,
            },
            {
              id: '5-frac-2',
              type: 'single',
              question: 'Қай бөлшек үлкен: 2/3 немесе 3/5?',
              options: ['2/3', '3/5', 'Тең', 'Анықтау мүмкін емес'],
              correctAnswer: '2/3',
              explanation: '2/3 = 10/15, 3/5 = 9/15, демек 2/3 > 3/5',
              points: 1,
            },
            {
              id: '5-frac-3',
              type: 'input',
              question: '3/4 бөлшегін пайызбен көрсетіңіз (тек санды жазыңыз)',
              correctAnswer: '75',
              explanation: '3/4 = 0.75 = 75%',
              points: 2,
            },
          ],
        },
      ],
    },
    6: {
      id: 6,
      label: '6 сынып',
      topics: [
        {
          id: 'divisibility',
          title: 'Бөлінгіштік',
          description: 'ЕҮОБ және ЕКОЕ табу',
          questions: [
            {
              id: '6-div-1',
              type: 'single',
              question: '12 және 18 сандарының ЕҮОБ-ын табыңыз',
              options: ['2', '3', '6', '12'],
              correctAnswer: '6',
              explanation: '12 = 2² × 3, 18 = 2 × 3², ЕҮОБ = 2 × 3 = 6',
              points: 1,
            },
            {
              id: '6-div-2',
              type: 'input',
              question: '4 және 6 сандарының ЕКОЕ-сін табыңыз',
              correctAnswer: '12',
              explanation: 'ЕКОЕ(4, 6) = 12',
              points: 2,
            },
            {
              id: '6-div-3',
              type: 'multiple',
              question: '2-ге және 3-ке бөлінетін сандарды таңдаңыз',
              options: ['12', '15', '18', '24', '25', '30'],
              correctAnswer: ['12', '18', '24', '30'],
              explanation: '6-ға бөлінетін сандар: 12, 18, 24, 30',
              points: 2,
            },
          ],
        },
        {
          id: 'negative-numbers',
          title: 'Теріс сандар',
          description: 'Теріс сандармен амалдар',
          questions: [
            {
              id: '6-neg-1',
              type: 'single',
              question: '(-5) + (-3) нәтижесін табыңыз',
              options: ['-8', '-2', '8', '2'],
              correctAnswer: '-8',
              explanation: '(-5) + (-3) = -8',
              points: 1,
            },
            {
              id: '6-neg-2',
              type: 'single',
              question: '(-4) × (-6) көбейтіндісін табыңыз',
              options: ['-24', '24', '-10', '10'],
              correctAnswer: '24',
              explanation: 'Теріс × теріс = оң, (-4) × (-6) = 24',
              points: 1,
            },
          ],
        },
      ],
    },
    7: {
      id: 7,
      label: '7 сынып',
      topics: [
        {
          id: 'linear-equations',
          title: 'Сызықтық теңдеулер',
          description: 'Бір белгісізді сызықтық теңдеулер',
          questions: [
            {
              id: '7-lin-1',
              type: 'single',
              question: '2x + 5 = 13 теңдеуін шешіңіз',
              options: ['x = 3', 'x = 4', 'x = 5', 'x = 9'],
              correctAnswer: 'x = 4',
              explanation: '2x = 13 - 5 = 8, x = 4',
              points: 1,
            },
            {
              id: '7-lin-2',
              type: 'input',
              question: '3x - 7 = 2x + 5 теңдеуінің шешімін табыңыз (тек санды жазыңыз)',
              correctAnswer: '12',
              explanation: '3x - 2x = 5 + 7, x = 12',
              points: 2,
            },
          ],
        },
        {
          id: 'triangles',
          title: 'Үшбұрыштар',
          description: 'Үшбұрыш түрлері және қасиеттері',
          questions: [
            {
              id: '7-tri-1',
              type: 'single',
              question: 'Үшбұрыштың ішкі бұрыштарының қосындысы неге тең?',
              options: ['90°', '180°', '270°', '360°'],
              correctAnswer: '180°',
              explanation: 'Кез келген үшбұрыштың ішкі бұрыштарының қосындысы 180°',
              points: 1,
            },
          ],
        },
      ],
    },
    8: {
      id: 8,
      label: '8 сынып',
      topics: [
        {
          id: 'quadratic-equations',
          title: 'Квадрат теңдеулер',
          description: 'Квадрат теңдеулерді шешу',
          questions: [
            {
              id: '8-quad-1',
              type: 'single',
              question: 'x² - 5x + 6 = 0 теңдеуінің түбірлерін табыңыз',
              options: ['x = 2, x = 3', 'x = 1, x = 6', 'x = -2, x = -3', 'x = 2, x = -3'],
              correctAnswer: 'x = 2, x = 3',
              explanation: '(x - 2)(x - 3) = 0, x = 2 немесе x = 3',
              points: 1,
            },
            {
              id: '8-quad-2',
              type: 'input',
              question: 'x² = 49 теңдеуінің оң түбірін жазыңыз',
              correctAnswer: '7',
              explanation: 'x = ±7, оң түбір = 7',
              points: 2,
            },
          ],
        },
        {
          id: 'pythagorean',
          title: 'Пифагор теоремасы',
          description: 'Тікбұрышты үшбұрыш',
          questions: [
            {
              id: '8-pyth-1',
              type: 'single',
              question: 'Катеттері 3 және 4 болатын тікбұрышты үшбұрыштың гипотенузасы неге тең?',
              options: ['5', '6', '7', '√7'],
              correctAnswer: '5',
              explanation: 'c² = 3² + 4² = 9 + 16 = 25, c = 5',
              points: 1,
            },
          ],
        },
      ],
    },
  },
  high: {
    9: {
      id: 9,
      label: '9 сынып',
      topics: [
        {
          id: 'quadratic-function',
          title: 'Квадраттық функция',
          description: 'Парабола және оның қасиеттері',
          questions: [
            {
              id: '9-qfunc-1',
              type: 'single',
              question: 'y = x² - 4x + 3 параболасының төбесінің x координатасы қандай?',
              options: ['1', '2', '3', '4'],
              correctAnswer: '2',
              explanation: 'x₀ = -b/(2a) = 4/2 = 2',
              points: 1,
            },
          ],
        },
        {
          id: 'progressions',
          title: 'Прогрессиялар',
          description: 'Арифметикалық және геометриялық прогрессиялар',
          questions: [
            {
              id: '9-prog-1',
              type: 'single',
              question: 'Арифметикалық прогрессияда a₁ = 3, d = 2. a₅ неге тең?',
              options: ['9', '10', '11', '12'],
              correctAnswer: '11',
              explanation: 'a₅ = a₁ + 4d = 3 + 8 = 11',
              points: 1,
            },
            {
              id: '9-prog-2',
              type: 'input',
              question: 'Геометриялық прогрессияда b₁ = 2, q = 3. b₄ неге тең?',
              correctAnswer: '54',
              explanation: 'b₄ = b₁ × q³ = 2 × 27 = 54',
              points: 2,
            },
          ],
        },
      ],
    },
    10: {
      id: 10,
      label: '10 сынып',
      topics: [
        {
          id: 'trigonometric-equations',
          title: 'Тригонометриялық теңдеулер',
          description: 'Тригонометриялық теңдеулерді шешу',
          questions: [
            {
              id: '10-trieq-1',
              type: 'single',
              question: 'sin x = 1/2 теңдеуінің [0; 2π] аралығындағы шешімдер саны',
              options: ['1', '2', '3', '4'],
              correctAnswer: '2',
              explanation: 'x = π/6 және x = 5π/6',
              points: 1,
            },
          ],
        },
        {
          id: 'derivatives',
          title: 'Туынды',
          description: 'Туынды табу ережелері',
          questions: [
            {
              id: '10-der-1',
              type: 'single',
              question: 'f(x) = x³ функциясының туындысы f\'(x) қандай?',
              options: ['3x', '3x²', 'x²', '3x³'],
              correctAnswer: '3x²',
              explanation: '(xⁿ)\' = n·xⁿ⁻¹, демек (x³)\' = 3x²',
              points: 1,
            },
            {
              id: '10-der-2',
              type: 'input',
              question: 'f(x) = x⁴ функциясында f\'(2) неге тең?',
              correctAnswer: '32',
              explanation: 'f\'(x) = 4x³, f\'(2) = 4 × 8 = 32',
              points: 2,
            },
          ],
        },
      ],
    },
    11: {
      id: 11,
      label: '11 сынып',
      topics: [
        {
          id: 'integrals',
          title: 'Интегралдар',
          description: 'Анықталмаған және анықталған интегралдар',
          questions: [
            {
              id: '11-int-1',
              type: 'single',
              question: '∫ 2x dx интегралы қандай?',
              options: ['x² + C', '2x² + C', 'x + C', '2 + C'],
              correctAnswer: 'x² + C',
              explanation: '∫ 2x dx = x² + C',
              points: 1,
            },
            {
              id: '11-int-2',
              type: 'single',
              question: '∫₀² x dx анықталған интегралының мәні қандай?',
              options: ['1', '2', '3', '4'],
              correctAnswer: '2',
              explanation: '[x²/2]₀² = 4/2 - 0 = 2',
              points: 1,
            },
          ],
        },
        {
          id: 'probability',
          title: 'Ықтималдық',
          description: 'Ықтималдық теориясы негіздері',
          questions: [
            {
              id: '11-prob-1',
              type: 'single',
              question: 'Сүйек лақтырғанда 6 түсу ықтималдығы қандай?',
              options: ['1/2', '1/3', '1/6', '1/12'],
              correctAnswer: '1/6',
              explanation: 'P = 1/6 (6 жақтан біреуі)',
              points: 1,
            },
          ],
        },
      ],
    },
  },
}

// Helper to get all grades as flat CourseData (for backward compatibility)
export const courseData: Record<string, GradeType> = {
  ...curriculum.primary,
  ...curriculum.middle,
  ...curriculum.high,
}

export const gradeList = Object.entries(courseData).map(([id, grade]) => ({
  id,
  topicCount: Object.keys(grade.topics ?? {}).length
}))

// Helper to get category for a grade
export function getCategoryForGrade(gradeId: number): Category | undefined {
  return categories.find((cat) => cat.grades.includes(gradeId))
}

// Helper to get grades by category
export function getGradesByCategory(categoryId: CategoryKey): Grade[] {
  const categoryGrades = curriculum?.[categoryId]
  return Object.values(categoryGrades ?? {})
}
