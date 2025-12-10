'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Question } from '@/app/api/generate-question/route'
import { getQuestions, getLocalQuestionsSync } from '@/lib/questionEngine'

type GameState = 'menu' | 'playing' | 'finished'

export default function CaptureFlagPage() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [grade, setGrade] = useState<string>('2')
  const [questionCount, setQuestionCount] = useState<number>(10)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [teamAScore, setTeamAScore] = useState(0)
  const [teamBScore, setTeamBScore] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [currentTeam, setCurrentTeam] = useState<'A' | 'B'>('A')

  const currentQuestion = questions[currentQuestionIndex]
  const targetScore = questionCount
  const teamAProgress = Math.min(teamAScore / targetScore, 1)
  const teamBProgress = Math.min(teamBScore / targetScore, 1)

  const startGame = async () => {
    setIsLoading(true)
    setError(null)
    setShowAnswer(false)
    setCurrentQuestionIndex(0)
    setTeamAScore(0)
    setTeamBScore(0)
    setCurrentTeam('A')

    try {
      const result = await getQuestions({
        domain: 'capture-flag',
        grade: parseInt(grade),
        count: questionCount,
        seed: `capture-flag-${Date.now()}`,
      })

      if (result.length === 0) {
        const localQuestions = getLocalQuestionsSync({
          domain: 'capture-flag',
          grade: parseInt(grade),
          count: questionCount,
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
          domain: 'capture-flag',
          grade: parseInt(grade),
          count: questionCount,
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

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      if (currentTeam === 'A') {
        setTeamAScore(prev => prev + 1)
      } else {
        setTeamBScore(prev => prev + 1)
      }
    }
    setShowAnswer(true)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setShowAnswer(false)
      setCurrentTeam(prev => prev === 'A' ? 'B' : 'A')
    } else {
      setGameState('finished')
    }
  }

  const resetGame = () => {
    setGameState('menu')
    setQuestions([])
    setCurrentQuestionIndex(0)
    setTeamAScore(0)
    setTeamBScore(0)
    setShowAnswer(false)
  }

  useEffect(() => {
    if (teamAScore >= targetScore || teamBScore >= targetScore) {
      setGameState('finished')
    }
  }, [teamAScore, teamBScore, targetScore])

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Басты бетке қайту
        </Link>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🚩</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Байрақты алу</h1>
          <p className="text-slate-600">Екі команда байраққа жарысады</p>
        </div>

        {gameState === 'menu' && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 max-w-md mx-auto">
            <div className="space-y-6">
              <div>
                <label className="block font-medium text-slate-700 mb-2">Сынып:</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 outline-none"
                >
                  {['1', '2', '3', '4', '5', '6'].map(g => (
                    <option key={g} value={g}>{g}-сынып</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-2">Сұрақ саны:</label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 outline-none"
                >
                  <option value={10}>10 сұрақ</option>
                  <option value={15}>15 сұрақ</option>
                  <option value={20}>20 сұрақ</option>
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
                className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {isLoading ? 'Жасалуда...' : 'Бастау'}
              </button>
            </div>
          </div>
        )}

        {gameState === 'playing' && currentQuestion && (
          <div className="space-y-6">
            {/* 旗帜进度条 */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-6">
              <div className="space-y-4">
                {/* Team A 进度 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-green-700">1-топ</span>
                    <span className="text-sm text-slate-600">{teamAScore} / {targetScore}</span>
                  </div>
                  <div className="relative h-8 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${teamAProgress * 100}%` }}
                    ></div>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl">🚩</div>
                  </div>
                </div>

                {/* Team B 进度 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-blue-700">2-топ</span>
                    <span className="text-sm text-slate-600">{teamBScore} / {targetScore}</span>
                  </div>
                  <div className="relative h-8 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="absolute right-0 top-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                      style={{ width: `${teamBProgress * 100}%` }}
                    ></div>
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl">🚩</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 当前队伍提示 */}
            <div className={`bg-white rounded-xl p-4 text-center border-2 ${
              currentTeam === 'A' ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'
            }`}>
              <p className="font-bold text-lg">
                {currentTeam === 'A' ? '1-топ жауап береді' : '2-топ жауап береді'}
              </p>
            </div>

            {/* 题目卡片 */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4 flex items-center justify-between text-white">
                <span className="font-medium">Сұрақ {currentQuestionIndex + 1} / {questions.length}</span>
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
                    className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:opacity-90 transition-all"
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
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              {teamAScore >= targetScore ? '1-топ жеңді!' : teamBScore >= targetScore ? '2-топ жеңді!' : 'Ойын аяқталды!'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 rounded-xl p-6">
                <p className="text-lg font-medium text-green-700 mb-2">1-топ</p>
                <p className="text-4xl font-bold text-green-600">{teamAScore}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6">
                <p className="text-lg font-medium text-blue-700 mb-2">2-топ</p>
                <p className="text-4xl font-bold text-blue-600">{teamBScore}</p>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:opacity-90 transition-all"
            >
              Қайта бастау
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

