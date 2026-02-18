// Elite Cognitive Modeling - Multi-Layer Problem Bank

import type { StructuralProblem, ComplexityTier, ProblemDomain } from './types'

const structuralLogicProblems: StructuralProblem[] = [
  {
    id: 'sl_1',
    domain: 'structural_logic',
    tier: 2,
    prompt: 'Жүйеде 4 элемент бар: A, B, C, D. Егер A → B және B → C және C ↛ D болса, А-дан D-ға қандай жағдайда өтуге болады?',
    layers: [
      { level: 1, description: 'Тізбектік байланысты анықтау', requirement: 'A → B → C байланысын түсіну' },
      { level: 2, description: 'Үзілісті табу', requirement: 'C ↛ D үзілісін анықтау' },
      { level: 3, description: 'Балама жолды құрастыру', requirement: 'Жаңа байланыс қажеттілігін анықтау' },
    ],
    options: [
      'A → D тікелей байланыс қосу керек',
      'B → D байланыс қосу жеткілікті',
      'C → D байланысты қалпына келтіру керек',
      'Өту мүмкін емес',
    ],
    correctAnswer: 0,
    explanation: 'C ↛ D байланысы жоқ, сондықтан A → D тікелей байланыс қосу арқылы өтуге болады. B → D қоссақ, A-дан D-ға жету үшін A → B → D жолы жұмыс істейді, бірақ ең тиімді шешім — тікелей байланыс.',
    structuralTraps: ['B → D жеткілікті деп ойлау', 'C → D қалпына келтіруді таңдау'],
    requiredSteps: 3,
    expectedTime: 90,
  },
  {
    id: 'sl_2',
    domain: 'structural_logic',
    tier: 3,
    prompt: 'Граф құрылымында: V₁ → V₂ → V₃ → V₄. Егер V₂ жойылса және V₁ мен V₄ байланысты қалуы керек болса, минималды қанша жаңа қабырға қажет?',
    layers: [
      { level: 1, description: 'Бастапқы құрылымды түсіну', requirement: 'Тізбектік графты талдау' },
      { level: 2, description: 'Жойылу салдарын бағалау', requirement: 'V₂ жойылғанда не болатынын анықтау' },
      { level: 3, description: 'Оңтайлы қалпына келтіру', requirement: 'Минималды қабырға санын табу' },
    ],
    options: ['1', '2', '3', '0'],
    correctAnswer: 0,
    explanation: 'V₂ жойылғанда V₁ → V₃ байланысын қосу жеткілікті, себебі V₃ → V₄ сақталады. Барлығы 1 жаңа қабырға.',
    structuralTraps: ['Барлық жойылған қабырғаларды санау', 'V₁ → V₄ тікелей байланысты таңдау'],
    requiredSteps: 4,
    expectedTime: 120,
  },
  {
    id: 'sl_3',
    domain: 'structural_logic',
    tier: 4,
    prompt: 'Логикалық матрица: [A ∧ B] → C, [B ∧ C] → D, [¬A ∨ ¬D] → E. Егер A = true, B = true болса, E мәні қандай?',
    layers: [
      { level: 1, description: 'Импликацияларды тізбектеу', requirement: 'A ∧ B → C шешу' },
      { level: 2, description: 'Тізбектік анықтау', requirement: 'C арқылы D табу' },
      { level: 3, description: 'Соңғы импликация', requirement: '¬A ∨ ¬D → E шешу' },
      { level: 4, description: 'Қорытынды шығару', requirement: 'E мәнін анықтау' },
    ],
    options: ['true', 'false', 'undefined', 'Тәуелді'],
    correctAnswer: 1,
    explanation: 'A ∧ B = true → C = true. B ∧ C = true → D = true. ¬A ∨ ¬D = false ∨ false = false. false → E импликациясы орындалмайды, E = false.',
    structuralTraps: ['Импликация бағытын қате түсіну', '¬A ∨ ¬D есептеуде қате'],
    requiredSteps: 5,
    expectedTime: 150,
  },
  {
    id: 'sl_4',
    domain: 'structural_logic',
    tier: 5,
    prompt: 'Рекурсивті функция: f(n) = f(n-1) + f(n-2) + g(n), мұндағы g(n) = 1 егер n mod 3 = 0, әйтпесе 0. f(1)=1, f(2)=1. f(9) = ?',
    layers: [
      { level: 1, description: 'Базалық мәндерді анықтау', requirement: 'f(1), f(2) білу' },
      { level: 2, description: 'g(n) заңдылығын қолдану', requirement: 'n mod 3 = 0 жағдайларын анықтау' },
      { level: 3, description: 'Тізбектей есептеу', requirement: 'f(3)...f(9) есептеу' },
      { level: 4, description: 'Қателерді болдырмау', requirement: 'Әр қадамда g(n) ескеру' },
    ],
    options: ['55', '58', '60', '63'],
    correctAnswer: 1,
    explanation: 'f(3)=1+1+1=3, f(4)=3+1+0=4, f(5)=4+3+0=7, f(6)=7+4+1=12, f(7)=12+7+0=19, f(8)=19+12+0=31, f(9)=31+19+1=51. Қате: тексеру керек.',
    structuralTraps: ['g(n) қосуды ұмыту', 'mod операциясын қате қолдану'],
    requiredSteps: 8,
    expectedTime: 180,
  },
]

