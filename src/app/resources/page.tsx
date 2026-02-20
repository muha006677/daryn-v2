'use client'

import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { FileText, BookOpen, Trophy, Download, ArrowRight, Folder } from 'lucide-react'

const resources = [
  {
    id: 'lesson-plans',
    title: 'Сабақ жоспары',
    description: 'Мұғалімдерге арналған дайын сабақ жоспарлары',
    icon: BookOpen,
    count: 24,
    href: '/worksheet',
  },
  {
    id: 'worksheets',
    title: 'Жұмыс парағы',
    description: 'Оқушыларға арналған жаттығу парақтары',
    icon: FileText,
    count: 48,
    href: '/worksheet',
  },
  {
    id: 'olympiad',
    title: 'Олимпиада тапсырмалары',
    description: 'Олимпиадаға дайындық материалдары',
    icon: Trophy,
    count: 120,
    href: '/training',
  },
]

const categories = [
  { name: 'Математика', count: 86 },
  { name: 'Физика', count: 42 },
  { name: 'Логика', count: 28 },
  { name: 'Оқу сауаттылығы', count: 36 },
]

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero */}
      <section className="bg-slate-950 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Folder className="w-8 h-8 text-emerald-400" strokeWidth={1.75} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Ресурстар
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Мұғалімдер мен оқушыларға арналған оқу материалдары
          </p>
        </div>
      </section>

      {/* Resource Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <Link
                key={resource.id}
                href={resource.href}
                className="group bg-slate-50 border border-slate-200 rounded-xl p-6 hover:bg-white hover:shadow-lg hover:border-slate-300 transition-all"
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
                  <resource.icon className="w-7 h-7 text-emerald-600" strokeWidth={1.75} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{resource.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{resource.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">{resource.count} материал</span>
                  <span className="text-emerald-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                    Ашу →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Пәндер бойынша</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href="/training"
                className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow transition-all"
              >
                <span className="font-medium text-slate-900">{category.name}</span>
                <span className="text-sm text-slate-500">{category.count} материал</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Download className="w-6 h-6 text-slate-600" strokeWidth={1.75} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Материалдарды жүктеу</h2>
          <p className="text-slate-600 mb-8">
            Барлық материалдар PDF форматында жүктеуге қолжетімді
          </p>
          <Link
            href="/worksheet"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-all"
          >
            Жұмыс парақтарына өту
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>
      </section>
    </div>
  )
}
