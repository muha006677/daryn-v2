'use client'

import { useState } from 'react'

interface FeatureFormProps {
  title: string
  description: string
  icon: string
  gradientFrom: string
  gradientTo: string
}

export default function FeatureForm({ 
  title, 
  description, 
  icon,
  gradientFrom,
  gradientTo 
}: FeatureFormProps) {
  const [showMessage, setShowMessage] = useState(false)
  const [formData, setFormData] = useState({
    grade: '',
    subject: '',
    topic: '',
    duration: '',
    difficulty: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowMessage(true)
    setTimeout(() => setShowMessage(false), 3000)
  }

  const grades = ['1', '2', '3', '4', '5', '6']
  const subjects = ['Математика', 'Қазақ тілі', 'Дүниетану', 'Ағылшын тілі']
  const durations = ['20 минут', '30 минут', '40 минут', '45 минут']
  const difficulties = ['Негізгі', 'Орта', 'Жоғары']

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div 
            className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg`}
          >
            {icon}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            {title}
          </h1>
          <p className="text-lg text-slate-600">
            {description}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {/* Grade Select */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Сынып
            </label>
            <select
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-slate-900"
            >
              <option value="">Сыныпты таңдаңыз</option>
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}-сынып
                </option>
              ))}
            </select>
          </div>

          {/* Subject Select */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Пән
            </label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-slate-900"
            >
              <option value="">Пәнді таңдаңыз</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Topic Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Тақырып
            </label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              placeholder="Мысалы: Қосу және азайту"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Duration Select */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Сабақ ұзақтығы
            </label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white text-slate-900"
            >
              <option value="">Ұзақтықты таңдаңыз</option>
              {durations.map((duration) => (
                <option key={duration} value={duration}>
                  {duration}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Select */}
          <div className="mb-8">
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
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
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
            className={`w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r ${gradientFrom} ${gradientTo} hover:opacity-90 transition-opacity shadow-lg`}
          >
            Жасау
          </button>

          {/* Mock Message */}
          {showMessage && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
              <div className="flex items-center justify-center gap-2 text-amber-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Жақында қолжетімді</span>
              </div>
              <p className="text-sm text-amber-600 mt-1">
                Бұл мүмкіндік әзірленуде
              </p>
            </div>
          )}
        </form>

        {/* Info Cards */}
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold text-slate-900 mb-1">Жылдам нәтиже</h3>
            <p className="text-sm text-slate-600">Бірнеше секундта дайын материал</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="text-2xl mb-2">✨</div>
            <h3 className="font-semibold text-slate-900 mb-1">Сапалы мазмұн</h3>
            <p className="text-sm text-slate-600">Оқу бағдарламасына сәйкес</p>
          </div>
        </div>
      </div>
    </div>
  )
}
