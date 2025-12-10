'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Question } from '@/app/api/generate-question/route'
import { getQuestions, getLocalQuestionsSync } from '@/lib/questionEngine'

type GameState = 'menu' | 'playing' | 'finished'

export default function CastleSiegePage() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [grade, setGrade] = useState<string>('2')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [teamAHP, setTeamAHP] = useState(10)
  const [teamBHP, setTeamBHP] = useState(10)
  const [teamACombo, setTeamACombo] = useState(0)
  const [teamBCombo, setTeamBCombo] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [currentTeam, setCurrentTeam] = useState<'A' | 'B'>('A')

  const currentQuestion = questions[currentQuestionIndex]

  const startGame = async () => {
    setIsLoading(true)
    setError(null)
    setShowAnswer(false)
    setCurrentQuestionIndex(0)
    setTeamAHP(10)
    setTeamBHP(10)
    setTeamACombo(0)
    setTeamBCombo(0)
    setCurrentTeam('A')

    try {
      const result = await getQuestions({
        domain: 'castle-siege',
        grade: parseInt(grade),
        count: 15,
        seed: `castle-siege-${Date.now()}`,
      })

      if (result.length === 0) {
        const localQuestions = getLocalQuestionsSync({
          domain: 'castle-siege',
          grade: parseInt(grade),
          count: 15,
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
          domain: 'castle-siege',
          grade: parseInt(grade),
          count: 15,
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
        setTeamBHP(prev => Math.max(0, prev - 1))
        const newCombo = teamACombo + 1
        setTeamACombo(newCombo)
        // 连续3题全对 = 额外 -1（暴击）
        if (newCombo >= 3) {
          setTeamBHP(prev => Math.max(0, prev - 1))
          setTeamACombo(0) // 重置连击
        }
      } else {
        setTeamAHP(prev => Math.max(0, prev - 1))
        const newCombo = teamBCombo + 1
        setTeamBCombo(newCombo)
        if (newCombo >= 3) {
          setTeamAHP(prev => Math.max(0, prev - 1))
          setTeamBCombo(0)
        }
      }
    } else {
      // 答错重置连击
      if (currentTeam === 'A') {
        setTeamACombo(0)
      } else {
        setTeamBCombo(0)
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
    setTeamAHP(10)
    setTeamBHP(10)
    setTeamACombo(0)
    setTeamBCombo(0)
    setShowAnswer(false)
  }

  useEffect(() => {
    if (teamAHP <= 0 || teamBHP <= 0) {
      setGameState('finished')
    }
  }, [teamAHP, teamBHP])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Басты бетке қайту
        </Link>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏰</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Қамал шабуылы</h1>
          <p className="text-slate-600">Екі команда қамалды қорғайды</p>
        </div>

        {gameState === 'menu' && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 max-w-md mx-auto">
            <div className="space-y-6">
              <div>
                <label className="block font-medium text-slate-700 mb-2">Сынып:</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  {['1', '2', '3', '4', '5', '6'].map(g => (
                    <option key={g} value={g}>{g}-сынып</option>
                  ))}
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
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-lg rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {isLoading ? 'Жасалуда...' : 'Бастау'}
              </button>
            </div>
          </div>
        )}

        {gameState === 'playing' && currentQuestion && (
          <div className="space-y-6">
            {/* 血条显示 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border-2 border-green-200 p-6">
                <h3 className="text-2xl font-bold text-green-700 mb-4 text-center">1-топ қамалы</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600">HP:</span>
                    <span className="text-2xl font-bold text-green-600">{teamAHP} / 10</span>
                  </div>
                  <div className="w-full h-6 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${(teamAHP / 10) * 100}%` }}
                    ></div>
                  </div>
                  {teamACombo > 0 && (
                    <div className="text-center text-amber-600 font-bold">
                      🔥 {teamACombo} қатарынан дұрыс!
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-6">
                <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">2-топ қамалы</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600">HP:</span>
                    <span className="text-2xl font-bold text-blue-600">{teamBHP} / 10</span>
                  </div>
                  <div className="w-full h-6 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                      style={{ width: `${(teamBHP / 10) * 100}%` }}
                    ></div>
                  </div>
                  {teamBCombo > 0 && (
                    <div className="text-center text-amber-600 font-bold">
                      🔥 {teamBCombo} қатарынан дұрыс!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 当前队伍提示 */}
            <div className={`bg-white rounded-xl p-4 text-center border-2 ${
              currentTeam === 'A' ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'
            }`}>
              <p className="font-bold text-lg">
                {currentTeam === 'A' ? '1-топ шабуыл жасайды' : '2-топ шабуыл жасайды'}
              </p>
            </div>

            {/* 题目卡片 */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-4 flex items-center justify-between text-white">
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
                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-lg rounded-xl hover:opacity-90 transition-all"
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
              {teamAHP <= 0 ? '2-топ жеңді!' : teamBHP <= 0 ? '1-топ жеңді!' : 'Ойын аяқталды!'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 rounded-xl p-6">
                <p className="text-lg font-medium text-green-700 mb-2">1-топ қамалы</p>
                <p className="text-4xl font-bold text-green-600">{teamAHP} HP</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6">
                <p className="text-lg font-medium text-blue-700 mb-2">2-топ қамалы</p>
                <p className="text-4xl font-bold text-blue-600">{teamBHP} HP</p>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-lg rounded-xl hover:opacity-90 transition-all"
            >
              Қайта бастау
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

