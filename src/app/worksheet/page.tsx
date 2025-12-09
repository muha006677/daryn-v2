'use client'

import { useState } from 'react'

interface WorksheetData {
  tasks: string[]
  answers: string[]
}

type ViewMode = 'all' | 'single'

export default function WorksheetPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<WorksheetData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    grade: '',
    subject: '',
    topic: '',
    duration: '',
    difficulty: '',
  })

  // Game mode states
  const [viewMode, setViewMode] = useState<ViewMode>('all')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set())
  const [showAllAnswers, setShowAllAnswers] = useState(false)

  const grades = ['1', '2', '3', '4', '5', '6']
  const subjects = ['Математика', 'Қазақ тілі', 'Дүниетану', 'Ағылшын тілі']
  const durations = ['20 минут', '30 минут', '40 минут', '45 минут']
  const difficulties = ['Негізгі', 'Орта', 'Жоғары']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setData(null)
    setCurrentIndex(0)
    setRevealedAnswers(new Set())
    setShowAllAnswers(false)

    try {
      const response = await fetch('/api/worksheet/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Қате орын алды')
      }

      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Қате орын алды. Қайта көріңіз.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setData(null)
    setError(null)
    setCurrentIndex(0)
    setRevealedAnswers(new Set())
    setShowAllAnswers(false)
  }

  const toggleAnswer = (index: number) => {
    const newRevealed = new Set(revealedAnswers)
    if (newRevealed.has(index)) {
      newRevealed.delete(index)
    } else {
      newRevealed.add(index)
    }
    setRevealedAnswers(newRevealed)
  }

  const goToNext = () => {
    if (data && currentIndex < data.tasks.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const isAnswerVisible = (index: number) => showAllAnswers || revealedAnswers.has(index)

  // Render single card view
  const renderSingleCard = () => {
    if (!data) return null
    const task = data.tasks[currentIndex]
    const answer = data.answers[currentIndex]

    return (
      <div className="flex flex-col items-center">
        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-6">
          {data.tasks.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentIndex 
                  ? 'bg-emerald-500 scale-125' 
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        {/* Main card */}
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border-2 border-slate-200 overflow-hidden">
          {/* Card header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4">
            <div className="flex items-center justify-between text-white">
              <span className="text-lg font-medium">Тапсырма</span>
              <span className="text-3xl font-bold">{currentIndex + 1} / {data.tasks.length}</span>
            </div>
          </div>

          {/* Card body */}
          <div className="p-8">
            <p className="text-2xl sm:text-3xl text-slate-800 leading-relaxed text-center min-h-[120px] flex items-center justify-center">
              {task}
            </p>
          </div>

          {/* Answer section */}
          <div className="px-8 pb-8">
            {isAnswerVisible(currentIndex) ? (
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 text-center">
                <p className="text-sm text-emerald-600 mb-2 font-medium">Жауабы:</p>
                <p className="text-2xl text-emerald-700 font-bold">{answer}</p>
              </div>
            ) : (
              <button
                onClick={() => toggleAnswer(currentIndex)}
                className="w-full py-4 bg-slate-100 hover:bg-slate-200 rounded-2xl text-slate-600 font-medium transition-colors"
              >
                👁 Жауапты көрсету
              </button>
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={goToPrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Алдыңғы
          </button>
          <button
            onClick={goToNext}
            disabled={currentIndex === data.tasks.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Келесі
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  // Render all cards view
  const renderAllCards = () => {
    if (!data) return null

    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {data.tasks.map((task, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Card number */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 flex items-center justify-between">
              <span className="text-white font-bold text-lg">№{idx + 1}</span>
              <span className="text-emerald-100 text-sm">Тапсырма</span>
            </div>

            {/* Task content */}
            <div className="p-5">
              <p className="text-lg text-slate-800 leading-relaxed mb-4">
                {task}
              </p>

              {/* Answer */}
              {isAnswerVisible(idx) ? (
                <div 
                  onClick={() => toggleAnswer(idx)}
                  className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 cursor-pointer hover:bg-emerald-100 transition-colors"
                >
                  <p className="text-xs text-emerald-600 mb-1">Жауабы:</p>
                  <p className="text-emerald-700 font-semibold">{data.answers[idx]}</p>
                </div>
              ) : (
                <button
                  onClick={() => toggleAnswer(idx)}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-500 text-sm font-medium transition-colors"
                >
                  👁 Жауапты көрсету
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-4 shadow-lg">
            📝
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-2">
            Жұмыс парағы
          </h1>
          <p className="text-slate-600">
            Интерактивті тапсырмалар жинағы
          </p>
        </div>

        {/* Show Game UI or Form */}
        {data ? (
          <div className="space-y-6">
            {/* Game Controls */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* View mode toggle */}
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode('all')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      viewMode === 'all'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📋 Барлық карталар
                  </button>
                  <button
                    onClick={() => setViewMode('single')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      viewMode === 'single'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🎯 Бір картамен
                  </button>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowAllAnswers(!showAllAnswers)}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                      showAllAnswers
                        ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {showAllAnswers ? '🙈 Жауаптарды жасыру' : '👁 Барлық жауаптар'}
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded-xl font-medium text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    ← Қайта жасау
                  </button>
                </div>
              </div>

              {/* Task info */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-600">
                  {formData.grade}-сынып
                </span>
                <span className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-600">
                  {formData.subject}
                </span>
                <span className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-600">
                  {formData.topic}
                </span>
                {formData.difficulty && (
                  <span className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-600">
                    {formData.difficulty}
                  </span>
                )}
              </div>
            </div>

            {/* Cards display */}
            {viewMode === 'single' ? renderSingleCard() : renderAllCards()}
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 max-w-2xl mx-auto">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start gap-3 text-red-700">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Grade Select */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Сынып <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white text-slate-900"
              >
                <option value="">Сыныпты таңдаңыз</option>
                {grades.map((grade) => (
                  <option key={grade} value={grade}>{grade}-сынып</option>
                ))}
              </select>
            </div>

            {/* Subject Select */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Пән <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white text-slate-900"
              >
                <option value="">Пәнді таңдаңыз</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Topic Input */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Тақырып <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                required
                placeholder="Мысалы: Қосу және азайту"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Duration Select */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Сабақ ұзақтығы
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-white text-slate-900"
              >
                <option value="">Ұзақтықты таңдаңыз</option>
                {durations.map((duration) => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Select */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Қиындық деңгейі
              </label>
              <div className="grid grid-cols-3 gap-3">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty}
                    type="button"
                    onClick={() => setFormData({ ...formData, difficulty })}
                    className={`px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                      formData.difficulty === difficulty
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Тапсырмалар жасалуда...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Тапсырмаларды жасау
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
