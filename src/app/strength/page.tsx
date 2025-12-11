'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStudentName } from '@/hooks/useStudentName'
import { getResults, clearResults } from '@/lib/results/resultsStore'
import { analyzeStrength, type StrengthReport } from '@/lib/strength/strengthEngine'
import type { GameResult } from '@/types/results'

// Domain 到页面的映射
const DOMAIN_ROUTES: Record<string, string> = {
  'math': '/contest/math-logic',
  'math_logic': '/contest/math-logic',
  'math_ultra': '/contest/math-ultra',
  'logic': '/logic-sprint',
  'logic-sprint': '/logic-sprint',
  'kaz-lang': '/contest/kaz-lang',
  'kaz_lang_lit': '/contest/kaz-lang',
  'kaz_lang': '/contest/kaz-lang',
  'kaz-lit': '/contest/kaz-lit',
  'kaz_lit': '/contest/kaz-lit',
  'kaz_poem': '/contest/kaz-poem',
  'kaz_essay': '/contest/kaz-essay',
  'english': '/contest/competition-30',
  'science': '/contest/competition-30',
  'natural_science': '/contest/competition-30',
  'alem': '/world-quick',
  'world_studies': '/world-quick',
  'world-quick': '/world-quick',
  'memory': '/flash-memory',
  'flash-memory': '/flash-memory',
  'reaction': '/reaction-light',
  'reaction-light': '/reaction-light',
  'reading': '/reading-mini',
  'reading-mini': '/reading-mini',
  'mixed': '/contest/competition-30',
  'capture-flag': '/capture-flag',
  'castle-siege': '/castle-siege',
  'combo-rush': '/combo-rush',
  'quick-judge': '/quick-judge',
  'sentence-puzzle': '/sentence-puzzle',
}

function getRouteForDomain(domain: string): string {
  return DOMAIN_ROUTES[domain] || '/'
}

export default function StrengthPage() {
  const router = useRouter()
  const { name, clearName, isLoading: nameLoading } = useStudentName()
  const [results, setResults] = useState<GameResult[]>([])
  const [report, setReport] = useState<StrengthReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const loadData = () => {
      const gameResults = getResults()
      setResults(gameResults)
      const analysis = analyzeStrength(gameResults)
      setReport(analysis)
      setIsLoading(false)
    }

    loadData()
  }, [])

  const handleClearResults = () => {
    if (confirm('Барлық нәтижелерді жоюға сенімдісіз бе?')) {
      clearResults()
      setResults([])
      const analysis = analyzeStrength([])
      setReport(analysis)
    }
  }

  const handleChangeName = () => {
    clearName()
    router.push('/start')
  }

  if (nameLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-slate-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Жүктелуде...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!name) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-slate-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-200 p-8 max-w-md mx-auto text-center">
            <div className="text-5xl mb-4">👤</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Атыңызды енгізіңіз</h2>
            <p className="text-slate-600 mb-6">
              Нәтижелерді көру үшін алдымен атыңызды енгізу керек.
            </p>
            <Link
              href="/start"
              className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:opacity-90 transition-all"
            >
              Атын енгізу
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Басты бетке қайту
        </Link>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📊</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Күшті жақтары мен дамыту аймақтары</h1>
          <p className="text-slate-600 mb-4">Сәлем, {name}!</p>
          {report && (
            <p className="text-slate-500 text-sm">{report.summary}</p>
          )}
        </div>

        {report && (
          <div className="space-y-8">
            {/* 优势卡片 */}
            {report.topStrengths.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Күшті жақтары</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {report.topStrengths.map((strength, idx) => {
                    const domainKey = Object.keys(DOMAIN_ROUTES).find(
                      k => strength.domain === DOMAIN_ROUTES[k] || strength.domain.includes(k)
                    ) || 'mixed'
                    const route = getRouteForDomain(domainKey)

                    return (
                      <div
                        key={idx}
                        className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-emerald-700">{strength.domain}</h3>
                          <div className="text-3xl font-bold text-emerald-600">{strength.score}</div>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">{strength.evidence}</p>
                        <Link
                          href={route}
                          className="block w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg text-center transition-all"
                        >
                          Жаттығуға өту →
                        </Link>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 弱势卡片 */}
            {report.weakAreas.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Дамытуды қажет етеді</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {report.weakAreas.map((weak, idx) => {
                    const domainKey = Object.keys(DOMAIN_ROUTES).find(
                      k => weak.domain === DOMAIN_ROUTES[k] || weak.domain.includes(k)
                    ) || 'mixed'
                    const route = getRouteForDomain(domainKey)

                    return (
                      <div
                        key={idx}
                        className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-amber-700">{weak.domain}</h3>
                          <div className="text-3xl font-bold text-amber-600">{weak.score}</div>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">{weak.evidence}</p>
                        <Link
                          href={route}
                          className="block w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg text-center transition-all"
                        >
                          Жаттығуға өту →
                        </Link>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 空状态 */}
            {report.topStrengths.length === 0 && report.weakAreas.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-8 text-center">
                <div className="text-5xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Әлі нәтижелер жоқ</h3>
                <p className="text-slate-600 mb-6">
                  Ойындарды ойнап, нәтижелерді жинаңыз. Содан кейін күшті жақтарыңызды көре аласыз.
                </p>
                <Link
                  href="/"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:opacity-90 transition-all"
                >
                  Ойындарға өту
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 操作按钮 */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleClearResults}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all"
          >
            Нәтижелерді тазалау
          </button>
          <button
            onClick={handleChangeName}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all"
          >
            Атын өзгерту
          </button>
        </div>
      </div>
    </div>
  )
}

