'use client'

import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { Microscope, Brain, Calculator, Clock, FileText, ArrowRight } from 'lucide-react'

const modules = [
  {
    id: 'logic',
    title: 'Логикалық реакция сынағы',
    description: 'Логикалық ойлау жылдамдығын өлшеу',
    duration: '5-7 мин',
    icon: Brain,
    href: '/micro-tests',
  },
  {
    id: 'calculation',
    title: 'Есептеу дәлдігі',
    description: 'Арифметикалық операциялардың дәлдігі',
    duration: '5-8 мин',
    icon: Calculator,
    href: '/micro-tests',
  },
  {
    id: 'pressure',
    title: 'Қысым астындағы шешім қабылдау',
    description: 'Уақыт шектеуіндегі өнімділік',
    duration: '8-10 мин',
    icon: Clock,
    href: '/micro-tests',
  },
  {
    id: 'text',
    title: 'Мәтінді талдау микро-модулі',
    description: 'Мәтінді түсіну және талдау қабілеті',
    duration: '6-8 мин',
    icon: FileText,
    href: '/micro-tests',
  },
]

export default function DiagnosticsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero */}
      <section className="bg-slate-950 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Microscope className="w-8 h-8 text-blue-400" strokeWidth={1.75} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Когнитивті диагностика
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            5-10 минуттық микро-модульдер арқылы когнитивті қабілеттерді жедел бағалау
          </p>
          <Link
            href="/micro-tests"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-lg transition-all"
          >
            Барлық модульдер
            <ArrowRight className="w-5 h-5" strokeWidth={2} />
          </Link>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Диагностика модульдері</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {modules.map((module) => (
              <Link
                key={module.id}
                href={module.href}
                className="group bg-slate-50 border border-slate-200 rounded-xl p-6 hover:bg-white hover:shadow-lg hover:border-slate-300 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <module.icon className="w-6 h-6 text-blue-600" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{module.title}</h3>
                    <p className="text-slate-600 text-sm mb-3">{module.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{module.duration}</span>
                      <span className="text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                        Бастау →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Диагностика нәтижелері</h2>
          <p className="text-slate-600 mb-8">
            Әр модульден кейін сіз 3 деңгейлі бағалау аласыз: Жоғары, Орташа немесе Төмен. 
            Нәтижелер сіздің жеке панеліңізде сақталады.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-all"
          >
            Нәтижелерді көру
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>
      </section>
    </div>
  )
}