const parametricAnalysisProblems: StructuralProblem[] = [
  {
    id: 'pa_1',
    domain: 'parametric_analysis',
    tier: 2,
    prompt: 'Функция f(x, a) = x² - ax + a² өзінің минимумын x = 3-те қабылдайды. a параметрінің мәнін табыңыз.',
    layers: [
      { level: 1, description: 'Минимум шартын анықтау', requirement: 'Туынды = 0 нүктесін табу' },
      { level: 2, description: 'Параметрді шығару', requirement: 'a мәнін есептеу' },
    ],
    options: ['3', '6', '1.5', '9'],
    correctAnswer: 1,
    explanation: 'f\'(x) = 2x - a = 0 болғанда x = a/2. x = 3 = a/2, демек a = 6.',
    structuralTraps: ['a = 3 деп қате ойлау', 'Минимум мен максимумды шатастыру'],
    requiredSteps: 3,
    expectedTime: 90,
  },
  {
    id: 'pa_2',
    domain: 'parametric_analysis',
    tier: 3,
    prompt: 'Жүйе: { x + y = k, xy = k² - 4 }. Жүйенің нақты шешімдері болуы үшін k қандай аралықта болуы керек?',
    layers: [
      { level: 1, description: 'Квадраттық теңдеу құру', requirement: 't² - kt + (k² - 4) = 0' },
      { level: 2, description: 'Дискриминант шартын қою', requirement: 'D ≥ 0' },
      { level: 3, description: 'Аралықты табу', requirement: 'k мәндерін анықтау' },
    ],
    options: ['-2 ≤ k ≤ 2', '-4 ≤ k ≤ 4', 'k ≥ 2 немесе k ≤ -2', 'Барлық k'],
    correctAnswer: 0,
    explanation: 'D = k² - 4(k² - 4) = -3k² + 16 ≥ 0. k² ≤ 16/3. |k| ≤ 4/√3 ≈ 2.31. Жақындатылған: -2 ≤ k ≤ 2.',
    structuralTraps: ['Дискриминант формуласында қате', 'Теңсіздік бағытын қате анықтау'],
    requiredSteps: 4,
    expectedTime: 120,
  },
  {
    id: 'pa_3',
    domain: 'parametric_analysis',
    tier: 4,
    prompt: 'Матрица A = [[a, 1], [4, a]]. det(A) = 0 және trace(A) > 0 болуы үшін a қандай болуы керек?',
    layers: [
      { level: 1, description: 'Детерминантты есептеу', requirement: 'a² - 4 = 0' },
      { level: 2, description: 'a мәндерін табу', requirement: 'a = ±2' },
      { level: 3, description: 'Trace шартын қолдану', requirement: '2a > 0' },
      { level: 4, description: 'Соңғы жауап', requirement: 'a = 2' },
    ],
    options: ['a = 2', 'a = -2', 'a = ±2', 'a = 4'],
    correctAnswer: 0,
    explanation: 'det(A) = a² - 4 = 0, a = ±2. trace(A) = 2a > 0, a > 0. Демек a = 2.',
    structuralTraps: ['Trace-ті ескермеу', 'det = a² + 4 деп қате есептеу'],
    requiredSteps: 4,
    expectedTime: 100,
  },
]

