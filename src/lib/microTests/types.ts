// Micro Tests - Types

export type MicroTestType =
  | 'logical_reaction'
  | 'calculation_accuracy'
  | 'pressure_decision'
  | 'text_analysis'
  | 'error_detection'

export type SkillLevel = 'high' | 'medium' | 'low'

export interface MicroTestQuestion {
  id: string
  prompt: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: number
  timeLimit: number  // seconds per question
}

export interface MicroTestConfig {
  type: MicroTestType
  name: string
  description: string
  icon: string
  questionCount: number
  totalTimeMinutes: number
  skills: string[]
}

export interface MicroTestAnswer {
  questionId: string
  selectedAnswer: number
  isCorrect: boolean
  timeSpent: number
}

export interface MicroTestResult {
  testType: MicroTestType
  testName: string
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  avgTimePerQuestion: number
  totalTime: number
  skillLevel: SkillLevel
  skillLabel: string
  feedback: string
  strengths: string[]
  improvements: string[]
}

export const MICRO_TEST_CONFIGS: MicroTestConfig[] = [
  {
    type: 'logical_reaction',
    name: 'Логикалық реакция сынағы',
    description: 'Логикалық заңдылықтарды жылдам анықтау және реакция жылдамдығын бағалау',
    icon: '🧠',
    questionCount: 8,
    totalTimeMinutes: 5,
    skills: ['Логикалық ойлау', 'Жылдам реакция', 'Заңдылықты тану'],
  },
  {
    type: 'calculation_accuracy',
    name: 'Есептеу дәлдігі',
    description: 'Арифметикалық операцияларды орындау дәлдігі мен жылдамдығын анықтау',
    icon: '🎯',
    questionCount: 8,
    totalTimeMinutes: 6,
    skills: ['Арифметика', 'Дәлдік', 'Назар'],
  },
  {
    type: 'pressure_decision',
    name: 'Қысым астындағы шешім қабылдау',
    description: 'Уақыт қысымында дұрыс шешім қабылдау қабілетін тексеру',
    icon: '⏱️',
    questionCount: 6,
    totalTimeMinutes: 5,
    skills: ['Стресс төзімділігі', 'Шешім қабылдау', 'Басымдылық анықтау'],
  },
  {
    type: 'text_analysis',
    name: 'Мәтінді талдау микро-модулі',
    description: 'Қысқа мәтіндерді талдау және негізгі ойды анықтау қабілеті',
    icon: '📄',
    questionCount: 6,
    totalTimeMinutes: 8,
    skills: ['Оқу түсіну', 'Талдау', 'Қорытынды жасау'],
  },
  {
    type: 'error_detection',
    name: 'Қате талдау жаттығуы',
    description: 'Есептеулер мен логикалық қателерді табу және түзету қабілеті',
    icon: '🔍',
    questionCount: 7,
    totalTimeMinutes: 7,
    skills: ['Қате табу', 'Сын ойлау', 'Тексеру'],
  },
]

export function getSkillLevel(accuracy: number): SkillLevel {
  if (accuracy >= 80) return 'high'
  if (accuracy >= 50) return 'medium'
  return 'low'
}

export function getSkillLabel(level: SkillLevel): string {
  switch (level) {
    case 'high': return 'Жоғары'
    case 'medium': return 'Орташа'
    case 'low': return 'Төмен'
  }
}

export function getSkillColor(level: SkillLevel): string {
  switch (level) {
    case 'high': return 'text-green-600'
    case 'medium': return 'text-yellow-600'
    case 'low': return 'text-red-600'
  }
}

export function getSkillBgColor(level: SkillLevel): string {
  switch (level) {
    case 'high': return 'bg-green-100'
    case 'medium': return 'bg-yellow-100'
    case 'low': return 'bg-red-100'
  }
}
