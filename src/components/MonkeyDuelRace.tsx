'use client'

import { useEffect, useState } from 'react'

interface MonkeyDuelRaceProps {
  teamAScore: number
  teamBScore: number
  targetLead?: number
}

export default function MonkeyDuelRace({
  teamAScore,
  teamBScore,
  targetLead = 5,
}: MonkeyDuelRaceProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [winner, setWinner] = useState<'A' | 'B' | null>(null)

  // 计算分数差和进度
  const diff = teamAScore - teamBScore
  const absDiff = Math.abs(diff)
  const progress = Math.min(absDiff / targetLead, 1)
  
  // 计算猴子位置（0-100%）
  // 中心为 50%，Team A 起始在中心偏左（40%），Team B 起始在中心偏右（60%）
  const centerPosition = 50
  const teamAStartPosition = 40 // Team A 起始位置（中心偏左）
  const teamBStartPosition = 60 // Team B 起始位置（中心偏右）
  
  // Team A: 如果领先（diff > 0），向右移动（向 Team B 的家）
  // Team B: 如果领先（diff < 0），向左移动（向 Team A 的家）
  const teamAPosition = teamAStartPosition + (diff > 0 ? progress * 50 : 0)
  const teamBPosition = teamBStartPosition - (diff < 0 ? progress * 50 : 0)

  // 检查胜利条件
  useEffect(() => {
    if (progress >= 1) {
      if (diff > 0) {
        setWinner('A')
      } else if (diff < 0) {
        setWinner('B')
      }
    } else {
      setWinner(null)
    }
  }, [progress, diff])

  // 动画触发
  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 500)
    return () => clearTimeout(timer)
  }, [teamAScore, teamBScore])

  const isTeamALeading = diff > 0
  const isTeamBLeading = diff < 0

  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-8">
      {/* 胜利提示 */}
      {winner && (
        <div className="mb-6 text-center">
          <div className="inline-block bg-gradient-to-r from-amber-400 to-orange-500 text-white px-8 py-4 rounded-xl shadow-lg animate-pulse">
            <div className="text-4xl mb-2">🎉</div>
            <div className="text-2xl font-bold">
              {winner === 'A' ? '1-топ жеңді!' : '2-топ жеңді!'}
            </div>
          </div>
        </div>
      )}

      {/* 赛道容器 */}
      <div className="relative">
        {/* 赛道背景 */}
        <div className="relative h-32 bg-gradient-to-r from-green-100 via-amber-100 to-blue-100 rounded-xl border-2 border-slate-300 overflow-hidden">
          {/* 赛道中心线 */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-400 transform -translate-x-1/2"></div>
          
          {/* 赛道标记 */}
          <div className="absolute inset-0 flex items-center justify-between px-4">
            {[0, 25, 50, 75, 100].map((mark) => (
              <div
                key={mark}
                className="w-1 h-full bg-slate-300 opacity-50"
                style={{ left: `${mark}%` }}
              ></div>
            ))}
          </div>

          {/* Team A 的家（左侧） */}
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
            <div className="text-5xl">🏠</div>
            <div className="text-xs font-bold text-green-700 mt-1 text-center">1-топ</div>
          </div>

          {/* Team B 的家（右侧） */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <div className="text-5xl">🏠</div>
            <div className="text-xs font-bold text-blue-700 mt-1 text-center">2-топ</div>
          </div>

          {/* Team A 猴子 */}
          <div
            className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-500 ease-out"
            style={{
              left: `${teamAPosition}%`,
              transform: `translate(-50%, -50%) ${isTeamALeading ? 'scale(1.2)' : 'scale(1)'}`,
            }}
          >
            <div
              className={`text-6xl transition-all duration-300 ${
                isTeamALeading ? 'drop-shadow-lg' : ''
              } ${isAnimating ? 'animate-bounce' : ''}`}
            >
              🐵
            </div>
            <div className="text-xs font-bold text-green-700 mt-1 text-center whitespace-nowrap">
              1-топ ({teamAScore})
            </div>
          </div>

          {/* Team B 猴子 */}
          <div
            className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-500 ease-out"
            style={{
              left: `${teamBPosition}%`,
              transform: `translate(-50%, -50%) ${isTeamBLeading ? 'scale(1.2)' : 'scale(1)'}`,
            }}
          >
            <div
              className={`text-6xl transition-all duration-300 ${
                isTeamBLeading ? 'drop-shadow-lg' : ''
              } ${isAnimating ? 'animate-bounce' : ''}`}
            >
              🐵
            </div>
            <div className="text-xs font-bold text-blue-700 mt-1 text-center whitespace-nowrap">
              2-топ ({teamBScore})
            </div>
          </div>
        </div>

        {/* 分数显示 */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className={`text-center p-4 rounded-xl border-2 ${
            isTeamALeading ? 'bg-green-50 border-green-300' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="text-sm font-medium text-slate-600 mb-1">1-топ</div>
            <div className="text-3xl font-bold text-green-600">{teamAScore}</div>
          </div>
          <div className={`text-center p-4 rounded-xl border-2 ${
            isTeamBLeading ? 'bg-blue-50 border-blue-300' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="text-sm font-medium text-slate-600 mb-1">2-топ</div>
            <div className="text-3xl font-bold text-blue-600">{teamBScore}</div>
          </div>
        </div>

        {/* 进度条 */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Айырмашылық: {Math.abs(diff)}</span>
            <span>Мақсат: {targetLead}</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                diff > 0 ? 'bg-green-500' : diff < 0 ? 'bg-blue-500' : 'bg-slate-400'
              }`}
              style={{ width: `${progress * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