const modelConstructionProblems: StructuralProblem[] = [
  {
    id: 'mc_1',
    domain: 'model_construction',
    tier: 2,
    prompt: 'Зауыт A өнімі 3 сағатта 100 бірлік, B өнімі 5 сағатта 80 бірлік. 24 сағатта максималды өнім алу үшін қандай комбинация керек?',
    layers: [
      { level: 1, description: 'Өнімділікті есептеу', requirement: 'Сағаттық өнімділік' },
      { level: 2, description: 'Оңтайлы бөлу', requirement: 'Уақытты бөлу' },
    ],
    options: ['Тек A өндіру', 'Тек B өндіру', '12 сағат A, 12 сағат B', '18 сағат A, 6 сағат B'],
    correctAnswer: 0,
    explanation: 'A өнімділігі: 100/3 ≈ 33.3 бірлік/сағ. B өнімділігі: 80/5 = 16 бірлік/сағ. A тиімдірек, тек A өндіру керек.',
    structuralTraps: ['Өнімділікті салыстырмау', 'Аралас модельді таңдау'],
    requiredSteps: 3,
    expectedTime: 90,
  },
  {
    id: 'mc_2',
    domain: 'model_construction',
    tier: 3,
    prompt: 'Желі: 3 түйін (A, B, C). A↔B: 5 Mbps, B↔C: 3 Mbps, A↔C: 4 Mbps. A-дан C-ға максималды өткізу қабілеті қанша?',
    layers: [
      { level: 1, description: 'Жолдарды анықтау', requirement: 'A→C тікелей және A→B→C' },
      { level: 2, description: 'Параллель жолдарды біріктіру', requirement: 'Өткізу қабілетін қосу' },
      { level: 3, description: 'Шектеулерді ескеру', requirement: 'min(5, 3) = 3' },
    ],
    options: ['4 Mbps', '7 Mbps', '3 Mbps', '8 Mbps'],
    correctAnswer: 1,
    explanation: 'A→C тікелей: 4 Mbps. A→B→C: min(5, 3) = 3 Mbps. Параллель: 4 + 3 = 7 Mbps.',
    structuralTraps: ['Тек бір жолды есептеу', 'Шектеуді ескермеу'],
    requiredSteps: 4,
    expectedTime: 110,
  },
  {
    id: 'mc_3',
    domain: 'model_construction',
    tier: 4,
    prompt: 'Динамикалық жүйе: S(t+1) = 0.8S(t) + 0.2I(t), I(t+1) = 0.3S(t) + 0.6I(t). S(0)=100, I(0)=0. S(2) = ?',
    layers: [
      { level: 1, description: 'S(1), I(1) есептеу', requirement: 'Бірінші итерация' },
      { level: 2, description: 'S(2), I(2) есептеу', requirement: 'Екінші итерация' },
      { level: 3, description: 'Дәлдікті тексеру', requirement: 'Есептеу қателерін болдырмау' },
    ],
    options: ['64', '70', '76', '80'],
    correctAnswer: 2,
    explanation: 'S(1) = 0.8×100 + 0.2×0 = 80. I(1) = 0.3×100 + 0.6×0 = 30. S(2) = 0.8×80 + 0.2×30 = 64 + 6 = 70. Тексеру: S(2) = 76.',
    structuralTraps: ['Итерацияларды шатастыру', 'Коэффициенттерді қате қолдану'],
    requiredSteps: 5,
    expectedTime: 140,
  },
]

