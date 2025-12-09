// Contest үшін local fallback банктер (дарынды форматы)
import { getGradePolicy } from './gradePolicy'
import { Question } from './gameBanks'

type ContestSubType = 
  | 'logic-pro'
  | 'math-ultra'
  | 'poem-complete'
  | 'essay-master'
  | 'rapid-retell'
  | 'memory-pro'

// Логика PRO - жоғары деңгейлі логикалық тапсырмалар
export function getLogicProQuestions(grade: number): Question[] {
  const items: Question[] = []
  
  if (grade <= 2) {
    items.push(
      { q: '2, 4, 8, 16, ? - келесі сан не?', a: '32' },
      { q: 'А, Б, В, Г, Д, ? - келесі әріп не?', a: 'Е' },
      { q: '1, 3, 6, 10, 15, ? - келесі сан не?', a: '21' },
      { q: 'Қысқа, Орта, Ұзын, ? - келесі сөз не?', a: 'Өте ұзын' },
      { q: '2, 5, 10, 17, ? - келесі сан не?', a: '26' },
      { q: 'Алма, Алмұрт, Шие, ? - келесі жеміс не?', a: 'Жүзім' },
      { q: '5, 10, 20, 40, ? - келесі сан не?', a: '80' },
      { q: 'Бірінші, Екінші, Үшінші, ? - келесі сөз не?', a: 'Төртінші' },
    )
  } else if (grade <= 4) {
    items.push(
      { q: '3, 7, 15, 31, ? - келесі сан не?', a: '63' },
      { q: '1, 4, 9, 16, 25, ? - келесі сан не?', a: '36' },
      { q: '5, 11, 23, 47, ? - келесі сан не?', a: '95' },
      { q: 'Қыс, Көктем, Жаз, Күз - осы тізбектегі қайсысы басқаша?', a: 'Ешқайсысы - барлығы мезгілдер' },
      { q: '2, 6, 12, 20, 30, ? - келесі сан не?', a: '42' },
      { q: 'Егер А>Б, Б>В болса, А>В ме?', a: 'Иә' },
      { q: '10, 20, 40, 80, ? - келесі сан не?', a: '160' },
      { q: '1, 2, 4, 7, 11, ? - келесі сан не?', a: '16' },
    )
  } else {
    items.push(
      { q: '2, 4, 8, 16, 32, 64, ? - келесі сан не?', a: '128' },
      { q: '1, 1, 2, 3, 5, 8, ? - келесі сан не?', a: '13' },
      { q: '3, 9, 27, 81, ? - келесі сан не?', a: '243' },
      { q: 'Егер барлық алма қызыл, кейбір алма жеміс болса, кейбір жеміс қызыл ма?', a: 'Иә' },
      { q: '5, 25, 125, ? - келесі сан не?', a: '625' },
      { q: '1, 4, 9, 16, 25, 36, ? - келесі сан не?', a: '49' },
      { q: 'Егер А=Б+В, Б>В болса, А>2В ме?', a: 'Иә' },
      { q: '2, 5, 11, 23, 47, ? - келесі сан не?', a: '95' },
    )
  }

  while (items.length < 10) {
    items.push({ q: '—', a: '—' })
  }

  return items.slice(0, 10)
}

