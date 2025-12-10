'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Question } from '@/app/api/generate-question/route'
import { getQuestions, getLocalQuestionsSync } from '@/lib/questionEngine'

export default function Speech1MinPage() {
  const [grade, setGrade] = useState<string>('2')
  const [isLoading, setIsLoading] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [scores, setScores] = useState<Record<number, { clarity: number; vocabulary: number; structure: number }>>({})
  const [error, setError] = useState<string | null>(null)
  const [fallbackUsed, setFallbackUsed] = useState(false)

  useEffect(() => {
    if (questions.length > 0) {
      setScores({})
    }
  }, [questions])

  const startGame = async () => {
    setIsLoading(true)
    setError(null)
    setCurrentIndex(0)
    setScores({})
    setFallbackUsed(false)

    try {
      const result = await getQuestions({
        domain: 'speech-1min',
        grade: parseInt(grade),
        count: 10,
        seed: `speech-1min-${Date.now()}`,
      })

      if (result.length === 0) {
        setError('Тапсырмалар табылмады. Қайта көріңіз.')
      } else {
        setQuestions(result)
        if (result.length < 10) {
          setFallbackUsed(true)
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Қате орын алды'
      setError(errorMessage)
      try {
        const localQuestions = getLocalQuestionsSync({
          domain: 'speech-1min',
          grade: parseInt(grade),
          count: 10,
        })
        if (localQuestions.length > 0) {
          setQuestions(localQuestions)
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

  const currentQuestion = questions[currentIndex]
  const currentScore = scores[currentIndex] || { clarity: 0, vocabulary: 0, structure: 0 }

  const updateScore = (type: 'clarity' | 'vocabulary' | 'structure', value: number) => {
    setScores(prev => ({
      ...prev,
      [currentIndex]: { ...prev[currentIndex] || { clarity: 0, vocabulary: 0, structure: 0 }, [type]: value }
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Басты бетке қайту
        </Link>

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎤</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">1 минут сөйлеу</h1>
          <p className="text-slate-600">Тақырып бойынша сөйлеу + бағалау критерийлері</p>
        </div>

        {questions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <label className="font-medium text-slate-700">Сынып:</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 outline-none"
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
              className="w-full py-4 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold text-lg rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {isLoading ? 'Жасалуда...' : 'Бастау'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border-2 border-red-200 overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-rose-500 px-6 py-4 flex items-center justify-between text-white">
                <span className="font-medium">Тақырып {currentIndex + 1} / {questions.length}</span>
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
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center mb-6">
                      <p className="text-3xl font-bold text-slate-900 mb-2">Тақырып:</p>
                      <p className="text-2xl text-red-700">{currentQuestion.prompt || '—'}</p>
                      <p className="text-sm text-red-600 mt-4">1 минут сөйлеу уақыты</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Айқындық (0-10)
                        </label>
                        <div className="flex gap-2">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <button
                              key={num}
                              onClick={() => updateScore('clarity', num)}
                              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                                currentScore.clarity === num
                                  ? 'bg-red-500 text-white'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Сөздік қор (0-10)
                        </label>
                        <div className="flex gap-2">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <button
                              key={num}
                              onClick={() => updateScore('vocabulary', num)}
                              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                                currentScore.vocabulary === num
                                  ? 'bg-red-500 text-white'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Құрылым (0-10)
                        </label>
                        <div className="flex gap-2">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <button
                              key={num}
                              onClick={() => updateScore('structure', num)}
                              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                                currentScore.structure === num
                                  ? 'bg-red-500 text-white'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-600 mb-1">Жалпы ұпай:</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {currentScore.clarity + currentScore.vocabulary + currentScore.structure} / 30
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="px-6 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
              >
                ← Алдыңғы
              </button>
              <button
                onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
                disabled={currentIndex === questions.length - 1}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all"
              >
                Келесі →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
