'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Question } from '@/app/api/generate-question/route'
import { getQuestions, getLocalQuestionsSync } from '@/lib/questionEngine'

type GameState = 'menu' | 'playing' | 'finished'

export default function MonkeyRacePage() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [grade, setGrade] = useState<string>('2')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fallbackUsed, setFallbackUsed] = useState(false)
  
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [team1Score, setTeam1Score] = useState(0)
  const [team2Score, setTeam2Score] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]

  const startGame = async () => {
    setIsLoading(true)
    setError(null)
    setShowAnswer(false)
    setCurrentQuestionIndex(0)
    setTeam1Score(0)
    setTeam2Score(0)
    setFallbackUsed(false)

    try {
      const result = await getQuestions({
        domain: 'mixed',
        grade: parseInt(grade),
        count: 10,
        seed: `monkey-race-${Date.now()}`,
      })

      if (result.length === 0) {
        setError('Тапсырмалар табылмады. Қайта көріңіз.')
      } else {
        setQuestions(result)
        setGameState('playing')
        if (result.length < 10) {
          setFallbackUsed(true)
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Қате орын алды. Қайта көріңіз.'
      setError(errorMessage)
      try {
        const localQuestions = getLocalQuestionsSync({
          domain: 'mixed',
          grade: parseInt(grade),
          count: 10,
        })
        if (localQuestions.length > 0) {
          setQuestions(localQuestions)
          setGameState('playing')
          setFallbackUsed(true)
          setError('API қате, жергілікті банк қолданылды')
        }
      } catch (fallbackErr) {
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const addTeam1Point = () => {
    if (team1Score < 10) {
      setTeam1Score(team1Score + 1)
    }
  }

  const addTeam2Point = () => {
    if (team2Score < 10) {
      setTeam2Score(team2Score + 1)
    }
  }

  const addBothPoints = () => {
    if (team1Score < 10) setTeam1Score(team1Score + 1)
    if (team2Score < 10) setTeam2Score(team2Score + 1)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowAnswer(false)
    } else {
      setGameState('finished')
    }
  }

  const resetGame = () => {
    setGameState('menu')
    setQuestions([])
    setCurrentQuestionIndex(0)
    setTeam1Score(0)
    setTeam2Score(0)
    setShowAnswer(false)
  }

  const renderProgress = (score: number, teamNumber: number) => {
    const steps = []
    for (let i = 0; i <= 10; i++) {
      steps.push(
        <div
          key={i}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            i <= score
              ? teamNumber === 1
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 text-white'
              : 'bg-slate-200 text-slate-400'
          }`}
        >
          {i}
        </div>
      )
    }
    return steps
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Басты бетке қайту
        </Link>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🐵</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Екі маймылдың ағашқа жарысы</h1>
          <p className="text-slate-600">Екі команда сынасып, дұрыс жауап беру арқылы ағашқа көтеріледі</p>
        </div>

        {gameState === 'menu' && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <label className="font-medium text-slate-700">Сынып:</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 outline-none"
              >
                {['1', '2', '3', '4', '5', '6'].map(g => (
                  <option key={g} value={g}>{g}-сынып</option>
                ))}
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={startGame}
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {isLoading ? 'Жасалуда...' : 'Бастау'}
            </button>
          </div>
        )}

        {gameState === 'playing' && currentQuestion && (
          <div className="space-y-6">
            {/* Score Display */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border-2 border-green-200 p-6">
                <h3 className="text-2xl font-bold text-green-700 mb-4 text-center">1-топ</h3>
                <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
                  {renderProgress(team1Score, 1)}
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">{team1Score} / 10</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-200 p-6">
                <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">2-топ</h3>
                <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
                  {renderProgress(team2Score, 2)}
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">{team2Score} / 10</div>
                </div>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between text-white">
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

                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="w-full py-4 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-medium text-lg transition-colors mb-6"
                >
                  {showAnswer ? '👁 Жауапты жасыру' : '👁 Жауапты көрсету'}
                </button>

                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={addTeam1Point}
                    className="py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all text-lg"
                  >
                    1-топ +1
                  </button>
                  <button
                    onClick={addBothPoints}
                    className="py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all text-lg"
                  >
                    Екеуі де
                  </button>
                  <button
                    onClick={addTeam2Point}
                    className="py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all text-lg"
                  >
                    2-топ +1
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-all"
              >
                Тоқтату
              </button>
              <button
                onClick={nextQuestion}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all"
              >
                Келесі сұрақ →
              </button>
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-200 p-8 max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Ойын аяқталды!</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 rounded-xl p-6">
                <p className="text-lg font-medium text-green-700 mb-2">1-топ</p>
                <p className="text-4xl font-bold text-green-600">{team1Score} / 10</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6">
                <p className="text-lg font-medium text-blue-700 mb-2">2-топ</p>
                <p className="text-4xl font-bold text-blue-600">{team2Score} / 10</p>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg rounded-xl hover:opacity-90 transition-all"
            >
              Қайта бастау
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