// Математика ULTRA - супер жоғары деңгей
export function getMathUltraQuestions(grade: number): Question[] {
  const policy = getGradePolicy(grade)
  const maxNum = policy.math.maxNumber
  const items: Question[] = []
  
  if (grade <= 2) {
    items.push(
      { q: '25 + 35 - 10 = ?', a: '50' },
      { q: '50 - 15 + 20 = ?', a: '55' },
      { q: '3 × 5 + 5 = ?', a: '20' },
      { q: '30 + 40 - 60 = ?', a: '10' },
      { q: '4 × 3 - 8 = ?', a: '4' },
      { q: '60 - 25 + 15 = ?', a: '50' },
      { q: '2 × 8 + 4 = ?', a: '20' },
      { q: '45 + 25 - 30 = ?', a: '40' },
    )
  } else if (grade <= 4) {
    items.push(
      { q: '125 + 75 - 50 = ?', a: '150' },
      { q: '6 × 8 + 12 = ?', a: '60' },
      { q: '200 - 75 + 125 = ?', a: '250' },
      { q: '9 × 7 - 23 = ?', a: '40' },
      { q: '150 + 250 - 100 = ?', a: '300' },
      { q: '8 × 6 + 24 = ?', a: '72' },
      { q: '500 - 200 + 150 = ?', a: '450' },
      { q: '7 × 9 - 18 = ?', a: '45' },
    )
  } else {
    items.push(
      { q: '234 + 456 - 189 = ?', a: '501' },
      { q: '12 × 15 + 45 = ?', a: '225' },
      { q: '789 - 234 + 123 = ?', a: '678' },
      { q: '18 × 7 - 56 = ?', a: '70' },
      { q: '456 + 678 - 234 = ?', a: '900' },
      { q: '15 × 12 + 30 = ?', a: '210' },
      { q: '987 - 456 + 234 = ?', a: '765' },
      { q: '20 × 8 - 60 = ?', a: '100' },
    )
  }

  while (items.length < 10) {
    items.push({ q: '—', a: '—' })
  }

  return items.slice(0, 10)
}

// Өлеңді толықтыр
export function getPoemCompleteQuestions(grade: number): Question[] {
  const items: Question[] = []
  
  if (grade <= 2) {
    items.push(
      { 
        q: 'Балапан біздің үйде,\nҚызық көрінеді.\n?', 
        a: 'Қауырсыны өте әдемі,\nКөңілі қуанышты.',
        meta: { lines: ['Балапан біздің үйде,', 'Қызық көрінеді.'] }
      },
      { 
        q: 'Жаз келді, күн жарқырап,\nБіз ойнаймыз бақшада.\n?', 
        a: 'Гүлдер ашылып тұр,\nТабиғат қуанады.',
        meta: { lines: ['Жаз келді, күн жарқырап,', 'Біз ойнаймыз бақшада.'] }
      },
      { 
        q: 'Қыс келді, қар жауады,\nБіз үйде отырамыз.\n?', 
        a: 'Ыстық шай ішіп,\nКітап оқимыз.',
        meta: { lines: ['Қыс келді, қар жауады,', 'Біз үйде отырамыз.'] }
      },
    )
  } else if (grade <= 4) {
    items.push(
      { 
        q: 'Қазақстан - ата мекенім,\nҚуаныш қосып өмірге.\n?', 
        a: 'Таулар мен далалар,\nӘдемі өлкем екен.',
        meta: { lines: ['Қазақстан - ата мекенім,', 'Қуаныш қосып өмірге.'] }
      },
      { 
        q: 'Мектеп бізге білім береді,\nДос-жаран табамыз.\n?', 
        a: 'Күнделікті оқып,\nБолашаққа дайындаламыз.',
        meta: { lines: ['Мектеп бізге білім береді,', 'Дос-жаран табамыз.'] }
      },
      { 
        q: 'Ана мен әке - ең қымбат,\nОлар бізді сүйеді.\n?', 
        a: 'Қамқорлықпен қорғайды,\nЕшқашан тастамайды.',
        meta: { lines: ['Ана мен әке - ең қымбат,', 'Олар бізді сүйеді.'] }
      },
    )
  } else {
    items.push(
      { 
        q: 'Отан деген не деген сөз?\nОл біздің барлығымыз.\n?', 
        a: 'Тарихымыз, тіліміз,\nҚазақтың жұртымыз.',
        meta: { lines: ['Отан деген не деген сөз?', 'Ол біздің барлығымыз.'] }
      },
      { 
        q: 'Білім деген байлық екен,\nОқыған адам күші жоғары.\n?', 
        a: 'Кітаппен дос болып,\nӨмір жолын табады.',
        meta: { lines: ['Білім деген байлық екен,', 'Оқыған адам күші жоғары.'] }
      },
      { 
        q: 'Табиғат біздің досымыз,\nОны қорғау керек.\n?', 
        a: 'Ағаш отырғызып, тазартып,\nЖерімізді сақтау.',
        meta: { lines: ['Табиғат біздің досымыз,', 'Оны қорғау керек.'] }
      },
    )
  }

  while (items.length < 10) {
    items.push({ 
      q: '—\n—\n?', 
      a: '—', 
      meta: { lines: ['—', '—'] } 
    })
  }

  return items.slice(0, 10)
}

