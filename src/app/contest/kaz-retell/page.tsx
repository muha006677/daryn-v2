'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Question } from '@/app/api/generate-question/route'
import QuestionCard from '@/components/QuestionCard'

export default function KazRetellPage() {
  const [grade, setGrade] = useState<string>('2')
  const [isLoading, setIsLoading] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadQuestions()
  }, [grade])

  useEffect(() => {
    if (questions.length > 0) {
      setShowAnswer(false)
    }
  }, [currentIndex, questions])

  const loadQuestions = async () => {
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
          domain: 'kaz_retell',
          difficulty: 'ultra',
          count: 5,
          seed: `kaz-retell-${Date.now()}`,
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
  const timeLimit = currentQuestion?.meta?.timeLimit || 60

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/contest" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Диагностикаға қайту
        </Link>

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">⏱️</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Мәтінді оқып мазмұндау</h1>
          <p className="text-slate-600">Мәтінді оқып, қысқа уақыт ішінде мазмұндау</p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
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
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 bg-white rounded-xl p-4 shadow-sm">
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
              <button
                onClick={loadQuestions}
                className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all"
              >
                Жаңарту
              </button>
            </div>

            {currentQuestion && (
              <div className="bg-white rounded-2xl shadow-xl border-2 border-red-200 overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-rose-500 px-6 py-4 flex items-center justify-between text-white">
                  <span className="font-medium">Тапсырма {currentIndex + 1} / {questions.length}</span>
                  <div className="px-4 py-2 bg-white/20 rounded-lg font-bold">
                    ⏱️ {timeLimit} сек
                  </div>
                </div>

                <div className="p-8">
                  <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6 mb-6">
                    <p className="text-xl leading-relaxed text-slate-800 whitespace-pre-wrap">
                      {currentQuestion.prompt || '—'}
                    </p>
                  </div>

                  {showAnswer && currentQuestion.answer && (
                    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
                      <p className="text-sm text-emerald-600 mb-2 font-semibold uppercase">Мазмұндама:</p>
                      <p className="text-lg font-medium text-emerald-700 leading-relaxed whitespace-pre-wrap">
                        {currentQuestion.answer}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="w-full py-4 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-medium text-lg transition-colors mt-4"
                  >
                    {showAnswer ? '👁 Мазмұндаманы жасыру' : '👁 Мазмұндаманы көрсету'}
                  </button>
                </div>
              </div>
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
