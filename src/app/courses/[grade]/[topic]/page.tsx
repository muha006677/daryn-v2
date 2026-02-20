'use client'

import { use, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { courseData, calculateResults, AnswerState, Question, PracticeResult } from '@/lib/courses'
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Trophy, ChevronRight } from 'lucide-react'

interface PageProps {
  params: Promise<{ grade: string; topic: string }>
}

export default function TopicPracticePage({ params }: PageProps) {
  const { grade: gradeParam, topic: topicParam } = use(params)
  const router = useRouter()
  const gradeId = parseInt(gradeParam, 10)
  const grade = courseData?.[gradeId]
  const topic = grade?.topics?.[topicParam]

  const [answers, setAnswers] = useState<AnswerState>({})
  const [result, setResult] = useState<PracticeResult | null>(null)
  const [showExplanations, setShowExplanations] = useState(false)

  const handleSingleAnswer = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }, [])

  const handleMultipleAnswer = useCallback((questionId: string, value: string, checked: boolean) => {
    setAnswers((prev) => {
      const current = (prev[questionId] as string[]) || []
      if (checked) {
        return { ...prev, [questionId]: [...current, value] }
      } else {
        return { ...prev, [questionId]: current.filter((v) => v !== value) }
      }
    })
  }, [])

  const handleInputAnswer = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }, [])

  const handleSubmit = () => {
    if (!topic) return
    const questions = topic.questions ?? []
    const practiceResult = calculateResults(questions, answers)
    setResult(practiceResult)
    setShowExplanations(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReset = () => {
    setAnswers({})
    setResult(null)
    setShowExplanations(false)
  }

  if (!grade || !topic) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="pt-32 pb-20 text-center">
          <p className="text-slate-600">Тақырып табылмады</p>
          <Link href="/courses" className="text-indigo-600 hover:underline mt-4 inline-block">
            Курстарға оралу
          </Link>
        </div>
      </div>
    )
  }

  const getQuestionResult = (questionId: string) => {
    return result?.results.find((r) => r.questionId === questionId)
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navigation />

      {/* Header */}
      <section className="bg-slate-950 pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push(`/courses/${gradeId}`)}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            <span className="text-sm">{`${gradeParam} сынып`}</span>
          </button>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {topic.title}
          </h1>
          <p className="text-slate-400 mt-2">{topic.description}</p>
        </div>
      </section>

      {/* Result Summary */}
      {result && (
        <section className="py-6 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                  result.percentage >= 80 ? 'bg-emerald-100' : 
                  result.percentage >= 50 ? 'bg-amber-100' : 'bg-red-100'
                }`}>
                  <Trophy className={`w-8 h-8 ${
                    result.percentage >= 80 ? 'text-emerald-600' : 
                    result.percentage >= 50 ? 'text-amber-600' : 'text-red-600'
                  }`} strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">{result.percentage}%</p>
                  <p className="text-slate-600">
                    {result.correctAnswers} / {result.totalQuestions} дұрыс • {result.earnedPoints} / {result.totalPoints} ұпай
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-all"
                >
                  <RotateCcw className="w-4 h-4" strokeWidth={2} />
                  Қайта бастау
                </button>
                <Link
                  href={`/courses/${gradeId}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all"
                >
                  Келесі тақырып
                  <ChevronRight className="w-4 h-4" strokeWidth={2} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Questions */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {(topic.questions ?? []).map((question: any, index: number) => {
            const qResult = getQuestionResult(question.id)
            
            return (
              <div
                key={question.id}
                className={`bg-white border rounded-xl p-6 transition-all ${
                  qResult 
                    ? qResult.isCorrect 
                      ? 'border-emerald-200 bg-emerald-50/30' 
                      : 'border-red-200 bg-red-50/30'
                    : 'border-slate-200'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start gap-3 mb-4">
                  <span className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${
                    qResult 
                      ? qResult.isCorrect 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-red-100 text-red-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{question.question}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {question.type === 'single' ? 'Бір жауап' : question.type === 'multiple' ? 'Көп жауап' : 'Енгізу'}
                      </span>
                      <span className="text-xs text-slate-500">{question.points} ұпай</span>
                    </div>
                  </div>
                  {qResult && (
                    qResult.isCorrect 
                      ? <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" strokeWidth={1.75} />
                      : <XCircle className="w-6 h-6 text-red-500 shrink-0" strokeWidth={1.75} />
                  )}
                </div>

                {/* Options */}
                <div className="space-y-2 ml-11">
                  {question.type === 'single' && question.options?.map((option: any, optIndex: number) => {
                    const isSelected = answers[question.id] === option
                    const isCorrect = showExplanations && option === question.correctAnswer
                    const isWrong = showExplanations && isSelected && option !== question.correctAnswer
                    
                    return (
                      <label
                        key={optIndex}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          isCorrect ? 'border-emerald-300 bg-emerald-50' :
                          isWrong ? 'border-red-300 bg-red-50' :
                          isSelected ? 'border-indigo-300 bg-indigo-50' :
                          'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        } ${result ? 'pointer-events-none' : ''}`}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={isSelected}
                          onChange={() => handleSingleAnswer(question.id, option)}
                          disabled={!!result}
                          className="w-4 h-4 text-indigo-600"
                        />
                        <span className={`text-sm ${isCorrect ? 'text-emerald-700 font-medium' : isWrong ? 'text-red-700' : 'text-slate-700'}`}>
                          {option}
                        </span>
                      </label>
                    )
                  })}

                  {question.type === 'multiple' && question.options?.map((option: any, optIndex: number) => {
                    const selectedOptions = (answers[question.id] as string[]) || []
                    const isSelected = selectedOptions.includes(option)
                    const correctAnswers = question.correctAnswer as string[]
                    const isCorrect = showExplanations && correctAnswers.includes(option)
                    const isWrong = showExplanations && isSelected && !correctAnswers.includes(option)
                    
                    return (
                      <label
                        key={optIndex}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          isCorrect ? 'border-emerald-300 bg-emerald-50' :
                          isWrong ? 'border-red-300 bg-red-50' :
                          isSelected ? 'border-indigo-300 bg-indigo-50' :
                          'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        } ${result ? 'pointer-events-none' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleMultipleAnswer(question.id, option, e.target.checked)}
                          disabled={!!result}
                          className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <span className={`text-sm ${isCorrect ? 'text-emerald-700 font-medium' : isWrong ? 'text-red-700' : 'text-slate-700'}`}>
                          {option}
                        </span>
                      </label>
                    )
                  })}

                  {question.type === 'input' && (
                    <div>
                      <input
                        type="text"
                        value={(answers[question.id] as string) || ''}
                        onChange={(e) => handleInputAnswer(question.id, e.target.value)}
                        disabled={!!result}
                        placeholder="Жауабыңызды жазыңыз..."
                        className={`w-full max-w-xs px-4 py-3 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          result ? 'bg-slate-50' : 'bg-white border-slate-200'
                        }`}
                      />
                      {showExplanations && (
                        <p className="mt-2 text-sm text-emerald-600">
                          Дұрыс жауап: {question.correctAnswer}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Explanation */}
                {showExplanations && question.explanation && (
                  <div className="mt-4 ml-11 p-4 bg-slate-100 rounded-lg">
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">Түсіндірме:</span> {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Submit Button */}
      {!result && (
        <section className="py-8 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <p className="text-slate-600">
                {Object.keys(answers).length} / {(topic.questions ?? []).length} сұраққа жауап берілді
              </p>
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length === 0}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
              >
                Тексеру
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