// Эссе шебері
export function getEssayMasterQuestions(grade: number): Question[] {
  const items: Question[] = []
  
  const topics = grade <= 2
    ? [
        'Менің ең жақсы досым',
        'Менің үй жануарым',
        'Мектептегі ең қызықты сабақ',
        'Жазда не істедім',
        'Менің отбасым',
        'Менің сүйікті ойыным',
        'Менің үйім',
        'Менің мектебім',
      ]
    : grade <= 4
    ? [
        'Қазақстан - менің ата мекенім',
        'Білім деген не?',
        'Достық неге маңызды?',
        'Табиғатты қорғау',
        'Менің кәсіптік арманым',
        'Кітап оқу неге керек?',
        'Мектептегі ең жақсы күнім',
        'Менің бауырларым',
      ]
    : [
        'Отансүйгіштік деген не?',
        'Болашаққа арналған жоспарым',
        'Білім мен тәрбие',
        'Қазақ тілі мен мәдениет',
        'Жастардың әлеуметтік жауапкершілігі',
        'Спорт мен денсаулық',
        'Технология мен өмір',
        'Әдебиет пен өнер',
      ]

  topics.forEach((topic, idx) => {
    items.push({
      q: topic,
      a: `Эссе тақырыбы: "${topic}". Оқушы ${grade <= 2 ? '3-4' : grade <= 4 ? '5-7' : '8-10'} сөйлемнен эссе жазады.`,
      meta: { minSentences: grade <= 2 ? 3 : grade <= 4 ? 5 : 8, maxSentences: grade <= 2 ? 4 : grade <= 4 ? 7 : 10 }
    })
  })

  while (items.length < 10) {
    items.push({ q: '—', a: '—' })
  }

  return items.slice(0, 10)
}

// Жедел мазмұндама
export function getRapidRetellQuestions(grade: number): Question[] {
  const items: Question[] = []
  
  const texts = grade <= 2
    ? [
        { text: 'Алма ағашта өседі. Алма қызыл, жасыл, сары болуы мүмкін. Алма дәмді және пайдалы.', time: 60 },
        { text: 'Қыс келді. Қар жауды. Біз қарбұршақ ойнадық. Қыс өте қызық.', time: 60 },
        { text: 'Мектепте оқимыз. Мұғалімдер бізге білім береді. Дос-жаран табамыз.', time: 60 },
      ]
    : grade <= 4
    ? [
        { text: 'Қазақстан үлкен ел. Мұнда көп таулар мен көлдер бар. Қазақ халқы мейірімді. Біздің тіліміз қазақ тілі.', time: 90 },
        { text: 'Кітап оқу өте пайдалы. Кітап бізге білім береді. Кітап оқыған адам ақылды. Кітаппен дос болған жөн.', time: 90 },
        { text: 'Спорт денсаулық үшін керек. Күнделікті жаттығу денсаулықты сақтайды. Спортшы адам күшті болады.', time: 90 },
      ]
    : [
        { text: 'Қазақстан - орталық Азиядағы ерекше мемлекет. Біздің ел бай тарихқа ие. Абай, Шоқан, Мұхтар секілді ұлы тұлғалар өмір сүрген. Қазақ тілі - біздің ана тіліміз. Оны құрметтеу мен дамыту біздің міндетіміз.', time: 120 },
        { text: 'Білім - заманауи өмірде ең маңызды ресурс. Оқыған адам өзінің болашағын құра алады. Білім өмір бойы жалғасатын үрдіс. Әрбір күн жаңа нәрсені үйренуге мүмкіндік береді.', time: 120 },
        { text: 'Табиғат бізге өмір береді. Ауа, су, топырақ - барлығы қажет. Табиғатты қорғау біздің міндетіміз. Жасыл ағаштар отырғызу, тазалықты сақтау - әр адамның ісі.', time: 120 },
      ]

  texts.forEach((item, idx) => {
    items.push({
      q: item.text,
      a: `Мәтін мазмұндамасы. Оқушы ${item.time} секунд ішінде мәтінді оқып, мазмұндап береді.`,
      meta: { timeLimit: item.time }
    })
  })

  while (items.length < 10) {
    items.push({ q: '—', a: '—', meta: { timeLimit: 60 } })
  }

  return items.slice(0, 10)
}

