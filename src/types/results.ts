// 游戏结果类型定义
export type GameResult = {
  gameId: string
  domain: string // 'math' | 'logic' | 'kaz-lang' | 'kaz-lit' | 'english' | 'science' | 'alem' | string
  correct: number
  total: number
  accuracy: number
  timeSpentSec?: number
  createdAt: string
}