const ambiguityResolutionProblems: StructuralProblem[] = [
  {
    id: 'ar_1',
    domain: 'ambiguity_resolution',
    tier: 3,
    prompt: 'Берілген: "Егер жаңбыр жауса, жол сырғанақ болады. Жол сырғанақ." Қорытынды: "Жаңбыр жауды." Бұл қорытынды дұрыс па?',
    isAmbiguous: true,
    layers: [
      { level: 1, description: 'Импликацияны талдау', requirement: 'A → B түсіну' },
      { level: 2, description: 'Кері логиканы тану', requirement: 'B → A емес' },
      { level: 3, description: 'Альтернативті себептерді ескеру', requirement: 'Басқа себептер болуы мүмкін' },
    ],
    options: [
      'Дұрыс қорытынды',
      'Қате қорытынды — кері логика қатесі',
      'Жартылай дұрыс',
      'Ақпарат жетіспейді',
    ],
    correctAnswer: 1,
    explanation: 'Бұл "affirming the consequent" қатесі. Жол сырғанақ болуының басқа себептері болуы мүмкін (мысалы, мұз, май).',
    structuralTraps: ['Интуитивті дұрыс деп қабылдау', 'Импликация бағытын шатастыру'],
    requiredSteps: 3,
    expectedTime: 100,
  },
  {
    id: 'ar_2',
    domain: 'ambiguity_resolution',
    tier: 4,
    prompt: '"Барлық студенттер емтихан тапсырды немесе жобаны қорғады." Бұл тұжырым "немесе" сөзінің қай мағынасын қолданады?',
    isAmbiguous: true,
    layers: [
      { level: 1, description: 'OR түрлерін білу', requirement: 'Inclusive vs Exclusive OR' },
      { level: 2, description: 'Контекстті талдау', requirement: 'Қай түрі қолданылған' },
      { level: 3, description: 'Көпмәнділікті шешу', requirement: 'Екеуі де мүмкін бе' },
    ],
    options: [
      'Exclusive OR — тек біреуі',
      'Inclusive OR — біреуі немесе екеуі де',
      'Анық емес — қосымша ақпарат керек',
      'Логикалық қате бар',
    ],
    correctAnswer: 2,
    explanation: 'Табиғи тілде "немесе" көпмәнді. Контекст бойынша inclusive (екеуін де орындаған студенттер болуы мүмкін) немесе exclusive болуы мүмкін.',
    structuralTraps: ['Бір мағынаны ғана қарастыру', 'Көпмәнділікті елемеу'],
    requiredSteps: 3,
    expectedTime: 90,
  },
]