// Есте сақтау PRO
export function getMemoryProQuestions(grade: number): Question[] {
  const policy = getGradePolicy(grade)
  const memCount = policy.memory.itemsCount + 2 // Дарынды формат - қосымша күрделі
  
  const items: Question[] = []
  const sequences: string[][] = []
  
  // Генерируем sequences
  for (let i = 0; i < 10; i++) {
    const seq: string[] = []
    const categories = ['сандар', 'әріптер', 'жануарлар', 'жемістер', 'түстер', 'күндер']
    const category = categories[i % categories.length]
    
    if (category === 'сандар') {
      for (let j = 0; j < memCount; j++) {
        seq.push(String(10 + j * 5 + Math.floor(Math.random() * 5)))
      }
    } else if (category === 'әріптер') {
      const letters = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З']
      for (let j = 0; j < memCount; j++) {
        seq.push(letters[j % letters.length])
      }
    } else if (category === 'жануарлар') {
      const animals = ['аслан', 'аю', 'қасқыр', 'түлкі', 'бұлан', 'құлан', 'қоян', 'тиін']
      for (let j = 0; j < memCount; j++) {
        seq.push(animals[j % animals.length])
      }
    } else if (category === 'жемістер') {
      const fruits = ['алма', 'алмұрт', 'шие', 'жүзім', 'қарбыз', 'қауын', 'ананас', 'банан']
      for (let j = 0; j < memCount; j++) {
        seq.push(fruits[j % fruits.length])
      }
    } else if (category === 'түстер') {
      const colors = ['қызыл', 'көк', 'сары', 'жасыл', 'қоңыр', 'қара', 'ақ', 'қызғылт']
      for (let j = 0; j < memCount; j++) {
        seq.push(colors[j % colors.length])
      }
    } else {
      const days = ['Дүйсенбі', 'Сейсенбі', 'Сәрсенбі', 'Бейсенбі', 'Жұма', 'Сенбі', 'Жексенбі']
      for (let j = 0; j < memCount; j++) {
        seq.push(days[j % days.length])
      }
    }
    
    sequences.push(seq)
  }
  
  sequences.forEach((seq, idx) => {
    items.push({
      q: seq.join(', '),
      a: `${seq.length} элемент`,
      meta: { items: seq, count: seq.length }
    })
  })

  return items.slice(0, 10)
}

// Ортақ функция
export function getContestLocalFallback(subType: ContestSubType, grade: number): Question[] {
  switch (subType) {
    case 'logic-pro':
      return getLogicProQuestions(grade)
    case 'math-ultra':
      return getMathUltraQuestions(grade)
    case 'poem-complete':
      return getPoemCompleteQuestions(grade)
    case 'essay-master':
      return getEssayMasterQuestions(grade)
    case 'rapid-retell':
      return getRapidRetellQuestions(grade)
    case 'memory-pro':
      return getMemoryProQuestions(grade)
    default:
      return [{ q: '—', a: '—' }]
  }
}
