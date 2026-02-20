'use client'

import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { BrainCog, Layers, TrendingUp, Sparkles, ArrowRight } from 'lucide-react'

export default function TalentPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero */}
      <section className="bg-slate-950 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BrainCog className="w-8 h-8 text-slate-300" strokeWidth={1.75} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Дарын әлеуетін модельдеу
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            Көпқабатты аналитикалық құрылымдар арқылы интеллектуалдық болжау жүйесі
          </p>
          <Link
            href="/elite-modeling"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-lg transition-all"
          >
            Модельдеуді бастау
            <ArrowRight className="w-5 h-5" strokeWidth={2} />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Модельдеу компоненттері</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-slate-700" strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Көпқабатты есептер</h3>
              <p className="text-slate-600 text-sm">
                Құрылымдық трансформация және көп қадамдық талдау қажет ететін тапсырмалар
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-slate-700" strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Адаптивті күрделілік</h3>
              <p className="text-slate-600 text-sm">
                Дәлдік пен уақытқа байланысты динамикалық қиындық өзгерісі
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-slate-700" strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Элиталық есеп</h3>
              <p className="text-slate-600 text-sm">
                Strategic Thinking Index, Cognitive Stability және Elite Potential көрсеткіштері
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Report Preview */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Есеп мазмұны</h2>
          <div className="bg-white border border-slate-200 rounded-xl p-8">
            <div className="space-y-6">
              {[
                { label: 'Strategic Thinking Index', desc: 'Стратегиялық ойлау индексі' },
                { label: 'Structural Adaptation Level', desc: 'Құрылымдық бейімделу деңгейі' },
                { label: 'Analytical Endurance Score', desc: 'Аналитикалық төзімділік ұпайы' },
                { label: 'Cognitive Stability Under Complexity', desc: 'Күрделілік астындағы когнитивті тұрақтылық' },
                { label: 'Elite Potential Index (0–100)', desc: 'Элиталық әлеует индексі' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="font-medium text-slate-900">{item.label}</p>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                  <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-slate-600 to-slate-400 rounded-full"
                      style={{ width: `${60 + i * 8}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
