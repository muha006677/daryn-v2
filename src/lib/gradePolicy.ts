// Біріздендірілген сынып саясаты — барлық генераторлар үшін

export type GradePolicy = {
  grade: number
  math: {
    maxNumber: number
    ops: ('+' | '-' | '×' | '÷')[]
    allowTextProblems: boolean
    stepsHint: boolean
    allowFractions: boolean
    multiStep: boolean
  }
  kazakh: {
    sentenceLength: 'өте қысқа' | 'қысқа' | 'орта'
    focus: string[]
    allowComplexSentences: boolean
  }
  world: {
    questionStyle: 'суретті елестету' | 'қарапайым факт' | 'себеп-салдар жеңіл'
    complexity: 'өте жеңіл' | 'жеңіл' | 'орта'
  }
  memory: {
    itemsCount: number
    timePressure: 'төмен' | 'орта'
    allowSequences: boolean
  }
  english: {
    vocabularyLevel: 'өте жеңіл' | 'жеңіл' | 'орта'
    maxWords: number
  }
}

const gradePolicies: Record<number, GradePolicy> = {
  1: {
    grade: 1,
    math: {
      maxNumber: 20,
      ops: ['+', '-'],
      allowTextProblems: false,
      stepsHint: true,
      allowFractions: false,
      multiStep: false,
    },
    kazakh: {
      sentenceLength: 'өте қысқа',
      focus: ['дыбыс', 'буын', 'қарапайым сөз', 'әріптер'],
      allowComplexSentences: false,
    },
    world: {
      questionStyle: 'суретті елестету',
      complexity: 'өте жеңіл',
    },
    memory: {
      itemsCount: 3,
      timePressure: 'төмен',
      allowSequences: false,
    },
    english: {
      vocabularyLevel: 'өте жеңіл',
      maxWords: 3,
    },
  },
  2: {
    grade: 2,
    math: {
      maxNumber: 50,
      ops: ['+', '-'],
      allowTextProblems: true,
      stepsHint: true,
      allowFractions: false,
      multiStep: false,
    },
    kazakh: {
      sentenceLength: 'қысқа',
      focus: ['қысқа сөйлем', 'буындар', 'қарапайым сөздер'],
      allowComplexSentences: false,
    },
    world: {
      questionStyle: 'қарапайым факт',
      complexity: 'жеңіл',
    },
    memory: {
      itemsCount: 4,
      timePressure: 'төмен',
      allowSequences: true,
    },
    english: {
      vocabularyLevel: 'өте жеңіл',
      maxWords: 4,
    },
  },
  3: {
    grade: 3,
    math: {
      maxNumber: 100,
      ops: ['+', '-', '×'],
      allowTextProblems: true,
      stepsHint: false,
      allowFractions: false,
      multiStep: false,
    },
    kazakh: {
      sentenceLength: 'қысқа',
      focus: ['сөз таптары жеңіл', 'қысқа мәтін', 'мақал жеңіл'],
      allowComplexSentences: false,
    },
    world: {
      questionStyle: 'қарапайым факт',
      complexity: 'жеңіл',
    },
    memory: {
      itemsCount: 5,
      timePressure: 'орта',
      allowSequences: true,
    },
    english: {
      vocabularyLevel: 'жеңіл',
      maxWords: 5,
    },
  },
  4: {
    grade: 4,
    math: {
      maxNumber: 1000,
      ops: ['+', '-', '×', '÷'],
      allowTextProblems: true,
      stepsHint: false,
      allowFractions: false,
      multiStep: true,
    },
    kazakh: {
      sentenceLength: 'орта',
      focus: ['сөйлем түрлері жеңіл', 'мақал', 'қысқа мәтін'],
      allowComplexSentences: true,
    },
    world: {
      questionStyle: 'себеп-салдар жеңіл',
      complexity: 'орта',
    },
    memory: {
      itemsCount: 6,
      timePressure: 'орта',
      allowSequences: true,
    },
    english: {
      vocabularyLevel: 'жеңіл',
      maxWords: 6,
    },
  },
  5: {
    grade: 5,
    math: {
      maxNumber: 1000,
      ops: ['+', '-', '×', '÷'],
      allowTextProblems: true,
      stepsHint: false,
      allowFractions: true,
      multiStep: true,
    },
    kazakh: {
      sentenceLength: 'орта',
      focus: ['қысқа мәтінмен жұмыс', 'мақал', 'сөз таптары'],
      allowComplexSentences: true,
    },
    world: {
      questionStyle: 'себеп-салдар жеңіл',
      complexity: 'орта',
    },
    memory: {
      itemsCount: 7,
      timePressure: 'орта',
      allowSequences: true,
    },
    english: {
      vocabularyLevel: 'орта',
      maxWords: 7,
    },
  },
  6: {
    grade: 6,
    math: {
      maxNumber: 10000,
      ops: ['+', '-', '×', '÷'],
      allowTextProblems: true,
      stepsHint: false,
      allowFractions: true,
      multiStep: true,
    },
    kazakh: {
      sentenceLength: 'орта',
      focus: ['орташа ұзын сөйлем', 'шағын мәтін', 'мақал', 'фразеологизм жеңіл'],
      allowComplexSentences: true,
    },
    world: {
      questionStyle: 'себеп-салдар жеңіл',
      complexity: 'орта',
    },
    memory: {
      itemsCount: 8,
      timePressure: 'орта',
      allowSequences: true,
    },
    english: {
      vocabularyLevel: 'орта',
      maxWords: 8,
    },
  },
}

