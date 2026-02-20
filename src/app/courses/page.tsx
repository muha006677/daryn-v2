'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { categories, getGradesByCategory, courseData } from '@/lib/courses'
import { BookOpen, ChevronRight, ChevronDown, GraduationCap } from 'lucide-react'

export default function CoursesPage() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['primary', 'middle', 'high'])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const totalTopics = Object.values(courseData).reduce((sum, grade) => sum + grade.topics.length, 0)
  const totalQuestions = Object.values(courseData).reduce(
    (sum, grade) => sum + grade.topics.reduce((tSum, topic) => tSum + topic.questions.length, 0),
    0
  )

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
            1–11 сынып оқушыларына арналған құрылымдалған математика курсы
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {categories.map((category) => {
              const isExpanded = expandedCategories.includes(category.id)
              const grades = getGradesByCategory(category.id)

              return (
                <div
                  key={category.id}
                  className="border border-slate-200 rounded-xl overflow-hidden"
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${category.bgColor} rounded-xl flex items-center justify-center`}>
                        <GraduationCap className={`w-6 h-6 ${category.color}`} strokeWidth={1.75} />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold text-slate-900">
                          {category.labelKz}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {category.grades[0]}–{category.grades[category.grades.length - 1]} сынып • {grades.length} сынып
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
                    )}
                  </button>

                  {/* Grades List */}
                  {isExpanded && (
                    <div className="border-t border-slate-200 divide-y divide-slate-100">
                      {grades.map((grade) => (
                        <Link
                          key={grade.id}
                          href={`/courses/${grade.id}`}
                          className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-10 h-10 ${category.bgColor} rounded-lg flex items-center justify-center text-sm font-bold ${category.color}`}>
                              {grade.id}
                            </span>
                            <div>
                              <p className="font-medium text-slate-900">{grade.label}</p>
                              <p className="text-sm text-slate-500">{grade.topics.length} тақырып</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300" strokeWidth={1.75} />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-indigo-600 mb-2">11</p>
              <p className="text-slate-600">Сынып деңгейі</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-indigo-600 mb-2">{totalTopics}</p>
              <p className="text-slate-600">Тақырыптар</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-indigo-600 mb-2">{totalQuestions}+</p>
              <p className="text-slate-600">Жаттығу есептері</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">Жылдам қатынау</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {Object.values(courseData).map((grade) => {
              const category = categories.find((c) => c.grades.includes(grade.id))
              return (
                <Link
                  key={grade.id}
                  href={`/courses/${grade.id}`}
                  className={`px-4 py-2 ${category?.bgColor || 'bg-slate-100'} ${category?.color || 'text-slate-600'} rounded-lg font-medium text-sm hover:opacity-80 transition-opacity`}
                >
                  {grade.id} сынып
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
