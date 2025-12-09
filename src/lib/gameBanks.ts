// Ортақ ойындар үшін local fallback банктер
import { getGradePolicy } from './gradePolicy'

export type Question = { q: string; a?: string; meta?: any }

// Логикалық спринт - заңдылық табу
export function getLogicSprintQuestions(grade: number): Question[] {
  const policy = getGradePolicy(grade)
  
  const questions: Question[] = []
  
  if (grade <= 2) {
    questions.push(
      { q: '2, 4, 6, ? - келесі сан не?', a: '8' },
      { q: '5, 10, 15, ? - келесі сан не?', a: '20' },
      { q: '1, 3, 5, ? - келесі сан не?', a: '7' },
      { q: '3, 6, 9, ? - келесі сан не?', a: '12' },
      { q: '10, 20, 30, ? - келесі сан не?', a: '40' },
      { q: 'Қыс, Жаз, Күз, ? - келесі мезгіл не?', a: 'Көктем' },
      { q: 'Дүйсенбі, Сейсенбі, Сәрсенбі, ? - келесі күн не?', a: 'Бейсенбі' },
      { q: 'Қысқа, Ұзын, Төмен, ? - келесі сөз не?', a: 'Биік' },
    )
  } else if (grade <= 4) {
    questions.push(
      { q: '3, 6, 12, ? - келесі сан не?', a: '24' },
      { q: '10, 20, 30, 40, ? - келесі сан не?', a: '50' },
      { q: '1, 4, 9, 16, ? - келесі сан не?', a: '25' },
      { q: '5, 8, 11, 14, ? - келесі сан не?', a: '17' },
      { q: '2, 5, 8, 11, ? - келесі сан не?', a: '14' },
    )
  } else {
    questions.push(
      { q: '2, 6, 18, 54, ? - келесі сан не?', a: '162' },
      { q: '1, 2, 4, 8, ? - келесі сан не?', a: '16' },
      { q: '3, 9, 27, ? - келесі сан не?', a: '81' },
    )
  }

  while (questions.length < 10) {
    questions.push({ q: '—', a: '—' })
  }

  return questions.slice(0, 10)
}

// Жылдам есеп
export function getMentalMathQuestions(grade: number): Question[] {
  const policy = getGradePolicy(grade)
  const maxNum = policy.math.maxNumber
  const ops = policy.math.ops

  const questions: Question[] = []

  if (grade === 1) {
    questions.push(
      { q: '5 + 7 = ?', a: '12' },
      { q: '10 - 4 = ?', a: '6' },
      { q: '8 + 9 = ?', a: '17' },
      { q: '15 - 8 = ?', a: '7' },
      { q: '6 + 8 = ?', a: '14' },
      { q: '12 - 5 = ?', a: '7' },
      { q: '9 + 6 = ?', a: '15' },
      { q: '14 - 7 = ?', a: '7' },
    )
  } else if (grade === 2) {
    questions.push(
      { q: '25 + 18 = ?', a: '43' },
      { q: '40 - 15 = ?', a: '25' },
      { q: '30 + 25 = ?', a: '55' },
      { q: '45 - 20 = ?', a: '25' },
      { q: '35 + 15 = ?', a: '50' },
    )
  } else if (grade === 3) {
    questions.push(
      { q: '45 + 38 = ?', a: '83' },
      { q: '72 - 25 = ?', a: '47' },
      { q: '6 × 7 = ?', a: '42' },
      { q: '56 - 29 = ?', a: '27' },
      { q: '8 × 5 = ?', a: '40' },
    )
  } else if (grade === 4) {
    questions.push(
      { q: '256 + 189 = ?', a: '445' },
      { q: '500 - 237 = ?', a: '263' },
      { q: '12 × 8 = ?', a: '96' },
      { q: '72 ÷ 9 = ?', a: '8' },
      { q: '144 ÷ 12 = ?', a: '12' },
    )
  } else {
    questions.push(
      { q: '345 + 267 = ?', a: '612' },
      { q: '800 - 425 = ?', a: '375' },
      { q: '15 × 12 = ?', a: '180' },
      { q: '144 ÷ 12 = ?', a: '12' },
      { q: '25 × 16 = ?', a: '400' },
    )
  }

  while (questions.length < 10) {
    questions.push({ q: '—', a: '—' })
  }

  return questions.slice(0, 10)
}

