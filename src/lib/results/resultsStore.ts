// 成绩存储工具
import type { GameResult } from '@/types/results'

const STORAGE_KEY = 'daryn_results'

/**
 * 获取所有结果
 */
export function getResults(): GameResult[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return []
    }

    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) {
      return []
    }

    // 验证并过滤无效数据
    return parsed.filter((item): item is GameResult => {
      return (
        typeof item === 'object' &&
        item !== null &&
        typeof item.gameId === 'string' &&
        typeof item.domain === 'string' &&
        typeof item.correct === 'number' &&
        typeof item.total === 'number' &&
        typeof item.accuracy === 'number' &&
        typeof item.createdAt === 'string' &&
        item.correct >= 0 &&
        item.total > 0 &&
        item.accuracy >= 0 &&
        item.accuracy <= 100
      )
    })
  } catch (error) {
    console.error('[ResultsStore] Failed to parse results:', error)
    return []
  }
}

/**
 * 添加结果
 */
export function addResult(result: GameResult): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const existing = getResults()
    
    // 去重：如果相同 gameId 和 createdAt 已存在，则替换
    const filtered = existing.filter(
      r => !(r.gameId === result.gameId && r.createdAt === result.createdAt)
    )
    
    const updated = [...filtered, result]
    
    // 限制存储数量（保留最近100条）
    const limited = updated.slice(-100)
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limited))
  } catch (error) {
    console.error('[ResultsStore] Failed to save result:', error)
  }
}

/**
 * 清除所有结果
 */
export function clearResults(): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('[ResultsStore] Failed to clear results:', error)
  }
}
