'use client'

import { useState } from 'react'
import Link from 'next/link'

interface DirectionInfo {
  id: string
  name: string
  icon: string
  gradient: string
  badge: string
  description: string
  href: string
}

const directions: DirectionInfo[] = [
  {
    id: 'math-logic',
    name: 'Таза логика (өте қиын)',
    icon: '🧩',
    gradient: 'from-purple-500 to-indigo-500',
    badge: 'Логика PRO',
    description: 'Заңдылық, комбинаторика, шартты логика',
    href: '/contest/math-logic',
  },
  {
    id: 'math-ultra',
    name: 'Супер күрделі математика',
    icon: '⚡',
    gradient: 'from-blue-500 to-cyan-500',
    badge: 'Математика ULTRA',
    description: 'Көпқадамды есептер, аралас амалдар',
    href: '/contest/math-ultra',
  },
  {
    id: 'kaz-poem',
    name: 'Өлең құрастыру',
    icon: '✍️',
    gradient: 'from-emerald-500 to-teal-500',
    badge: 'Шығармашылық',
    description: 'Алдыңғы 2 тармақ берілген, артқы екеуін өзі құрайды',
    href: '/contest/kaz-poem',
  },
  {
    id: 'kaz-essay',
    name: 'Эссе',
    icon: '📝',
    gradient: 'from-amber-500 to-orange-500',
    badge: 'Мәтін құрау',
    description: 'Тақырып бойынша қысқа эссе жазу',
    href: '/contest/kaz-essay',
  },
  {
    id: 'kaz-retell',
    name: 'Мәтінді оқып мазмұндау',
    icon: '⏱️',
    gradient: 'from-red-500 to-rose-500',
    badge: 'Жылдамдық',
    description: 'Мәтінді оқып, қысқа уақыт ішінде мазмұндау',
    href: '/contest/kaz-retell',
  },
  {
    id: 'memory',
    name: 'Есте сақтау PRO',
    icon: '💫',
    gradient: 'from-violet-500 to-purple-500',
    badge: 'Назар тұрақтылығы',
    description: 'Назар + жылдам қайта жаңғырту',
    href: '/contest/memory',
  },
]

export default function ContestPage() {
  const [grade, setGrade] = useState<string>('2')

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Басты бетке қайту
        </Link>

        <div className="text-center mb-10">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center text-5xl mx-auto mb-6 shadow-2xl shadow-amber-200">
            🏆
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3">
            Дарынды балаларды анықтау
          </h1>
          <p className="text-xl text-slate-600 mb-4">
            Жоғары деңгейлі тапсырмалар жинағы
          </p>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 rounded-full">
            <span className="text-amber-700 font-semibold">Элиталық формат</span>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-center gap-4">
            <label className="text-lg font-semibold text-slate-700">Сынып:</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="px-6 py-3 rounded-xl border-2 border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none bg-white text-slate-900 font-medium text-lg"
            >
              {['1', '2', '3', '4', '5', '6'].map(g => (
                <option key={g} value={g}>{g}-сынып</option>
              ))}
            </select>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {directions.map(dir => (
              <Link
                key={dir.id}
                href={dir.href}
                className="group relative bg-white rounded-2xl border-2 border-slate-200 p-6 hover:border-slate-300 hover:shadow-2xl transition-all duration-300 text-left overflow-hidden"
              >
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${dir.gradient} text-white`}>
                    {dir.badge}
                  </span>
                </div>

                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${dir.gradient} flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  {dir.icon}
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-2">{dir.name}</h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{dir.description}</p>
                
                <div className="flex items-center justify-between mt-6">
                  <span className="text-xs text-slate-400 font-medium">5 тапсырма</span>
                  <span className={`text-white font-bold px-5 py-2 rounded-xl bg-gradient-to-r ${dir.gradient} group-hover:scale-105 transition-transform shadow-lg`}>
                    Кіру
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
