'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getTrueFalseQuestions, type TrueFalseQuestion } from '@/lib/newGamesBanks'
import { addResult } from '@/lib/results/resultsStore'
import type { GameResult } from '@/types/results'

type GameState = 'menu' | 'playing' | 'finished'
type GameMode = 'count' | 'time'

export default function QuickJudgePage() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [grade, setGrade] = useState<string>('2')
  const [gameMode, setGameMode] = useState<GameMode>('count')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [questions, setQuestions] = useState<TrueFalseQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [selectedAnswer, setSelectedAnswer] = useState<'Дұрыс' | 'Бұрыс' | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = gameMode === 'count' ? 20 : questions.length

  const startGame = async () => {
    setIsLoading(true)
    setError(null)
    setCurrentQuestionIndex(0)
    setScore(0)
    setCorrectCount(0)
    setTimeLeft(60)
    setSelectedAnswer(null)
    setShowFeedback(false)

    try {
      const localQuestions = getTrueFalseQuestions(parseInt(grade))
      if (localQuestions.length === 0) {
        setError('Сұрақтар әзірге қолжетімсіз')
      } else {
        setQuestions(localQuestions)
        setGameState('playing')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Қате орын алды')
    } finally {
      setIsLoading(false)
    }
  }

  // 计时器（时间模式）
  useEffect(() => {
    if (gameState === 'playing' && gameMode === 'time' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('finished')
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameState, gameMode, timeLeft])

  // 保存结果
  useEffect(() => {
    if (gameState === 'finished' && currentQuestionIndex > 0) {
      const totalQuestionsCount = gameMode === 'count' ? 20 : currentQuestionIndex + 1
      const accuracy = totalQuestionsCount > 0 ? Math.round((correctCount / totalQuestionsCount) * 100) : 0
      const timeSpent = gameMode === 'time' ? 60 - timeLeft : undefined

      const result: GameResult = {
        gameId: `quick-judge-${Date.now()}`,
        domain: 'quick-judge',
        correct: correctCount,
        total: totalQuestionsCount,
        accuracy: accuracy,
        timeSpentSec: timeSpent,
        createdAt: new Date().toISOString(),
      }
      addResult(result)
    }
  }, [gameState, currentQuestionIndex, correctCount, gameMode, timeLeft])

  const handleAnswer = (answer: 'Дұрыс' | 'Бұрыс') => {
    if (!currentQuestion || showFeedback) return

    setSelectedAnswer(answer)
    const isCorrect = answer === currentQuestion.a
    setShowFeedback(true)

    if (isCorrect) {
      setScore(prev => prev + 1)
      setCorrectCount(prev => prev + 1)
    }

    // 快速反馈后自动下一题
    setTimeout(() => {
      if (gameMode === 'count') {
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(prev => prev + 1)
          setSelectedAnswer(null)
          setShowFeedback(false)
        } else {
          setGameState('finished')
        }
      } else {
        // 时间模式：继续答题直到时间到
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1)
        } else {
          // 循环题目
          setCurrentQuestionIndex(0)
        }
        setSelectedAnswer(null)
        setShowFeedback(false)
      }
    }, 1000)
  }

  const resetGame = () => {
    setGameState('menu')
    setQuestions([])
    setCurrentQuestionIndex(0)
    setScore(0)
    setCorrectCount(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Басты бетке қайту
        </Link>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⚖️</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Дұрыс/Бұрыс тез шешім</h1>
          <p className="text-slate-600">Жылдам дұрыс немесе бұрыс деп анықтау</p>
        </div>

        {gameState === 'menu' && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 max-w-md mx-auto">
            <div className="space-y-6">
              <div>
                <label className="block font-medium text-slate-700 mb-2">Сынып:</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {['1', '2', '3', '4', '5', '6'].map(g => (
                    <option key={g} value={g}>{g}-сынып</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-2">Ойын режимі:</label>
                <select
                  value={gameMode}
                  onChange={(e) => setGameMode(e.target.value as GameMode)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="count">20 сұрақ</option>
                  <option value="time">60 секунд</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                  {error}
                </div>
              )}

              <button
                onClick={startGame}
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {isLoading ? 'Жасалуда...' : 'Бастау'}
              </button>
            </div>
          </div>
        )}

        {gameState === 'playing' && currentQuestion && (
          <div className="space-y-6">
            {/* 统计面板 */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-indigo-600">{score}</div>
                  <div className="text-sm text-slate-600">Дұрыс</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-600">
                    {gameMode === 'count' ? `${currentQuestionIndex + 1} / ${totalQuestions}` : timeLeft}
                  </div>
                  <div className="text-sm text-slate-600">
                    {gameMode === 'count' ? 'Сұрақ' : 'Секунд'}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600">
                    {currentQuestionIndex > 0 ? Math.round((correctCount / (currentQuestionIndex + 1)) * 100) : 0}%
                  </div>
                  <div className="text-sm text-slate-600">Дәлдік</div>
                </div>
              </div>
            </div>

            {/* 题目卡片 */}
            <div className={`bg-white rounded-2xl shadow-xl border-2 overflow-hidden transition-all duration-300 ${
              showFeedback
                ? selectedAnswer === currentQuestion.a
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-red-500 bg-red-50'
                : 'border-slate-200'
            }`}>
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 flex items-center justify-between text-white">
                <span className="font-medium">Сұрақ {currentQuestionIndex + 1}</span>
              </div>

              <div className="p-8">
                <p className="text-3xl text-slate-800 text-center mb-8 min-h-[120px] flex items-center justify-center leading-relaxed">
                  {currentQuestion.q}
                </p>

                {showFeedback && (
                  <div className={`mb-6 p-4 rounded-xl text-center ${
                    selectedAnswer === currentQuestion.a
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <p className="text-xl font-bold mb-2">
                      {selectedAnswer === currentQuestion.a ? '✓ Дұрыс!' : '✗ Қате!'}
                    </p>
                    {currentQuestion.explanation && (
                      <p className="text-sm">{currentQuestion.explanation}</p>
                    )}
                  </div>
                )}

                {!showFeedback && (
                  <div className="grid grid-cols-2 gap-6">
                    <button
                      onClick={() => handleAnswer('Дұрыс')}
                      className="py-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all text-2xl shadow-lg hover:scale-105"
                    >
                      ✓ Дұрыс
                    </button>
                    <button
                      onClick={() => handleAnswer('Бұрыс')}
                      className="py-6 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all text-2xl shadow-lg hover:scale-105"
                    >
                      ✗ Бұрыс
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-200 p-8 max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Ойын аяқталды!</h2>
            <div className="space-y-4 mb-8">
              <div className="bg-indigo-50 rounded-xl p-6">
                <p className="text-lg font-medium text-slate-600 mb-2">Дұрыс жауап</p>
                <p className="text-5xl font-bold text-indigo-600">{correctCount}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm font-medium text-slate-600 mb-1">Дәлдік</p>
                <p className="text-3xl font-bold text-slate-700">
                  {currentQuestionIndex > 0 ? Math.round((correctCount / (currentQuestionIndex + 1)) * 100) : 0}%
                </p>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg rounded-xl hover:opacity-90 transition-all"
            >
              Қайта бастау
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

