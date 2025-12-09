'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Question } from '@/app/api/generate-question/route'

export default function FlashMemoryPage() {
  const [grade, setGrade] = useState<string>('2')
  const [isLoading, setIsLoading] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (questions.length > 0) {
      setShowAnswer(false)
    }
  }, [currentIndex, questions])

  const startGame = async () => {
    setIsLoading(true)
    setError(null)
    setCurrentIndex(0)
    setShowAnswer(false)

    try {
      const response = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: parseInt(grade),
          domain: 'memory',
          difficulty: 'ultra',
          count: 10,
          seed: `flash-memory-${Date.now()}`,
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

  const currentQuestion = questions[currentIndex]

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Басты бетке қайту
        </Link>

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">💫</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Flash Memory</h1>
          <p className="text-slate-600">Жылдам есте сақтау тапсырмалары</p>
        </div>

        {questions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <label className="font-medium text-slate-700">Сынып:</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 outline-none"
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
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-lg rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {isLoading ? 'Жасалуда...' : 'Бастау'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border-2 border-cyan-200 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-4 flex items-center justify-between text-white">
                <span className="font-medium">Тізбек {currentIndex + 1} / {questions.length}</span>
                <button
                  onClick={() => setQuestions([])}
                  className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors"
                >
                  Қайта бастау
                </button>
              </div>

              <div className="p-8">
                {currentQuestion && (
                  <>
                    {!showAnswer ? (
                      <div className="text-center">
                        <p className="text-3xl font-bold text-slate-800 mb-6">
                          {currentQuestion.prompt || '—'}
                        </p>
                        <p className="text-lg text-slate-600 mb-8">3 секундта есте сақта!</p>
                        <button
                          onClick={() => setShowAnswer(true)}
                          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-lg rounded-xl hover:opacity-90 transition-all"
                        >
                          Жасыру
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-2xl text-slate-400 mb-8 line-through">
                          {currentQuestion.prompt || '—'}
                        </p>
                        <div className="bg-cyan-50 border-2 border-cyan-200 rounded-xl p-6 mb-6">
                          <p className="text-sm text-cyan-600 mb-2">Тізбекті қайталаңыз:</p>
                          <input
                            type="text"
                            placeholder="Мұнда жаз..."
                            className="w-full px-4 py-3 rounded-lg border-2 border-cyan-300 focus:ring-2 focus:ring-cyan-500 outline-none text-lg"
                          />
                        </div>
                        <button
                          onClick={() => {
                            setShowAnswer(false)
                            setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))
                          }}
                          className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
                        >
                          Келесі тізбек
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
