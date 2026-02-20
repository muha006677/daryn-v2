'use client'

import { use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { courseData } from '@/lib/courses'
import { ArrowLeft, BookOpen, ChevronRight, FileText } from 'lucide-react'

interface PageProps {
  params: Promise<{ grade: string }>
}

export default function GradePage({ params }: PageProps) {
  const { grade: gradeParam } = use(params)
  const router = useRouter()
  const gradeId = parseInt(gradeParam, 10)
  const grade = courseData[gradeId]

  if (!grade) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="pt-32 pb-20 text-center">
          <p className="text-slate-600">Сынып табылмады</p>
          <Link href="/courses" className="text-indigo-600 hover:underline mt-4 inline-block">
            Курстарға оралу
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero */}
      <section className="bg-slate-950 pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push('/courses')}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            <span className="text-sm">Курстар</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-indigo-400" strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {grade.label}
              </h1>
              <p className="text-slate-400 mt-1">{grade.topics.length} тақырып</p>
            </div>
          </div>
        </div>
      </section>

      {/* Topics List */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Тақырыптар</h2>
          
          <div className="space-y-3">
            {grade.topics.map((topic, index) => (
              <Link
                key={topic.id}
                href={`/courses/${gradeId}/${topic.id}`}
                className="group flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-5 hover:bg-white hover:shadow-md hover:border-indigo-200 transition-all"
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-semibold group-hover:bg-indigo-200 transition-colors">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900">{topic.title}</h3>
                  <p className="text-sm text-slate-500 truncate">{topic.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
                    {topic.questions.length} есеп
                  </span>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" strokeWidth={1.75} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-slate-600" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {grade.topics.reduce((sum, t) => sum + t.questions.length, 0)}
                </p>
                <p className="text-slate-600">Жалпы есептер саны</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
