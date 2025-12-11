// 优势/弱势分析引擎
import type { GameResult } from '@/types/results'

export type StrengthReport = {
  topStrengths: { domain: string; score: number; evidence: string }[]
  weakAreas: { domain: string; score: number; evidence: string }[]
  summary: string
}

// Domain 名称映射
const DOMAIN_NAMES: Record<string, string> = {
  'math': 'Математика',
  'math_logic': 'Математика',
  'math_ultra': 'Математика',
  'logic': 'Логика',
  'logic-sprint': 'Логика',
  'kaz-lang': 'Қазақ тілі',
  'kaz_lang_lit': 'Қазақ тілі',
  'kaz_lang': 'Қазақ тілі',
  'kaz-lit': 'Қазақ әдебиеті',
  'kaz_lit': 'Қазақ әдебиеті',
  'kaz_poem': 'Қазақ әдебиеті',
  'kaz_essay': 'Қазақ әдебиеті',
  'english': 'English',
  'science': 'Жаратылыстану',
  'natural_science': 'Жаратылыстану',
  'alem': 'Әлемтану',
  'world_studies': 'Әлемтану',
  'world-quick': 'Әлемтану',
  'memory': 'Есте сақтау',
  'flash-memory': 'Есте сақтау',
  'reaction': 'Реакция',
  'reaction-light': 'Реакция',
  'reading': 'Оқу',
  'reading-mini': 'Оқу',
  'mixed': 'Аралас',
  'capture-flag': 'Ойын',
  'castle-siege': 'Ойын',
  'combo-rush': 'Ойын',
  'quick-judge': 'Ойын',
  'sentence-puzzle': 'Ойын',
}

/**
 * 获取 domain 的显示名称
 */
function getDomainName(domain: string): string {
  return DOMAIN_NAMES[domain] || domain
}

/**
 * 分析优势/弱势
 */
export function analyzeStrength(results: GameResult[]): StrengthReport {
  if (results.length === 0) {
    return {
      topStrengths: [],
      weakAreas: [],
      summary: 'Әлі жаттығу нәтижелері жоқ. Ойындарды ойнап, нәтижелерді жинаңыз.',
    }
  }

  // 按 domain 聚合
  const domainStats: Record<string, {
    totalCorrect: number
    totalQuestions: number
    totalAccuracy: number
    count: number
    totalTime: number
  }> = {}

  results.forEach(result => {
    if (!domainStats[result.domain]) {
      domainStats[result.domain] = {
        totalCorrect: 0,
        totalQuestions: 0,
        totalAccuracy: 0,
        count: 0,
        totalTime: 0,
      }
    }

    const stats = domainStats[result.domain]
    stats.totalCorrect += result.correct
    stats.totalQuestions += result.total
    stats.totalAccuracy += result.accuracy
    stats.count += 1
    if (result.timeSpentSec) {
      stats.totalTime += result.timeSpentSec
    }
  })

  // 计算每个 domain 的分数
  const domainScores: Array<{
    domain: string
    score: number
    accuracy: number
    volume: number
  }> = []

  Object.entries(domainStats).forEach(([domain, stats]) => {
    const avgAccuracy = stats.totalAccuracy / stats.count
    const volumeNormalized = Math.min(stats.totalQuestions / 30, 1) // 归一化到 0-1
    const score = avgAccuracy * 0.7 + volumeNormalized * 100 * 0.3

    domainScores.push({
      domain,
      score,
      accuracy: avgAccuracy,
      volume: stats.totalQuestions,
    })
  })

  // 排序
  domainScores.sort((a, b) => b.score - a.score)

  // Top 3 优势
  const topStrengths = domainScores.slice(0, 3).map(item => ({
    domain: getDomainName(item.domain),
    score: Math.round(item.score),
    evidence: item.accuracy >= 80
      ? 'Соңғы тапсырмаларда дәлдігі жоғары'
      : item.volume >= 20
      ? 'Көптеген тапсырмаларды орындады'
      : 'Жақсы нәтижелер көрсетті',
  }))

  // Bottom 2 弱势
  const weakAreas = domainScores.slice(-2).reverse().map(item => ({
    domain: getDomainName(item.domain),
    score: Math.round(item.score),
    evidence: item.accuracy < 60
      ? 'Дәлдікті арттыру қажет'
      : item.volume < 10
      ? 'Көбірек жаттығу қажет'
      : 'Дамытуды қажет етеді',
  }))

  // 生成摘要
  const totalGames = results.length
  const avgAccuracy = results.reduce((sum, r) => sum + r.accuracy, 0) / results.length
  const summary = `Барлығы ${totalGames} ойын ойнады. Орташа дәлдік: ${Math.round(avgAccuracy)}%.`

  return {
    topStrengths,
    weakAreas,
    summary,
  }
}

