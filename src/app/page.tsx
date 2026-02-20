'use client'

import Link from 'next/link'
import {
  GameCardIcon,
  BrainCog,
  ClipboardCheck,
  Microscope,
  Brain,
  Puzzle,
  Calculator,
  MessageSquare,
  BookOpen,
  BrainCircuit,
  Zap,
  Sparkles,
  Search,
  Globe,
  Users,
  Flag,
  Castle,
  Timer,
  Scale,
  Lightbulb,
  GraduationCap,
  Target,
  BarChart3,
} from '@/components/icons'
import { Navigation } from '@/components/Navigation'
import { ArrowRight, ChevronRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-slate-950 pt-32 pb-28 overflow-hidden">
        {/* Radial glow layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-400/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-[0.02em]"
            style={{ textShadow: '0 0 80px rgba(59, 130, 246, 0.15)' }}
          >
            MathForce AI
          </h2>
          <div className="w-24 h-[2px] mx-auto bg-gradient-to-r from-blue-500 to-cyan-400 mt-6 mb-6"></div>
          
          <p className="text-lg sm:text-xl text-slate-400 font-light mb-5">
            Қабілетке негізделген білім моделі
          </p>
          
          <p className="text-sm text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Математикалық интеллектті құрылымдық талдау, адаптивті модельдеу және дарын әлеуетін стратегиялық анықтау
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/training"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm text-slate-900 text-sm font-medium rounded-lg hover:bg-white transition-all"
            >
              Жүйені бастау
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
            <Link
              href="/ubt"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.06] backdrop-blur-sm text-slate-300 text-sm font-medium rounded-lg border border-white/10 hover:bg-white/10 hover:border-white/15 transition-all"
            >
              ҰБТ моделдеу
              <ChevronRight className="w-4 h-4" strokeWidth={2} />
            </Link>
          </div>
        </div>

        {/* Bottom gradient divider */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700/40 to-transparent" />
      </section>

      {/* System Architecture Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-slate-500 tracking-[0.15em] uppercase mb-3">
              Жүйе құрылымы
            </p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
              Төрт деңгейлі модельдеу архитектурасы
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/training"
              className="group relative bg-slate-50 border border-slate-200 rounded-xl p-8 hover:bg-white hover:shadow-lg hover:border-slate-300 transition-all"
            >
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <GraduationCap className="w-7 h-7 text-emerald-600" strokeWidth={1.75} />
              </div>
              <div className="text-xs font-medium text-slate-400 tracking-wider uppercase mb-2">01</div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Бастауыш</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Адаптивті жаттығу және негізгі когнитивті дағдыларды дамыту
              </p>
              <div className="flex items-center text-emerald-600 font-medium text-sm group-hover:gap-2 transition-all">
                <span>Бастау</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
              </div>
            </Link>

            <Link
              href="/micro-tests"
              className="group relative bg-slate-50 border border-slate-200 rounded-xl p-8 hover:bg-white hover:shadow-lg hover:border-slate-300 transition-all"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Microscope className="w-7 h-7 text-blue-600" strokeWidth={1.75} />
              </div>
              <div className="text-xs font-medium text-slate-400 tracking-wider uppercase mb-2">02</div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Микродиагностика</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                5-10 минуттық құрылымдық диагностикалық модульдер
              </p>
              <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
                <span>Ашу</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
              </div>
            </Link>

            <Link
              href="/contest/competition-30"
              className="group relative bg-slate-50 border border-slate-200 rounded-xl p-8 hover:bg-white hover:shadow-lg hover:border-slate-300 transition-all"
            >
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                <ClipboardCheck className="w-7 h-7 text-amber-600" strokeWidth={1.75} />
              </div>
              <div className="text-xs font-medium text-slate-400 tracking-wider uppercase mb-2">03</div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">ҰБТ моделдеу</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Ұлттық тестілеу симуляциясы — 140 ұпай жүйесі
              </p>
              <div className="flex items-center text-amber-600 font-medium text-sm group-hover:gap-2 transition-all">
                <span>Тестті бастау</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
              </div>
            </Link>

            <Link
              href="/elite-modeling"
              className="group relative bg-slate-50 border border-slate-200 rounded-xl p-8 hover:bg-white hover:shadow-lg hover:border-slate-300 transition-all"
            >
              <div className="w-14 h-14 bg-slate-200 rounded-xl flex items-center justify-center mb-6">
                <BrainCog className="w-7 h-7 text-slate-700" strokeWidth={1.75} />
              </div>
              <div className="text-xs font-medium text-slate-400 tracking-wider uppercase mb-2">04</div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">Дарын әлеуетін модельдеу</h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Көпқабатты стратегиялық интеллект модельдеу
              </p>
              <div className="flex items-center text-slate-700 font-medium text-sm group-hover:gap-2 transition-all">
                <span>Модельдеу</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Statement */}
      <section className="py-24 bg-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
            &ldquo;Нәтиже емес.{' '}
            <span className="text-slate-500">Қабілет құрылымы.</span>&rdquo;
          </p>
          <p className="mt-8 text-lg text-slate-600 max-w-2xl mx-auto">
            Біз балаға баға бермейміз — біз оның когнитивтік құрылымын модельдейміз
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Target className="w-8 h-8 text-slate-400" strokeWidth={1.5} />
              </div>
              <p className="text-3xl font-bold text-slate-900">4</p>
              <p className="text-sm text-slate-600 mt-1">Модельдеу деңгейі</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Puzzle className="w-8 h-8 text-slate-400" strokeWidth={1.5} />
              </div>
              <p className="text-3xl font-bold text-slate-900">15+</p>
              <p className="text-sm text-slate-600 mt-1">Когнитивті ойындар</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-slate-400" strokeWidth={1.5} />
              </div>
              <p className="text-3xl font-bold text-slate-900">140</p>
              <p className="text-sm text-slate-600 mt-1">ҰБТ ұпай жүйесі</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <BrainCircuit className="w-8 h-8 text-slate-400" strokeWidth={1.5} />
              </div>
              <p className="text-3xl font-bold text-slate-900">∞</p>
              <p className="text-sm text-slate-600 mt-1">Адаптивті деңгейлер</p>
            </div>
          </div>
        </div>
      </section>

      {/* Games Center */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-slate-500 tracking-[0.15em] uppercase mb-3">
              Когнитивті жаттығулар
            </p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">
              Ойындар орталығы
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              15 мини-ойын — оқушылардың әртүрлі қабілеттерін байқау және дамыту
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <Link
              href="/logic-sprint"
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all text-center group"
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Puzzle className="w-6 h-6 text-purple-600" strokeWidth={1.75} />
                </div>
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Логикалық спринт</h4>
              <p className="text-xs text-slate-500">Логикалық заңдылық табу</p>
            </Link>

            <Link
              href="/mental-math"
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all text-center group"
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                  <Calculator className="w-6 h-6 text-amber-600" strokeWidth={1.75} />
                </div>
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Жылдам есеп</h4>
              <p className="text-xs text-slate-500">Жылдам арифметика</p>
            </Link>

            <Link
              href="/speech-1min"
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all text-center group"
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center group-hover:bg-rose-200 transition-colors">
                  <MessageSquare className="w-6 h-6 text-rose-600" strokeWidth={1.75} />
                </div>
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">1 минут сөйлеу</h4>
              <p className="text-xs text-slate-500">Сөйлеу шеберлігі</p>
            </Link>

            <Link
              href="/reading-mini"
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all text-center group"
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <BookOpen className="w-6 h-6 text-indigo-600" strokeWidth={1.75} />
                </div>
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Оқу түсіну</h4>
              <p className="text-xs text-slate-500">Түсіну қабілеті</p>
            </Link>

            <Link
              href="/flash-memory"
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all text-center group"
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center group-hover:bg-cyan-200 transition-colors">
                  <BrainCircuit className="w-6 h-6 text-cyan-600" strokeWidth={1.75} />
                </div>
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Flash Memory</h4>
              <p className="text-xs text-slate-500">Есте сақтау</p>
            </Link>

            <Link
              href="/reaction-light"
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all text-center group"
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center group-hover:bg-lime-200 transition-colors">
                  <Zap className="w-6 h-6 text-lime-600" strokeWidth={1.75} />
                </div>
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Реакция</h4>
              <p className="text-xs text-slate-500">Жылдам реакция</p>
            </Link>

            <Link
              href="/story-cards"
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all text-center group"
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center group-hover:bg-violet-200 transition-colors">
                  <Sparkles className="w-6 h-6 text-violet-600" strokeWidth={1.75} />
                </div>
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Story Cards</h4>
              <p className="text-xs text-slate-500">Шығармашылық</p>
            </Link>

            <Link
              href="/spot-difference"
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all text-center group"
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <Search className="w-6 h-6 text-emerald-600" strokeWidth={1.75} />
                </div>
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Айырмашылықты тап</h4>
              <p className="text-xs text-slate-500">Бақылау қабілеті</p>
            </Link>

            <Link
              href="/world-quick"
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all text-center group"
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                  <Globe className="w-6 h-6 text-teal-600" strokeWidth={1.75} />
                </div>
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Дүниетану Q&A</h4>
              <p className="text-xs text-slate-500">Білім деңгейі</p>
            </Link>

            <Link
              href="/team-strategy"
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all text-center group"
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                  <Users className="w-6 h-6 text-slate-600" strokeWidth={1.75} />
                </div>
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Командалық стратегия</h4>
              <p className="text-xs text-slate-500">Командалық ойлау</p>
            </Link>

            <Link
              href="/capture-flag"
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all text-center group"
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <Flag className="w-6 h-6 text-red-600" strokeWidth={1.75} />
                </div>
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Байрақты алу</h4>
              <p className="text-xs text-slate-500">Команда жарысы</p>
            </Link>

            <Link
              href="/castle-siege"
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all text-center group"
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Castle className="w-6 h-6 text-purple-600" strokeWidth={1.75} />
                </div>
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Қамал шабуылы</h4>
              <p className="text-xs text-slate-500">Стратегия</p>
            </Link>

            <Link
              href="/combo-rush"
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all text-center group"
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Timer className="w-6 h-6 text-orange-600" strokeWidth={1.75} />
                </div>
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Қатарынан шабуыл</h4>
              <p className="text-xs text-slate-500">Жылдам жауап</p>
            </Link>

            <Link
              href="/quick-judge"
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all text-center group"
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <Scale className="w-6 h-6 text-indigo-600" strokeWidth={1.75} />
                </div>
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Дұрыс/Бұрыс</h4>
              <p className="text-xs text-slate-500">Тез шешім</p>
            </Link>

            <Link
              href="/sentence-puzzle"
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all text-center group"
            >
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                  <Lightbulb className="w-6 h-6 text-teal-600" strokeWidth={1.75} />
                </div>
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Сөйлем жұмбағы</h4>
              <p className="text-xs text-slate-500">Құрастыру</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-white font-semibold">MathForce AI</p>
                <p className="text-slate-500 text-sm">Когнитивтік модельдеу платформасы</p>
              </div>
            </div>
            <div className="text-center md:text-right text-slate-500 text-sm">
              <p>Барлық ойындар мұғалім басқаратын режимде жұмыс істейді</p>
              <p className="mt-1">Сынып таңдағанда деңгей автоматты түрде өзгереді</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
