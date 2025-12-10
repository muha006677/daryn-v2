'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Question } from '@/app/api/generate-question/route'
import QuestionCard from '@/components/QuestionCard'
import { getQuestions, getLocalQuestionsSync } from '@/lib/questionEngine'

export default function MentalMathPage() {
  const [grade, setGrade] = useState<string>('2')
  const [isLoading, setIsLoading] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fallbackUsed, setFallbackUsed] = useState(false)

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
    setFallbackUsed(false)

    try {
      const result = await getQuestions({
        domain: 'mental-math',
        grade: parseInt(grade),
        count: 10,
        seed: `mental-math-${Date.now()}`,
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
          domain: 'mental-math',
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Басты бетке қайту
        </Link>

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">⚡</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Жылдам есеп</h1>
          <p className="text-slate-600">Жылдам арифметика тапсырмалары</p>
        </div>

        {questions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <label className="font-medium text-slate-700">Сынып:</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-yellow-500 outline-none"
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
              className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-lg rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {isLoading ? 'Жасалуда...' : 'Бастау'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                showAnswer={showAnswer}
                onToggleAnswer={() => setShowAnswer(!showAnswer)}
                index={currentIndex}
                total={questions.length}
              />
            )}

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  setCurrentIndex(Math.max(0, currentIndex - 1))
                  setShowAnswer(false)
                }}
                disabled={currentIndex === 0}
                className="px-6 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
              >
                ← Алдыңғы
              </button>
              <button
                onClick={() => {
                  setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))
                  setShowAnswer(false)
                }}
                disabled={currentIndex === questions.length - 1}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all"
              >
                Келесі →
              </button>
              <button
                onClick={() => {
                  setQuestions([])
                  setCurrentIndex(0)
                  setShowAnswer(false)
                }}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-all"
              >
                Қайта бастау
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
