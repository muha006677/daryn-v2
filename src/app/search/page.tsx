'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { Search, ArrowRight, Brain, ClipboardCheck, Microscope, BrainCog, Folder, BookOpen } from 'lucide-react'
import { Suspense } from 'react'

const allRoutes = [
  { 
    path: '/training', 
    title: 'Адаптивті жаттығу', 
    description: 'Шексіз математика тренингі — деңгей автоматты түрде бейімделеді',
    keywords: ['жаттығу', 'training', 'математика', 'тренинг', 'адаптивті'],
    icon: Brain,
    color: 'bg-emerald-100 text-emerald-600'
  },
  { 
    path: '/ubt', 
    title: 'ҰБТ моделдеу', 
    description: 'Ұлттық бірыңғай тестілеу симуляциясы — 140 ұпай жүйесі',
    keywords: ['ұбт', 'ubt', 'тест', 'емтихан', 'симуляция', '140'],
    icon: ClipboardCheck,
    color: 'bg-amber-100 text-amber-600'
  },
  { 
    path: '/diagnostics', 
    title: 'Когнитивті диагностика', 
    description: '5-10 минуттық микро-модульдер арқылы когнитивті қабілеттерді бағалау',
    keywords: ['диагностика', 'когнитивті', 'модуль', 'бағалау', 'микро'],
    icon: Microscope,
    color: 'bg-blue-100 text-blue-600'
  },
  { 
    path: '/talent', 
    title: 'Дарын әлеуетін модельдеу', 
    description: 'Көпқабатты аналитикалық құрылымдар арқылы интеллектуалдық болжау',
    keywords: ['дарын', 'talent', 'элиталық', 'модельдеу', 'аналитика'],
    icon: BrainCog,
    color: 'bg-slate-200 text-slate-700'
  },
  { 
    path: '/resources', 
    title: 'Ресурстар', 
    description: 'Мұғалімдер мен оқушыларға арналған оқу материалдары',
    keywords: ['ресурс', 'материал', 'сабақ', 'жоспар', 'парақ'],
    icon: Folder,
    color: 'bg-emerald-100 text-emerald-600'
  },
  { 
    path: '/micro-tests', 
    title: 'Интеллектуалды микросынақтар', 
    description: 'Қысқа когнитивтік диагностика модульдері',
    keywords: ['микро', 'сынақ', 'тест', 'қысқа', 'логика'],
    icon: Microscope,
    color: 'bg-blue-100 text-blue-600'
  },
  { 
    path: '/elite-modeling', 
    title: 'Элиталық модельдеу', 
    description: 'Стратегиялық интеллект модельдеу жүйесі',
    keywords: ['элита', 'стратегия', 'модельдеу', 'жоғары'],
    icon: BrainCog,
    color: 'bg-slate-200 text-slate-700'
  },
  { 
    path: '/worksheet', 
    title: 'Жұмыс парақтары', 
    description: 'Оқушыларға арналған жаттығу парақтары',
    keywords: ['парақ', 'worksheet', 'жаттығу', 'тапсырма'],
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-600'
  },
]

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const filteredRoutes = query 
    ? allRoutes.filter(route => 
        route.title.toLowerCase().includes(query.toLowerCase()) ||
        route.description.toLowerCase().includes(query.toLowerCase()) ||
        route.keywords.some(kw => kw.toLowerCase().includes(query.toLowerCase()))
      )
    : allRoutes

  return (
    <>
      {/* Hero */}
      <section className="bg-slate-950 pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-white" strokeWidth={1.75} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {query ? `"${query}" бойынша іздеу` : 'Іздеу'}
          </h1>
          <p className="text-slate-400">
            {filteredRoutes.length} нәтиже табылды
          </p>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredRoutes.length > 0 ? (
            <div className="space-y-4">
              {filteredRoutes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className="group flex items-start gap-4 bg-slate-50 border border-slate-200 rounded-xl p-5 hover:bg-white hover:shadow-lg hover:border-slate-300 transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${route.color}`}>
                    <route.icon className="w-6 h-6" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{route.title}</h3>
                    <p className="text-slate-600 text-sm mb-2">{route.description}</p>
                    <span className="text-xs text-slate-400">{route.path}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" strokeWidth={1.75} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-500 mb-4">Нәтиже табылмады</p>
              <Link href="/" className="text-blue-600 hover:underline">
                Басты бетке оралу
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <Suspense fallback={
        <section className="bg-slate-950 pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-white">Жүктелуде...</p>
          </div>
        </section>
      }>
        <SearchResults />
      </Suspense>
    </div>
  )
}