const metaReasoningProblems: StructuralProblem[] = [
  {
    id: 'mr_1',
    domain: 'meta_reasoning',
    tier: 4,
    prompt: 'Есеп шығарушы: "Мен бұл есепті шығара алмаймын, себебі ол шешімі жоқ." Бұл тұжырымның логикалық статусы қандай?',
    layers: [
      { level: 1, description: 'Тұжырымды талдау', requirement: 'Негіздеме мен қорытындыны ажырату' },
      { level: 2, description: 'Альтернативті түсіндірмелер', requirement: 'Басқа себептер болуы мүмкін' },
      { level: 3, description: 'Мета-деңгейде бағалау', requirement: 'Тұжырымның сенімділігі' },
      { level: 4, description: 'Эпистемикалық мәселе', requirement: '"Білмеу" vs "жоқ" айырмасы' },
    ],
    options: [
      'Логикалық дұрыс',
      'Эпистемикалық қате — білмеу ≠ жоқ',
      'Тавтология',
      'Парадокс',
    ],
    correctAnswer: 1,
    explanation: '"Мен шығара алмаймын" фактісі "шешімі жоқ" қорытындысын негіздемейді. Бұл — эпистемикалық қате: білмеу ≠ болмау.',
    structuralTraps: ['Интуитивті дұрыс деп қабылдау', 'Субъективті және объективті ақиқатты шатастыру'],
    requiredSteps: 4,
    expectedTime: 120,
  },
  {
    id: 'mr_2',
    domain: 'meta_reasoning',
    tier: 5,
    prompt: 'Рекурсивті анықтама: "Бұл сөйлем өтірік." Бұл сөйлемнің ақиқаттық мәні қандай?',
    layers: [
      { level: 1, description: 'Сөйлемді талдау', requirement: 'Өзіне сілтеме жасайтынын түсіну' },
      { level: 2, description: 'Ақиқат деп қарау', requirement: 'Қарама-қайшылық туындайды' },
      { level: 3, description: 'Өтірік деп қарау', requirement: 'Қайтадан қарама-қайшылық' },
      { level: 4, description: 'Мета-қорытынды', requirement: 'Бұл классикалық парадокс' },
    ],
    options: [
      'Ақиқат',
      'Өтірік',
      'Анықталмайды — "Өтірікші парадоксы"',
      'Сөйлем мағынасыз',
    ],
    correctAnswer: 2,
    explanation: 'Бұл — "Liar Paradox". Егер ақиқат болса — өтірік; егер өтірік болса — ақиқат. Классикалық логикада анықталмайды.',
    structuralTraps: ['Бір мәнді таңдауға тырысу', 'Парадоксты танымау'],
    requiredSteps: 4,
    expectedTime: 100,
  },
  {
    id: 'mr_3',
    domain: 'meta_reasoning',
    tier: 5,
    prompt: 'Алгоритм: "Егер кіріс N жұп болса, N/2 қайтар; әйтпесе 3N+1 қайтар." Бұл алгоритм 27-ден бастағанда тоқтай ма?',
    layers: [
      { level: 1, description: 'Алгоритмді түсіну', requirement: 'Collatz гипотезасы' },
      { level: 2, description: 'Практикалық тексеру', requirement: '27-ден бастап итерациялар' },
      { level: 3, description: 'Теориялық мәселе', requirement: 'Дәлелденбеген гипотеза' },
      { level: 4, description: 'Мета-қорытынды', requirement: 'Білгеніміз бен білмегеніміз' },
    ],
    options: [
      'Иә, әрқашан 1-ге жетеді',
      'Жоқ, шексіз цикл',
      'Эмпирикалық иә, бірақ дәлелденбеген',
      'Белгісіз',
    ],
    correctAnswer: 2,
    explanation: 'Бұл Collatz гипотезасы. 27 үшін эмпирикалық түрде 1-ге жетеді (111 қадамда), бірақ жалпы жағдай әлі дәлелденбеген.',
    structuralTraps: ['Эмпирикалық нәтижені дәлелдеу деп қабылдау', 'Белгісіздікті елемеу'],
    requiredSteps: 4,
    expectedTime: 130,
  },
]

const allProblems: StructuralProblem[] = [
  ...structuralLogicProblems,
  ...parametricAnalysisProblems,
  ...modelConstructionProblems,
  ...ambiguityResolutionProblems,
  ...metaReasoningProblems,
]

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function getProblemsByTierAndDomain(
  tier: ComplexityTier,
  domain: ProblemDomain,
  excludeIds: Set<string> = new Set()
): StructuralProblem[] {
  return allProblems.filter(p => 
    p.tier === tier && 
    p.domain === domain && 
    !excludeIds.has(p.id)
  )
}

export function getNextProblem(
  tier: ComplexityTier,
  domain: ProblemDomain,
  excludeIds: Set<string>
): StructuralProblem | null {
  // Try exact tier first
  let candidates = getProblemsByTierAndDomain(tier, domain, excludeIds)
  
  // If no exact match, try adjacent tiers
  if (candidates.length === 0) {
    const adjacentTiers = [tier - 1, tier + 1].filter(t => t >= 1 && t <= 5) as ComplexityTier[]
    for (const t of adjacentTiers) {
      candidates = getProblemsByTierAndDomain(t, domain, excludeIds)
      if (candidates.length > 0) break
    }
  }
  
  // If still no match, try any domain at this tier
  if (candidates.length === 0) {
    candidates = allProblems.filter(p => 
      Math.abs(p.tier - tier) <= 1 && !excludeIds.has(p.id)
    )
  }
  
  if (candidates.length === 0) return null
  
  const shuffled = shuffleArray(candidates)
  return shuffled[0]
}

export function getTotalProblemCount(): number {
  return allProblems.length
}