/**
 * Сынып бойынша деңгей саясатын алу
 */
export function getGradePolicy(grade: number): GradePolicy {
  const normalizedGrade = Math.max(1, Math.min(6, Math.floor(grade)))
  return gradePolicies[normalizedGrade] || gradePolicies[3]
}

/**
 * AI промпт үшін деңгей сипаттамасын қысқа түрде қайтару
 */
export function getGradePolicyDescription(grade: number): string {
  const policy = getGradePolicy(grade)
  
  return `Сынып: ${grade}-сынып

МАТЕМАТИКА:
- Сан диапазоны: 1-ден ${policy.math.maxNumber}-ға дейін
- Операциялар: ${policy.math.ops.join(', ')}
- ${policy.math.allowTextProblems ? 'Мәтіндік есептер рұқсат етілген' : 'Тек сандық есептер'}
- ${policy.math.allowFractions ? 'Бөлшектер рұқсат етілген (жеңіл)' : 'Бөлшектер рұқсат етілмейді'}
- ${policy.math.multiStep ? 'Көпқадамды есептер рұқсат етілген' : 'Бірқадамды есептер'}

ҚАЗАҚ ТІЛІ:
- Сөйлем ұзындығы: ${policy.kazakh.sentenceLength}
- Бағытталу: ${policy.kazakh.focus.join(', ')}
- ${policy.kazakh.allowComplexSentences ? 'Күрделі сөйлемдер рұқсат етілген' : 'Қарапайым сөйлемдер'}

ДҮНИЕТАНУ:
- Стиль: ${policy.world.questionStyle}
- Күрделілік: ${policy.world.complexity}

ЕСТЕ САҚТАУ:
- Элемент саны: ${policy.memory.itemsCount}
- Уақыт қысымы: ${policy.memory.timePressure}
- ${policy.memory.allowSequences ? 'Тізбектер рұқсат етілген' : 'Жеке элементтер'}

АҒЫЛШЫН ТІЛІ:
- Сөздік деңгейі: ${policy.english.vocabularyLevel}
- Максималды сөз саны: ${policy.english.maxWords}`
}

/**
 * Random nonce генерациялау (әр генерацияны әртүрлі ету үшін)
 */
export function generateSessionNonce(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36).substring(5, 9)
}
