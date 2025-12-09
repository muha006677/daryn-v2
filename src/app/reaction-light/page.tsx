'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Question } from '@/app/api/generate-question/route'

export default function ReactionLightPage() {
  const [grade, setGrade] = useState<string>('2')
  const [isLoading, setIsLoading] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentColor, setCurrentColor] = useState<string>('')
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (questions.length > 0 && !currentColor) {
      nextRound()
    }
  }, [questions])

  const startGame = async () => {
    setIsLoading(true)
    setError(null)
    setScore(0)
    setRound(1)
    setCurrentColor('')

    try {
      const response = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: parseInt(grade),
          domain: 'reaction',
          difficulty: 'ultra',
          count: 10,
          seed: `reaction-light-${Date.now()}`,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Қате')

      setQuestions(data.questions || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Қате орын алды')
    } finally {
      setIsLoading(false)
    }
  }

  const nextRound = () => {
    if (questions.length > 0) {
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)]
      setCurrentColor(randomQuestion.prompt || '')
      setRound(prev => prev + 1)
    }
  }

  const handleAction = (action: string) => {
    const currentQuestion = questions.find(q => q.prompt === currentColor)
    const expected = currentQuestion?.answer || ''
    if (action === expected) {
      setScore(prev => prev + 1)
    }
    setTimeout(nextRound, 500)
  }

  const colorMap: Record<string, string> = {
    'Қызыл түс': 'bg-red-500',
    'Сары түс': 'bg-yellow-500',
    'Жасыл түс': 'bg-green-500',
    'Көк түс': 'bg-blue-500',
    'Ақ түс': 'bg-white border-2 border-slate-300',
  }

  // Get unique answers from questions
  const uniqueAnswers = Array.from(new Set(questions.map(q => q.answer).filter(a => a)))

  return (
    <div className="min-h-screen bg-gradient-to-b from-lime-50 to-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Басты бетке қайту
        </Link>

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🚦</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Реакция "Бағдаршам"</h1>
          <p className="text-slate-600">Ереже ауысатын реакция ойыны</p>
        </div>

        {questions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <label className="font-medium text-slate-700">Сынып:</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-lime-500 outline-none"
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
              className="w-full py-4 bg-gradient-to-r from-lime-500 to-green-500 text-white font-bold text-lg rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {isLoading ? 'Жасалуда...' : 'Бастау'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border-2 border-lime-200 overflow-hidden">
              <div className="bg-gradient-to-r from-lime-500 to-green-500 px-6 py-4 flex items-center justify-between text-white">
                <span className="font-medium">Раунд {round} • Ұпай: {score}</span>
                <button
                  onClick={() => {
                    setQuestions([])
                    setCurrentColor('')
                    setScore(0)
                    setRound(1)
                  }}
                  className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors"
                >
                  Тоқтату
                </button>
              </div>

              <div className="p-8">
                {currentColor ? (
                  <div className="space-y-6">
                    <div className={`w-full h-48 rounded-2xl ${colorMap[currentColor] || 'bg-slate-200'} flex items-center justify-center`}>
                      <p className="text-2xl font-bold text-white">{currentColor}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {uniqueAnswers.map((answer, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAction(answer)}
                          className="py-4 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-all"
                        >
                          {answer || '—'}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <button
                      onClick={nextRound}
                      className="px-8 py-4 bg-gradient-to-r from-lime-500 to-green-500 text-white font-bold text-xl rounded-xl hover:opacity-90 transition-all"
                    >
                      Раундты бастау
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