// 1 минут сөйлеу - тақырыптар
export function getSpeechTopics(grade: number): Question[] {
  const topics: string[] = []
  
  if (grade <= 2) {
    topics.push(
      'Менің досум туралы',
      'Менің сүйікті жануарым',
      'Менің үйімдегі бөлме',
      'Менің сүйікті ойыным',
      'Менің отбасым',
      'Менің сүйікті кітабым',
      'Менің мектебім',
      'Менің демалысым',
    )
  } else if (grade <= 4) {
    topics.push(
      'Менің мектебім туралы',
      'Менің сүйікті кітабым',
      'Менің демалысымда не істейтінім',
      'Менің арманым',
      'Менің сүйікті пәнім',
      'Менің қалам туралы',
      'Менің досым',
      'Менің отбасым туралы',
    )
  } else {
    topics.push(
      'Қазақстанның табиғаты',
      'Болашақта кім болғым келеді',
      'Кітап оқудың маңызы',
      'Достық туралы',
      'Менің елім Қазақстан',
      'Спорттың маңызы',
      'Компьютер технологиясы',
      'Менің қызығушылығым',
    )
  }

  return topics.slice(0, 10).map(topic => ({ q: topic }))
}

// Оқу түсіну
export function getReadingMini(grade: number): Question[] {
  const texts: Question[] = []

  if (grade <= 2) {
    texts.push({
      q: 'Білге бір күні досымен саябақта ойнады. Олар доп лақтырды. Күн жылы еді.',
      a: '1. Саябақта\n2. Доп лақтырды',
      meta: { questions: ['Білге қайда ойнады?', 'Олар не істеді?'] }
    })
    texts.push({
      q: 'Апа нан пісірді. Ата шай құйды. Барлығы дайын еді.',
      a: '1. Нан пісірді\n2. Шай құйды',
      meta: { questions: ['Апа не істеді?', 'Ата не істеді?'] }
    })
  } else if (grade <= 4) {
    texts.push({
      q: 'Асханада апа мен ата бар. Олар тамақ дайындап жатыр. Апа нан пісіреді, ата шай құйды. Барлығы дайын.',
      a: '1. Апа мен ата\n2. Шай құйды',
      meta: { questions: ['Кім тамақ дайындап жатыр?', 'Ата не істеді?'] }
    })
    texts.push({
      q: 'Мектепте оқушылар сабақ оқиды. Мұғалім тақырыпты түсіндіреді. Барлығы тыңдайды.',
      a: '1. Сабақ оқиды\n2. Тақырыпты түсіндіреді',
      meta: { questions: ['Оқушылар не істейді?', 'Мұғалім не істейді?'] }
    })
  } else {
    texts.push({
      q: 'Қазақстанның астанасы Астана қаласы. Бұл қала үлкен және әдемі. Мұнда көптеген мұражайлар мен парктер бар.',
      a: '1. Астана\n2. Мұражайлар мен парктер',
      meta: { questions: ['Қазақстанның астанасы қай қала?', 'Астанада не көп?'] }
    })
  }

  return texts
}

// Flash Memory
export function getFlashMemory(grade: number): Question[] {
  const policy = getGradePolicy(grade)
  const count = policy.memory.itemsCount

  const sequences: Question[] = []

  if (grade <= 2) {
    sequences.push({ q: 'Алма, Алмұрт, Шие', a: '3 элемент' })
    sequences.push({ q: 'Қызыл, Сары, Жасыл', a: '3 элемент' })
    sequences.push({ q: '1, 2, 3', a: '3 элемент' })
    sequences.push({ q: 'А, Ә, Б', a: '3 элемент' })
  } else if (grade <= 4) {
    sequences.push({ q: 'Алма, Алмұрт, Шие, Жүзім, Қарбыз', a: '5 элемент' })
    sequences.push({ q: 'Қаңтар, Ақпан, Наурыз, Сәуір', a: '4 элемент' })
    sequences.push({ q: '5, 10, 15, 20, 25', a: '5 элемент' })
    sequences.push({ q: 'Алматы, Астана, Шымкент, Ақтөбе', a: '4 элемент' })
  } else {
    sequences.push({ q: 'Алматы, Астана, Шымкент, Ақтөбе, Қарағанды, Тараз, Орал', a: '7 элемент' })
    sequences.push({ q: 'Қызыл, Қызғылт сары, Сары, Жасыл, Көк, Күлгін, Көгілдір', a: '7 элемент' })
    sequences.push({ q: '1, 4, 9, 16, 25, 36, 49', a: '7 элемент' })
  }

  return sequences.slice(0, 10)
}

// Реакция "Бағдаршам" - ережелер
export function getReactionLight(): Question[] {
  return [
    { q: 'Қызыл түс', a: 'Тұрып қал' },
    { q: 'Сары түс', a: 'Баяу жүр' },
    { q: 'Жасыл түс', a: 'Жылдам қозғал' },
    { q: 'Көк түс', a: 'Секір' },
    { q: 'Ақ түс', a: 'Алқа соқ' },
  ]
}

