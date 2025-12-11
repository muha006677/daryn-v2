'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStudentName } from '@/hooks/useStudentName'

export default function StartPage() {
  const router = useRouter()
  const { name, setName, clearName, isLoading } = useStudentName()
  const [inputName, setInputName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && name) {
      setInputName(name)
    }
  }, [name, isLoading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = inputName.trim()
    
    if (!trimmed) {
      return
    }

    setIsSubmitting(true)
    setName(trimmed)
    
    // 短暂延迟后跳转
    setTimeout(() => {
      router.push('/')
    }, 300)
  }

  const handleContinue = () => {
    router.push('/')
  }

  const handleChangeName = () => {
    clearName()
    setInputName('')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Жүктелуде...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🎯</div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Shokhan Daryny</h1>
            <p className="text-slate-600">
              Оқушының дарындылық бағытын анықтау жүйесі
            </p>
          </div>

          {name ? (
            <div className="space-y-6">
              <div className="bg-indigo-50 rounded-xl p-6 text-center">
                <p className="text-lg text-slate-700 mb-2">Сәлем,</p>
                <p className="text-2xl font-bold text-indigo-600">{name}</p>
              </div>

              <button
                onClick={handleContinue}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg rounded-xl hover:opacity-90 transition-all"
              >
                Негізгі бетке өту
              </button>

              <button
                onClick={handleChangeName}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all"
              >
                Атын өзгерту
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Атыңызды енгізіңіз
                </label>
                <input
                  id="name"
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="Мысалы: Айгүл"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none text-lg"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={!inputName.trim() || isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? 'Кіруде...' : 'Кіру'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

