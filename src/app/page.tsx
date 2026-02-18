'use client'

import Link from 'next/link'
import { useStudentName } from '@/hooks/useStudentName'
import {
  ModuleIcon,
  GameCardIcon,
  BrainCog,
  ClipboardCheck,
  Microscope,
  FileText,
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
  STROKE_WIDTH,
} from '@/components/icons'

export default function Home() {
  const { name } = useStudentName()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">MathForce AI</h1>
            <p className="text-slate-600 mt-1">Математикалық интеллектті динамикалық модельдеу платформасы</p>
          </div>
          {name && (
            <div className="text-right">
              <p className="text-sm text-slate-500">Сәлем,</p>
              <p className="text-lg font-semibold text-indigo-600">{name}</p>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            MathForce AI
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Математикалық интеллектті динамикалық модельдеу және дарын әлеуетін анықтау платформасы
          </p>
        </div>
      </section>

      {/* Core Entry Cards */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Link
              href="/elite-modeling"
              className="group bg-white border-2 border-slate-300 rounded-2xl p-8 hover:shadow-xl hover:border-slate-400 transition-all"
            >
              <ModuleIcon icon={BrainCog} bgColor="bg-slate-900" />
              <h3 className="text-2xl font-bold text-slate-900 mb-3 mt-4">Дарын әлеуетін стратегиялық модельдеу</h3>
              <p className="text-slate-600 mb-4">
                Көпқабатты аналитикалық құрылымдар арқылы интеллектуалдық болжау
              </p>
              <div className="text-slate-700 font-semibold">Модельдеуді бастау →</div>
            </Link>

            <Link
              href="/contest/competition-30"
              className="group bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 rounded-2xl p-8 hover:shadow-xl transition-all"
            >
              <ModuleIcon icon={ClipboardCheck} bgColor="bg-slate-900" />
              <h3 className="text-2xl font-bold text-slate-900 mb-3 mt-4">ҰБТға дайындық тест</h3>
              <p className="text-slate-600 mb-4">
                Ұлттық бірыңғай тестілеу симуляциясы: Оқу сауаттылығы, Логика, Қазақстан тарихы, Математика, Физика — 140 ұпай
              </p>
              <div className="text-slate-700 font-semibold">Тестті бастау →</div>
            </Link>

            <Link
              href="/micro-tests"
              className="group bg-white border-2 border-slate-300 rounded-2xl p-8 hover:shadow-xl transition-all"
            >
              <ModuleIcon icon={Microscope} bgColor="bg-slate-800" />
              <h3 className="text-2xl font-bold text-slate-900 mb-3 mt-4">Интеллектуалды микросынақтар</h3>
              <p className="text-slate-600 mb-4">
                5–10 минуттық құрылымдалған микро-модульдер. Оқушылардың логикасы, есептеу дәлдігі және қысым астындағы тұрақтылығын жедел бағалауға арналған.
              </p>
              <div className="text-slate-700 font-semibold">Модульдерді ашу →</div>
            </Link>

            <Link
              href="/worksheet"
              className="group bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-8 hover:shadow-xl transition-all"
            >
              <ModuleIcon icon={FileText} bgColor="bg-blue-600" />
              <h3 className="text-2xl font-bold text-slate-900 mb-3 mt-4">Жаттығу парақтары</h3>
              <p className="text-slate-600 mb-4">
                Оқушыларға арналған жеке тапсырмалар мен жаттығулар
              </p>
              <div className="text-blue-600 font-semibold">Ашу →</div>
            </Link>

            <Link
              href="/training"
              className="group bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-8 hover:shadow-xl transition-all"
            >
              <ModuleIcon icon={Brain} bgColor="bg-emerald-600" />
              <h3 className="text-2xl font-bold text-slate-900 mb-3 mt-4">Адаптивті жаттығу</h3>
              <p className="text-slate-600 mb-4">
                Шексіз математика тренингі — деңгей автоматты түрде бейімделеді
              </p>
              <div className="text-emerald-600 font-semibold">Бастау →</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Games Center */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Ойындар орталығы</h2>
            <p className="text-slate-600">15 мини-ойын — оқушылардың әртүрлі қабілеттерін байқау</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <Link
              href="/logic-sprint"
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-purple-300 transition-all text-center"
            >
              <div className="flex justify-center mb-3">
                <GameCardIcon icon={Puzzle} color="bg-purple-500" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Логикалық спринт</h3>
              <p className="text-sm text-slate-600 mb-3">Логикалық заңдылық табу</p>
              <div className="text-purple-600 font-semibold text-sm">Ойынға кіру →</div>
            </Link>

            <Link
              href="/mental-math"
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-amber-300 transition-all text-center"
            >
              <div className="flex justify-center mb-3">
                <GameCardIcon icon={Calculator} color="bg-amber-500" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Жылдам есеп</h3>
              <p className="text-sm text-slate-600 mb-3">Жылдам арифметика</p>
              <div className="text-amber-600 font-semibold text-sm">Ойынға кіру →</div>
            </Link>

            <Link
              href="/speech-1min"
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-rose-300 transition-all text-center"
            >
              <div className="flex justify-center mb-3">
                <GameCardIcon icon={MessageSquare} color="bg-rose-500" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">1 минут сөйлеу</h3>
              <p className="text-sm text-slate-600 mb-3">Сөйлеу шеберлігі</p>
              <div className="text-rose-600 font-semibold text-sm">Ойынға кіру →</div>
            </Link>

            <Link
              href="/reading-mini"
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-indigo-300 transition-all text-center"
            >
              <div className="flex justify-center mb-3">
                <GameCardIcon icon={BookOpen} color="bg-indigo-500" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Оқу түсіну</h3>
              <p className="text-sm text-slate-600 mb-3">Түсіну қабілеті</p>
              <div className="text-indigo-600 font-semibold text-sm">Ойынға кіру →</div>
            </Link>

            <Link
              href="/flash-memory"
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-cyan-300 transition-all text-center"
            >
              <div className="flex justify-center mb-3">
                <GameCardIcon icon={BrainCircuit} color="bg-cyan-500" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Flash Memory</h3>
              <p className="text-sm text-slate-600 mb-3">Есте сақтау</p>
              <div className="text-cyan-600 font-semibold text-sm">Ойынға кіру →</div>
            </Link>

            <Link
              href="/reaction-light"
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-lime-300 transition-all text-center"
            >
              <div className="flex justify-center mb-3">
                <GameCardIcon icon={Zap} color="bg-lime-500" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Реакция &quot;Бағдаршам&quot;</h3>
              <p className="text-sm text-slate-600 mb-3">Жылдам реакция</p>
              <div className="text-lime-600 font-semibold text-sm">Ойынға кіру →</div>
            </Link>

            <Link
              href="/story-cards"
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-violet-300 transition-all text-center"
            >
              <div className="flex justify-center mb-3">
                <GameCardIcon icon={Sparkles} color="bg-violet-500" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Story Cards</h3>
              <p className="text-sm text-slate-600 mb-3">Шығармашылық</p>
              <div className="text-violet-600 font-semibold text-sm">Ойынға кіру →</div>
            </Link>

            <Link
              href="/spot-difference"
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-emerald-300 transition-all text-center"
            >
              <div className="flex justify-center mb-3">
                <GameCardIcon icon={Search} color="bg-emerald-500" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Айырмашылықты тап</h3>
              <p className="text-sm text-slate-600 mb-3">Бақылау қабілеті</p>
              <div className="text-emerald-600 font-semibold text-sm">Ойынға кіру →</div>
            </Link>

            <Link
              href="/world-quick"
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-teal-300 transition-all text-center"
            >
              <div className="flex justify-center mb-3">
                <GameCardIcon icon={Globe} color="bg-teal-500" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Дүниетану Q&A</h3>
              <p className="text-sm text-slate-600 mb-3">Білім деңгейі</p>
              <div className="text-teal-600 font-semibold text-sm">Ойынға кіру →</div>
            </Link>

            <Link
              href="/team-strategy"
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-slate-300 transition-all text-center"
            >
              <div className="flex justify-center mb-3">
                <GameCardIcon icon={Users} color="bg-slate-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Командалық стратегия</h3>
              <p className="text-sm text-slate-600 mb-3">Командалық ойлау</p>
              <div className="text-slate-600 font-semibold text-sm">Ойынға кіру →</div>
            </Link>

            <Link
              href="/capture-flag"
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-red-300 transition-all text-center"
            >
              <div className="flex justify-center mb-3">
                <GameCardIcon icon={Flag} color="bg-red-500" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Байрақты алу</h3>
              <p className="text-sm text-slate-600 mb-3">Екі команда байраққа жарысады</p>
              <div className="text-red-600 font-semibold text-sm">Ойынға кіру →</div>
            </Link>

            <Link
              href="/castle-siege"
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-purple-300 transition-all text-center"
            >
              <div className="flex justify-center mb-3">
                <GameCardIcon icon={Castle} color="bg-purple-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Қамал шабуылы</h3>
              <p className="text-sm text-slate-600 mb-3">Екі команда қамалды қорғайды</p>
              <div className="text-purple-600 font-semibold text-sm">Ойынға кіру →</div>
            </Link>

            <Link
              href="/combo-rush"
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-orange-300 transition-all text-center"
            >
              <div className="flex justify-center mb-3">
                <GameCardIcon icon={Timer} color="bg-orange-500" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Қатарынан шабуыл</h3>
              <p className="text-sm text-slate-600 mb-3">Жылдам жауап беру және қатарынан дұрыс</p>
              <div className="text-orange-600 font-semibold text-sm">Ойынға кіру →</div>
            </Link>

            <Link
              href="/quick-judge"
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-indigo-300 transition-all text-center"
            >
              <div className="flex justify-center mb-3">
                <GameCardIcon icon={Scale} color="bg-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Дұрыс/Бұрыс тез шешім</h3>
              <p className="text-sm text-slate-600 mb-3">Жылдам дұрыс немесе бұрыс деп анықтау</p>
              <div className="text-indigo-600 font-semibold text-sm">Ойынға кіру →</div>
            </Link>

            <Link
              href="/sentence-puzzle"
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-teal-300 transition-all text-center"
            >
              <div className="flex justify-center mb-3">
                <GameCardIcon icon={Lightbulb} color="bg-teal-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Сөйлем жұмбағы</h3>
              <p className="text-sm text-slate-600 mb-3">Сөйлемді дұрыс ретпен құрастыру</p>
              <div className="text-teal-600 font-semibold text-sm">Ойынға кіру →</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-600 text-sm">
          <p>Барлық ойындар мұғалім басқаратын режимде жұмыс істейді</p>
          <p className="mt-2">Сынып таңдағанда деңгей автоматты түрде өзгереді (1–6 сынып)</p>
        </div>
      </footer>
    </div>
  )
}
