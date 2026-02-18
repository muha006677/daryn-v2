// Micro Tests - Scoring and Report Generation

import type {
  MicroTestType,
  MicroTestAnswer,
  MicroTestResult,
  SkillLevel,
  MicroTestConfig,
} from './types'
import { MICRO_TEST_CONFIGS, getSkillLevel, getSkillLabel } from './types'

export function calculateMicroTestResult(
  testType: MicroTestType,
  answers: MicroTestAnswer[]
): MicroTestResult {
  const config = MICRO_TEST_CONFIGS.find(c => c.type === testType)!
  
  const totalQuestions = answers.length
  const correctAnswers = answers.filter(a => a.isCorrect).length
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0
  
  const totalTime = answers.reduce((acc, a) => acc + a.timeSpent, 0)
  const avgTimePerQuestion = totalQuestions > 0 ? totalTime / totalQuestions : 0
  
  const skillLevel = getSkillLevel(accuracy)
  const skillLabel = getSkillLabel(skillLevel)
  
  const feedback = generateFeedback(testType, accuracy, avgTimePerQuestion, skillLevel)
  const strengths = generateStrengths(testType, answers, accuracy)
  const improvements = generateImprovements(testType, answers, accuracy, avgTimePerQuestion)
  
  return {
    testType,
    testName: config.name,
    totalQuestions,
    correctAnswers,
    accuracy: Math.round(accuracy * 10) / 10,
    avgTimePerQuestion: Math.round(avgTimePerQuestion * 10) / 10,
    totalTime: Math.round(totalTime),
    skillLevel,
    skillLabel,
    feedback,
    strengths,
    improvements,
  }
}

function generateFeedback(
  testType: MicroTestType,
  accuracy: number,
  avgTime: number,
  skillLevel: SkillLevel
): string {
  const config = MICRO_TEST_CONFIGS.find(c => c.type === testType)!
  
  if (skillLevel === 'high') {
    return `${config.name} бойынша жоғары нәтиже көрсеттіңіз. Сіздің ${config.skills.join(', ')} қабілеттеріңіз жақсы дамыған.`
  }
  
  if (skillLevel === 'medium') {
    return `${config.name} бойынша орташа нәтиже. Біраз жаттығу арқылы нәтижеңізді жақсарта аласыз.`
  }
  
  return `${config.name} бойынша қосымша жаттығу қажет. Күнделікті тәжірибе арқылы дағдыларыңызды дамытыңыз.`
}

function generateStrengths(
  testType: MicroTestType,
  answers: MicroTestAnswer[],
  accuracy: number
): string[] {
  const strengths: string[] = []
  
  if (accuracy >= 80) {
    strengths.push('Жоғары дәлдік деңгейі')
  }
  
  const fastCorrect = answers.filter(a => a.isCorrect && a.timeSpent < 20).length
  if (fastCorrect >= answers.length * 0.5) {
    strengths.push('Жылдам және дұрыс жауап беру')
  }
  
  const lastThird = answers.slice(-Math.ceil(answers.length / 3))
  const lastThirdCorrect = lastThird.filter(a => a.isCorrect).length / lastThird.length
  if (lastThirdCorrect >= 0.8) {
    strengths.push('Соңына дейін жоғары концентрация')
  }
  
  if (strengths.length === 0) {
    strengths.push('Тестті аяғына дейін орындадыңыз')
  }
  
  return strengths
}

function generateImprovements(
  testType: MicroTestType,
  answers: MicroTestAnswer[],
  accuracy: number,
  avgTime: number
): string[] {
  const improvements: string[] = []
  
  if (accuracy < 60) {
    improvements.push('Негізгі түсініктерді қайта қарау')
  }
  
  if (accuracy < 80) {
    improvements.push('Күнделікті жаттығу жасау')
  }
  
  if (avgTime > 40) {
    improvements.push('Жауап беру жылдамдығын арттыру')
  }
  
  const wrongStreak = findLongestWrongStreak(answers)
  if (wrongStreak >= 3) {
    improvements.push('Қиын сұрақтарда сабырлы болу')
  }
  
  if (improvements.length === 0) {
    improvements.push('Нәтижені сақтау және тұрақты жаттығу')
  }
  
  return improvements
}

function findLongestWrongStreak(answers: MicroTestAnswer[]): number {
  let maxStreak = 0
  let currentStreak = 0
  
  for (const answer of answers) {
    if (!answer.isCorrect) {
      currentStreak++
      maxStreak = Math.max(maxStreak, currentStreak)
    } else {
      currentStreak = 0
    }
  }
  
  return maxStreak
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
