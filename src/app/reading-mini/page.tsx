'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Question } from '@/app/api/generate-question/route'

export default function ReadingMiniPage() {
  const [grade, setGrade] = useState<string>('2')
  const [isLoading, setIsLoading] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswers, setShowAnswers] = useState<Set<number>>(new Set())
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (questions.length > 0) {
      setShowAnswers(new Set())
    }
  }, [questions])

  const startGame = async () => {
    setIsLoading(true)
    setError(null)
    setCurrentIndex(0)
    setShowAnswers(new Set())

    try {
      const response = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: parseInt(grade),
          domain: 'reading',
          difficulty: 'ultra',
          count: 10,
          seed: `reading-mini-${Date.now()}`,
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
  const toggleAnswer = (qIndex: number) => {
    const key = currentIndex * 100 + qIndex
    const newSet = new Set(showAnswers)
    if (newSet.has(key)) {
      newSet.delete(key)
    } else {
      newSet.add(key)
    }
    setShowAnswers(newSet)
  }

  // Parse reading questions - prompt contains text + questions
  const parseReadingContent = (prompt: string) => {
    const parts = prompt.split(/\n\s*Сұрақтар:\s*\n/i)
    const text = parts[0]?.replace(/Мәтін:\s*/i, '').trim() || prompt
    const questionsPart = parts[1] || ''
    const questions = questionsPart.split(/\n(?=\d+\.)/).filter(q => q.trim()).map(q => q.replace(/^\d+\.\s*/, '').trim())
    return { text, questions }
  }

  const readingContent = currentQuestion ? parseReadingContent(currentQuestion.prompt || '') : { text: '', questions: [] }
  const answerLines = currentQuestion?.answer ? currentQuestion.answer.split('\n').filter(a => a.trim()) : []

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Басты бетке қайту
        </Link>

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📖</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Оқу түсіну микросынақ</h1>
          <p className="text-slate-600">Қысқа мәтін + сұрақтар</p>
        </div>

        {questions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <label className="font-medium text-slate-700">Сынып:</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
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
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold text-lg rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {isLoading ? 'Жасалуда...' : 'Бастау'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border-2 border-indigo-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-4 flex items-center justify-between text-white">
                <span className="font-medium">Мәтін {currentIndex + 1} / {questions.length}</span>
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
                    <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6 mb-6">
                      <p className="text-xl leading-relaxed text-slate-800 whitespace-pre-wrap">
                        {readingContent.text || currentQuestion.prompt || '—'}
                      </p>
                    </div>

                    {readingContent.questions.length > 0 && (
                      <div className="space-y-4">
                        {readingContent.questions.map((question, qIdx) => {
                          const answerKey = currentIndex * 100 + qIdx
                          const showAnswer = showAnswers.has(answerKey)
                          const answerText = answerLines[qIdx] || currentQuestion.answer || '—'
                          return (
                            <div key={qIdx} className="border-2 border-slate-200 rounded-xl p-4">
                              <p className="text-lg font-medium text-slate-900 mb-3">
                                {qIdx + 1}. {question}
                              </p>
                              {showAnswer && (
                                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                                  <p className="text-indigo-700 font-medium">{answerText}</p>
                                </div>
                              )}
                              {!showAnswer && (
                                <button
                                  onClick={() => toggleAnswer(qIdx)}
                                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 text-sm transition-colors"
                                >
                                  👁 Жауапты көрсету
                                </button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  setCurrentIndex(Math.max(0, currentIndex - 1))
                  setShowAnswers(new Set())
                }}
                disabled={currentIndex === 0}
                className="px-6 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all"
              >
                ← Алдыңғы
              </button>
              <button
                onClick={() => {
                  setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))
                  setShowAnswers(new Set())
                }}
                disabled={currentIndex === questions.length - 1}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all"
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
