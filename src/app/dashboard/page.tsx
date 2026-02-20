'use client'

import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { 
  LayoutDashboard, 
  Brain, 
  ClipboardCheck, 
  Microscope, 
  TrendingUp, 
  Clock,
  Target,
  ArrowRight,
  BarChart3
} from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navigation />

      {/* Header */}
      <section className="bg-slate-950 pt-32 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-7 h-7 text-white" strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Менің панелім</h1>
              <p className="text-slate-400">Жеке нәтижелер мен прогресс</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-8 -mt-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600" strokeWidth={1.75} />
                </div>
                <span className="text-xs text-slate-500">Бүгін</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">78%</p>
              <p className="text-sm text-slate-600">Жалпы дәлдік</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" strokeWidth={1.75} />
                </div>
                <span className="text-xs text-emerald-600">+12%</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">156</p>
              <p className="text-sm text-slate-600">Шешілген есептер</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" strokeWidth={1.75} />
                </div>
                <span className="text-xs text-slate-500">Орташа</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">2.4 мин</p>
              <p className="text-sm text-slate-600">Бір есепке уақыт</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" strokeWidth={1.75} />
                </div>
                <span className="text-xs text-slate-500">Деңгей</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">7</p>
              <p className="text-sm text-slate-600">Қиындық деңгейі</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link
              href="/training"
              className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-slate-300 transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-emerald-600" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Менің жаттығуларым</h3>
                  <p className="text-sm text-slate-500">Адаптивті тренинг</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Соңғы сессия: 2 сағат бұрын</span>
                <span className="text-emerald-600 font-medium group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>

            <Link
              href="/ubt"
              className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-slate-300 transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <ClipboardCheck className="w-6 h-6 text-amber-600" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">ҰБТ нәтижелері</h3>
                  <p className="text-sm text-slate-500">Тест симуляциялары</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Соңғы ұпай: 112/140</span>
                <span className="text-amber-600 font-medium group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>

            <Link
              href="/diagnostics"
              className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-slate-300 transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Microscope className="w-6 h-6 text-blue-600" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Диагностика</h3>
                  <p className="text-sm text-slate-500">Когнитивті талдау</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">3 модуль аяқталды</span>
                <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Соңғы белсенділік</h2>
            <div className="space-y-4">
              {[
                { action: 'Адаптивті жаттығу сессиясы', time: '2 сағат бұрын', score: '85%', type: 'training' },
                { action: 'ҰБТ симуляциясы аяқталды', time: '1 күн бұрын', score: '112/140', type: 'ubt' },
                { action: 'Логикалық реакция сынағы', time: '2 күн бұрын', score: 'Жоғары', type: 'diagnostic' },
                { action: 'Есептеу дәлдігі модулі', time: '3 күн бұрын', score: 'Орташа', type: 'diagnostic' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.type === 'training' ? 'bg-emerald-500' : 
                      item.type === 'ubt' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <p className="text-slate-900 font-medium">{item.action}</p>
                      <p className="text-xs text-slate-500">{item.time}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-slate-700">{item.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
