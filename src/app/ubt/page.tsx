'use client'

import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { ClipboardCheck, Clock, Target, BarChart3, ArrowRight } from 'lucide-react'

export default function UBTPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero */}
      <section className="bg-slate-950 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ClipboardCheck className="w-8 h-8 text-amber-400" strokeWidth={1.75} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            ҰБТ моделдеу
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            Ұлттық бірыңғай тестілеу симуляциясы — нақты емтихан форматында дайындық
          </p>
          <Link
            href="/contest/competition-30"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-all"
          >
            Тестті бастау
            <ArrowRight className="w-5 h-5" strokeWidth={2} />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-slate-600" strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">4 сағат уақыт</h3>
              <p className="text-slate-600 text-sm">Нақты емтихан форматындағы уақыт шектеуі</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-slate-600" strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">140 ұпай</h3>
              <p className="text-slate-600 text-sm">5 пән бойынша толық бағалау жүйесі</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-slate-600" strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Толық есеп</h3>
              <p className="text-slate-600 text-sm">Диагностикалық талдау және ұсыныстар</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Тест құрылымы</h2>
          <div className="space-y-4">
            {[
              { name: 'Оқу сауаттылығы', questions: 10, points: 10 },
              { name: 'Логикалық математика', questions: 10, points: 10 },
              { name: 'Қазақстан тарихы', questions: 20, points: 20 },
              { name: 'Математика', questions: 40, points: 50 },
              { name: 'Физика', questions: 40, points: 50 },
            ].map((subject) => (
              <div
                key={subject.name}
                className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-5"
              >
                <span className="font-medium text-slate-900">{subject.name}</span>
                <div className="flex items-center gap-6 text-sm text-slate-600">
                  <span>{subject.questions} сұрақ</span>
                  <span className="font-semibold text-slate-900">{subject.points} ұпай</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold text-slate-900">Барлығы: 140 ұпай</p>
          </div>
        </div>
      </section>
    </div>
  )
}