// Story Cards - кейіпкер/орын/зат
export function getStoryCards(): Question[] {
  const cards: Question[] = []

  const characters = ['Білге', 'Асыл', 'Нұрлан', 'Айгүл', 'Ерлан']
  const places = ['Саябақ', 'Мектеп', 'Үй', 'Кітапхана', 'Тау']
  const objects = ['Кітап', 'Доп', 'Дәптер', 'Ручка', 'Ойыншық']

  for (let i = 0; i < 10; i++) {
    const char = characters[Math.floor(Math.random() * characters.length)]
    const place = places[Math.floor(Math.random() * places.length)]
    const obj = objects[Math.floor(Math.random() * objects.length)]
    
    cards.push({
      q: `${char}`,
      a: `${place} + ${obj}`,
      meta: { character: char, place, object: obj }
    })
  }

  return cards
}

// Spot Difference - айырмашылықтар
export function getSpotDifference(grade: number): Question[] {
  const questions: Question[] = [
    { q: 'Бірінші суретте 3 алма, екіншіде 2 алма. Айырмашылық не?', a: 'Алма саны' },
    { q: 'Бірінші суретте күн, екіншіде бұлт. Айырмашылық не?', a: 'Ауа райы' },
    { q: 'Бірінші суретте қызыл машина, екіншіде көк. Айырмашылық не?', a: 'Машина түсі' },
    { q: 'Бірінші суретте бала отырып, екіншіде тұрып. Айырмашылық не?', a: 'Позиция' },
    { q: 'Бірінші суретте 1 кісі, екіншіде 2 кісі. Айырмашылық не?', a: 'Кісі саны' },
  ]

  if (grade >= 4) {
    questions.push(
      { q: 'Бірінші суретте үй, екіншіде мектеп. Айырмашылық не?', a: 'Ғимарат түрі' },
      { q: 'Бірінші суретте күн, екіншіде түн. Айырмашылық не?', a: 'Уақыт' },
    )
  }

  while (questions.length < 10) {
    questions.push({ q: '—', a: '—' })
  }

  return questions.slice(0, 10)
}

// Дүниетану Quick Q&A
export function getWorldQuick(grade: number): Question[] {
  const questions: Question[] = [
    { q: 'Қазақстанның астанасы?', a: 'Астана' },
    { q: 'Қазақстанда қанша облыс бар?', a: '17 облыс' },
    { q: 'Жаз мезгілінде қандай айлар?', a: 'Маусым, Шілде, Тамыз' },
    { q: 'Қыс мезгілінде қандай айлар?', a: 'Желтоқсан, Қаңтар, Ақпан' },
    { q: 'Күннен күнге қанша сағат?', a: '24 сағат' },
  ]

  if (grade >= 3) {
    questions.push(
      { q: 'Қазақстанның ең үлкен өзені?', a: 'Ертіс' },
      { q: 'Қазақстанның ең үлкен қаласы?', a: 'Алматы' },
    )
  }

  if (grade >= 4) {
    questions.push(
      { q: 'Қазақстанның мемлекеттік рәміздері?', a: 'Ту, Елтаңба, Әнұран' },
      { q: 'Қазақстанмен шектесетін 3 ел?', a: 'Ресей, Қытай, Қырғызстан' },
    )
  }

  while (questions.length < 10) {
    questions.push({ q: '—', a: '—' })
  }

  return questions.slice(0, 10)
}

// Командалық стратегия
export function getTeamStrategy(grade: number): Question[] {
  const questions: Question[] = [
    { q: 'Егер сағат 3-те, 5 сағаттан кейін не болады?', a: '8 сағат' },
    { q: 'Егер 10 алманы 2 адамға бөлсек, әркімге қанша түседі?', a: '5 алма' },
    { q: 'Егер 1 сағатта 30 км жүрсе, 2 сағатта қанша?', a: '60 км' },
  ]

  if (grade >= 4) {
    questions.push(
      { q: 'Егер 100 теңгеден 30 теңге жұмсалса, қанша қалады?', a: '70 теңге' },
      { q: 'Егер 1 кг 1000 грамм болса, 2.5 кг қанша грамм?', a: '2500 грамм' },
      { q: 'Егер 1 метрде 100 см болса, 3 метрте қанша см?', a: '300 см' },
    )
  }

  if (grade >= 5) {
    questions.push(
      { q: 'Егер 1 сағатта 60 км жүрсе, 30 минутта қанша?', a: '30 км' },
      { q: 'Егер 1 литр 1000 мл болса, 2.5 литр қанша мл?', a: '2500 мл' },
    )
  }

  while (questions.length < 10) {
    questions.push({ q: '—', a: '—' })
  }

  return questions.slice(0, 10)
}
