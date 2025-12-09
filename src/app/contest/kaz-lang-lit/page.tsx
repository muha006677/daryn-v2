'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Question } from '@/app/api/generate-question/route'
import QuestionCard from '@/components/QuestionCard'
import { getKazLangLitQuestions } from '@/lib/kazLangLitLocalBank'

export default function KazLangLitPage() {
  const [grade, setGrade] = useState<string>('2')
  const [isLoading, setIsLoading] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadQuestions = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setCurrentIndex(0)
    setShowAnswer(false)

    try {
      // Local fallback - use local bank
      const localQuestions = getKazLangLitQuestions(parseInt(grade))
      
      // Convert local Question format to API Question format
      const apiQuestions: Question[] = localQuestions.map((q, idx) => {
        const lines = q.q.split('\n')
        const promptLines = lines.filter(line => !/^[A-C]\)/.test(line) && !/^Дұрыс жауап/.test(line))
        const options = lines.filter(line => /^[A-C]\)/.test(line)).map(line => line.replace(/^[A-C]\)\s*/, ''))
        
        return {
          id: `kaz-lang-lit-${grade}-${idx}`,
          domain: 'kaz_lang_lit',
          grade: parseInt(grade),
          type: 'mcq' as const,
          prompt: promptLines.join('\n'),
          options: options.length > 0 ? options : undefined,
          answer: q.a,
          explanation: `Дұрыс жауап: ${q.a}`,
          meta: q.meta,
        }
      })

      setQuestions(apiQuestions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Қате орын алды')
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
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/contest" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Диагностикаға қайту
        </Link>

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📚</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Қазақ тілі мен әдебиеті</h1>
          <p className="text-slate-600">Шығармашылық және аналитикалық дарындылықты анықтау</p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
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
                className="px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {['1', '2', '3', '4', '5', '6'].map(g => (
                  <option key={g} value={g}>{g}-сынып</option>
                ))}
              </select>
              <button
                onClick={loadQuestions}
                className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-all"
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
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all"
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
