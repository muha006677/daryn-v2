'use client'

import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { gradeList } from '@/lib/courses'
import { BookOpen, ChevronRight, GraduationCap } from 'lucide-react'

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero */}
      <section className="bg-slate-950 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-indigo-400" strokeWidth={1.75} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Математика курсы
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            5–11 сынып оқушыларына арналған құрылымдалған математика курсы
          </p>
        </div>
      </section>

      {/* Grade List */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">
            Сыныпты таңдаңыз
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gradeList.map((grade) => (
              <Link
                key={grade.id}
                href={`/courses/${grade.id}`}
                className="group relative bg-slate-50 border border-slate-200 rounded-xl p-6 hover:bg-white hover:shadow-lg hover:border-indigo-200 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                    <GraduationCap className="w-7 h-7 text-indigo-600" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900">{grade.label}</h3>
                    <p className="text-sm text-slate-500">{grade.topicCount} тақырып</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" strokeWidth={1.75} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-indigo-600 mb-2">7</p>
              <p className="text-slate-600">Сынып деңгейі</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-indigo-600 mb-2">21+</p>
              <p className="text-slate-600">Тақырыптар</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-indigo-600 mb-2">100+</p>
              <p className="text-slate-600">Жаттығу есептері</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
