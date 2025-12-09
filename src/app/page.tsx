import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900">Daryn V2</h1>
          <p className="text-slate-600 mt-1">Мұғалімдерге арналған AI көмекшісі</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Сыныптық диагностика + Дарындылықты анықтау
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Оқушылардың артықшылық бағыттарын анықтауға арналған жүйе
          </p>
        </div>
      </section>

      {/* Core Entry Cards */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Link
              href="/contest"
              className="group bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-8 hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-3xl mb-4">
                🏆
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Дарынды диагностика</h3>
              <p className="text-slate-600 mb-4">
                Жоғары деңгейлі тапсырмалар арқылы оқушылардың элиталық қабілеттерін анықтау
              </p>
              <div className="text-amber-600 font-semibold">Ашу →</div>
            </Link>

            <Link
              href="/logic-sprint"
              className="group bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-8 hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl mb-4">
                🎮
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Сыныптық турнир ойындары</h3>
              <p className="text-slate-600 mb-4">
                10 мини-турнир — оқушылардың әртүрлі қабілеттерін байқауға арналған ойындар
              </p>
              <div className="text-purple-600 font-semibold">Ашу →</div>
            </Link>

            <Link
              href="/worksheet"
              className="group bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-8 hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl mb-4">
                📝
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Жаттығу парақтары</h3>
              <p className="text-slate-600 mb-4">
                Оқушыларға арналған жеке тапсырмалар мен жаттығулар
              </p>
              <div className="text-blue-600 font-semibold">Ашу →</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Games Center */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Ойындар орталығы</h2>
            <p className="text-slate-600">10 мини-ойын — оқушылардың әртүрлі қабілеттерін байқау</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <Link
              href="/logic-sprint"
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-purple-300 transition-all text-center"
            >
              <div className="text-4xl mb-3">🧩</div>
              <h3 className="font-bold text-slate-900 mb-2">Логикалық спринт</h3>
              <p className="text-sm text-slate-600 mb-3">Логикалық заңдылық табу</p>
              <div className="text-purple-600 font-semibold text-sm">Ойынға кіру →</div>
            </Link>

            <Link
              href="/mental-math"
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-yellow-300 transition-all text-center"
            >
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-bold text-slate-900 mb-2">Жылдам есеп</h3>
              <p className="text-sm text-slate-600 mb-3">Жылдам арифметика</p>
              <div className="text-yellow-600 font-semibold text-sm">Ойынға кіру →</div>
            </Link>

            <Link
              href="/speech-1min"
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-red-300 transition-all text-center"
            >
              <div className="text-4xl mb-3">🎤</div>
              <h3 className="font-bold text-slate-900 mb-2">1 минут сөйлеу</h3>
              <p className="text-sm text-slate-600 mb-3">Сөйлеу шеберлігі</p>
              <div className="text-red-600 font-semibold text-sm">Ойынға кіру →</div>
            </Link>

            <Link
              href="/reading-mini"
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-indigo-300 transition-all text-center"
            >
              <div className="text-4xl mb-3">📖</div>
              <h3 className="font-bold text-slate-900 mb-2">Оқу түсіну</h3>
              <p className="text-sm text-slate-600 mb-3">Түсіну қабілеті</p>
              <div className="text-indigo-600 font-semibold text-sm">Ойынға кіру →</div>
            </Link>

            <Link
              href="/flash-memory"
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-cyan-300 transition-all text-center"
            >
              <div className="text-4xl mb-3">💫</div>
              <h3 className="font-bold text-slate-900 mb-2">Flash Memory</h3>
              <p className="text-sm text-slate-600 mb-3">Есте сақтау</p>
              <div className="text-cyan-600 font-semibold text-sm">Ойынға кіру →</div>
            </Link>

            <Link
              href="/reaction-light"
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-lime-300 transition-all text-center"
            >
              <div className="text-4xl mb-3">🚦</div>
              <h3 className="font-bold text-slate-900 mb-2">Реакция "Бағдаршам"</h3>
              <p className="text-sm text-slate-600 mb-3">Жылдам реакция</p>
              <div className="text-lime-600 font-semibold text-sm">Ойынға кіру →</div>
            </Link>

            <Link
              href="/story-cards"
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-violet-300 transition-all text-center"
            >
              <div className="text-4xl mb-3">🎭</div>
              <h3 className="font-bold text-slate-900 mb-2">Story Cards</h3>
              <p className="text-sm text-slate-600 mb-3">Шығармашылық</p>
              <div className="text-violet-600 font-semibold text-sm">Ойынға кіру →</div>
            </Link>

            <Link
              href="/spot-difference"
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-emerald-300 transition-all text-center"
            >
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-bold text-slate-900 mb-2">Айырмашылықты тап</h3>
              <p className="text-sm text-slate-600 mb-3">Бақылау қабілеті</p>
              <div className="text-emerald-600 font-semibold text-sm">Ойынға кіру →</div>
            </Link>

            <Link
              href="/world-quick"
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-teal-300 transition-all text-center"
            >
              <div className="text-4xl mb-3">🌍</div>
              <h3 className="font-bold text-slate-900 mb-2">Дүниетану Q&A</h3>
              <p className="text-sm text-slate-600 mb-3">Білім деңгейі</p>
              <div className="text-teal-600 font-semibold text-sm">Ойынға кіру →</div>
            </Link>

            <Link
              href="/team-strategy"
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-slate-300 transition-all text-center"
            >
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="font-bold text-slate-900 mb-2">Командалық стратегия</h3>
              <p className="text-sm text-slate-600 mb-3">Командалық ойлау</p>
              <div className="text-slate-600 font-semibold text-sm">Ойынға кіру →</div>
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
