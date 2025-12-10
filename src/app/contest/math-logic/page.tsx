'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Question } from '@/app/api/generate-question/route'
import QuestionCard from '@/components/QuestionCard'
import { getQuestions } from '@/lib/questionEngine'

export default function MathLogicPage() {
  const [grade, setGrade] = useState<string>('2')
  const [isLoading, setIsLoading] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fallbackUsed, setFallbackUsed] = useState(false)

  const loadQuestions = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setCurrentIndex(0)
    setShowAnswer(false)
    setFallbackUsed(false)

    try {
      const result = await getQuestions({
        domain: 'math_logic',
        grade: parseInt(grade),
        count: 5,
        seed: `math-logic-${Date.now()}`,
      })

      if (result.length === 0) {
        setError('Тапсырмалар табылмады. Қайта көріңіз.')
      } else {
        setQuestions(result)
        // 如果题目数量少于请求数量，说明可能使用了 fallback
        if (result.length < 5) {
          setFallbackUsed(true)
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Қате орын алды'
      setError(errorMessage)
      // 即使出错，也尝试使用本地题库
      try {
        const { getLocalQuestionsSync } = await import('@/lib/questionEngine')
        const localQuestions = getLocalQuestionsSync({
          domain: 'math_logic',
          grade: parseInt(grade),
          count: 5,
        })
        if (localQuestions.length > 0) {
          setQuestions(localQuestions)
          setFallbackUsed(true)
          setError('API қате, жергілікті банк қолданылды')
        }
      } catch (fallbackErr) {
        // 最终失败
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }, [grade])

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  useEffect(() => {
    if (questions.length > 0) {
      setShowAnswer(false)
    }
  }, [currentIndex, questions])

  const currentQuestion = questions[currentIndex]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/contest" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Диагностикаға қайту
        </Link>

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🧩</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Таза логика (өте қиын)</h1>
          <p className="text-slate-600">Логикалық заңдылық табу тапсырмалары</p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Тапсырмалар жасалуда...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-700 font-medium mb-4">{error}</p>
              <button
                onClick={loadQuestions}
                className="px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all"
              >
                Қайта көріңіз
              </button>
            </div>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <p className="text-center text-slate-600">Тапсырмалар табылмады</p>
          </div>
        ) : (
          <>
            {fallbackUsed && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm text-center">
                ⚠️ API қате, жергілікті банк қолданылды. Кейбір тапсырмалар жеткіліксіз болуы мүмкін.
              </div>
            )}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 bg-white rounded-xl p-4 shadow-sm">
              <label className="font-medium text-slate-700">Сынып:</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 outline-none"
              >
                {['1', '2', '3', '4', '5', '6'].map(g => (
                  <option key={g} value={g}>{g}-сынып</option>
                ))}
              </select>
              <button
                onClick={loadQuestions}
                className="px-4 py-2 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-all"
              >
                Жаңарту
              </button>
            </div>

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
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all"
              >
                Келесі →
              </button>
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  )
}
