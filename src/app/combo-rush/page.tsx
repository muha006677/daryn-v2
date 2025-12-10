'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Question } from '@/app/api/generate-question/route'
import { getQuestions, getLocalQuestionsSync } from '@/lib/questionEngine'

type GameState = 'menu' | 'playing' | 'finished'
type TimeMode = 30 | 60 | 90

export default function ComboRushPage() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [grade, setGrade] = useState<string>('2')
  const [timeMode, setTimeMode] = useState<TimeMode>(60)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [showAnswer, setShowAnswer] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const accuracy = correctCount > 0 ? Math.round((correctCount / (currentQuestionIndex + 1)) * 100) : 0

  const startGame = async () => {
    setIsLoading(true)
    setError(null)
    setShowAnswer(false)
    setCurrentQuestionIndex(0)
    setScore(0)
    setCorrectCount(0)
    setCombo(0)
    setMaxCombo(0)
    setTimeLeft(timeMode)

    try {
      const result = await getQuestions({
        domain: 'combo-rush',
        grade: parseInt(grade),
        count: 50, // 准备足够多的题目
        seed: `combo-rush-${Date.now()}`,
      })

      if (result.length === 0) {
        const localQuestions = getLocalQuestionsSync({
          domain: 'combo-rush',
          grade: parseInt(grade),
          count: 50,
        })
        if (localQuestions.length > 0) {
          setQuestions(localQuestions)
          setGameState('playing')
        } else {
          setError('Сұрақтар әзірге қолжетімсіз')
        }
      } else {
        setQuestions(result)
        setGameState('playing')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Қате орын алды'
      setError(errorMessage)
      try {
        const localQuestions = getLocalQuestionsSync({
          domain: 'combo-rush',
          grade: parseInt(grade),
          count: 50,
        })
        if (localQuestions.length > 0) {
          setQuestions(localQuestions)
          setGameState('playing')
        }
      } catch (fallbackErr) {
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 计时器
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
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
  }, [gameState, timeLeft])

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectCount(prev => prev + 1)
      const newCombo = combo + 1
      setCombo(newCombo)
      setMaxCombo(prev => Math.max(prev, newCombo))
      
      // 连对加成：连对 5 题后每题 +2
      const baseScore = 1
      const bonus = newCombo >= 5 ? 2 : 0
      setScore(prev => prev + baseScore + bonus)
    } else {
      setCombo(0)
    }
    setShowAnswer(true)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1 && timeLeft > 0) {
      setCurrentQuestionIndex(prev => prev + 1)
      setShowAnswer(false)
    }
  }

  const resetGame = () => {
    setGameState('menu')
    setQuestions([])
    setCurrentQuestionIndex(0)
    setScore(0)
    setCorrectCount(0)
    setCombo(0)
    setMaxCombo(0)
    setShowAnswer(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Басты бетке қайту
        </Link>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⚡</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Қатарынан шабуыл</h1>
          <p className="text-slate-600">Жылдам жауап беру және қатарынан дұрыс жауап</p>
        </div>

        {gameState === 'menu' && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 max-w-md mx-auto">
            <div className="space-y-6">
              <div>
                <label className="block font-medium text-slate-700 mb-2">Сынып:</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-yellow-500 outline-none"
                >
                  {['1', '2', '3', '4', '5', '6'].map(g => (
                    <option key={g} value={g}>{g}-сынып</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-2">Уақыт режимі:</label>
                <select
                  value={timeMode}
                  onChange={(e) => setTimeMode(parseInt(e.target.value) as TimeMode)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-yellow-500 outline-none"
                >
                  <option value={30}>30 секунд</option>
                  <option value={60}>60 секунд</option>
                  <option value={90}>90 секунд</option>
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
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-lg rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
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
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{score}</div>
                  <div className="text-sm text-slate-600">Ұпай</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-600">{correctCount}</div>
                  <div className="text-sm text-slate-600">Дұрыс</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{combo}</div>
                  <div className="text-sm text-slate-600">Қатар</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{timeLeft}</div>
                  <div className="text-sm text-slate-600">Секунд</div>
                </div>
              </div>
              
              {/* 连击提示 */}
              {combo >= 5 && (
                <div className="mt-4 text-center">
                  <div className="inline-block bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-2 rounded-xl font-bold animate-pulse">
                    🔥 {combo} қатарынан! Бонус +2!
                  </div>
                </div>
              )}
            </div>

            {/* 题目卡片 */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 flex items-center justify-between text-white">
                <span className="font-medium">Сұрақ {currentQuestionIndex + 1}</span>
                <span className="font-medium">Дәлдік: {accuracy}%</span>
              </div>

              <div className="p-8">
                <p className="text-3xl text-slate-800 text-center mb-8 min-h-[120px] flex items-center justify-center leading-relaxed">
                  {currentQuestion.prompt || '—'}
                </p>

                {showAnswer && currentQuestion.answer && (
                  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 text-center mb-6">
                    <p className="text-sm text-emerald-600 mb-2 font-semibold">Жауабы:</p>
                    <p className="text-2xl font-bold text-emerald-700">{currentQuestion.answer}</p>
                  </div>
                )}

                {!showAnswer ? (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleAnswer(true)}
                      className="py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all text-lg"
                    >
                      ✓ Дұрыс
                    </button>
                    <button
                      onClick={() => handleAnswer(false)}
                      className="py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all text-lg"
                    >
                      ✗ Қате
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-lg rounded-xl hover:opacity-90 transition-all"
                  >
                    Келесі сұрақ →
                  </button>
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
              <div className="bg-yellow-50 rounded-xl p-6">
                <p className="text-lg font-medium text-slate-600 mb-2">Жалпы ұпай</p>
                <p className="text-5xl font-bold text-yellow-600">{score}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-slate-600 mb-1">Дұрыс жауап</p>
                  <p className="text-3xl font-bold text-emerald-600">{correctCount}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-slate-600 mb-1">Ең жоғары қатар</p>
                  <p className="text-3xl font-bold text-blue-600">{maxCombo}</p>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm font-medium text-slate-600 mb-1">Дәлдік</p>
                <p className="text-3xl font-bold text-slate-700">{accuracy}%</p>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-lg rounded-xl hover:opacity-90 transition-all"
            >
              Қайта бастау
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

