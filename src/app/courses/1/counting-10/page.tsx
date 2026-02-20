'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { generateQuestionBank, lesson1Config } from '@/lib/courses/generators/grade1Lesson1'
import { Question } from '@/lib/courses'
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Trophy, ChevronRight, Star } from 'lucide-react'

interface AnswerState {
  [questionId: string]: string
}

interface ResultState {
  [questionId: string]: boolean
}

export default function Counting10Page() {
  const [questionBank, setQuestionBank] = useState<Question[]>([])
  const [usedIds, setUsedIds] = useState<Set<string>>(new Set())
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<AnswerState>({})
  const [results, setResults] = useState<ResultState>({})
  const [showResults, setShowResults] = useState(false)
  const [totalScore, setTotalScore] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)

  const questionsPerBatch = lesson1Config.questionsPerBatch

  useEffect(() => {
    const bank = generateQuestionBank(lesson1Config.totalQuestions)
    setQuestionBank(bank)
    setIsInitialized(true)
  }, [])

  const loadNextBatch = useCallback(() => {
    if (questionBank.length === 0) return

    const availableQuestions = questionBank.filter((q) => !usedIds.has(q.id))
    
    if (availableQuestions.length === 0) {
      setUsedIds(new Set())
      const shuffled = [...questionBank].sort(() => Math.random() - 0.5)
      setCurrentQuestions(shuffled.slice(0, questionsPerBatch))
      const newUsedIds = new Set(shuffled.slice(0, questionsPerBatch).map((q) => q.id))
      setUsedIds(newUsedIds)
    } else {
      const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, Math.min(questionsPerBatch, shuffled.length))
      setCurrentQuestions(selected)
      setUsedIds((prev) => {
        const newSet = new Set(prev)
        selected.forEach((q) => newSet.add(q.id))
        return newSet
      })
    }
    
    setAnswers({})
    setResults({})
    setShowResults(false)
  }, [questionBank, usedIds, questionsPerBatch])

  useEffect(() => {
    if (isInitialized && questionBank.length > 0 && currentQuestions.length === 0) {
      loadNextBatch()
    }
  }, [isInitialized, questionBank, currentQuestions.length, loadNextBatch])

  const handleAnswer = (questionId: string, answer: string) => {
    if (showResults) return
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmit = () => {
    const newResults: ResultState = {}
    let correctCount = 0

    currentQuestions.forEach((q) => {
      const isCorrect = answers[q.id] === q.correctAnswer
      newResults[q.id] = isCorrect
      if (isCorrect) correctCount++
    })

    setResults(newResults)
    setShowResults(true)
    setTotalScore((prev) => prev + correctCount)
    setTotalAnswered((prev) => prev + currentQuestions.length)
  }

  const handleReset = () => {
    setUsedIds(new Set())
    setCurrentQuestions([])
    setAnswers({})
    setResults({})
    setShowResults(false)
    setTotalScore(0)
    setTotalAnswered(0)
    
    const newBank = generateQuestionBank(lesson1Config.totalQuestions)
    setQuestionBank(newBank)
  }

  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === currentQuestions.length
  const currentCorrect = Object.values(results).filter(Boolean).length

  const remainingQuestions = questionBank.length - usedIds.size

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎯</div>
          <p className="text-amber-800 font-medium">Жүктелуде...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-500 pt-28 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/courses/1"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            <span className="text-sm">1 сынып</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
              🔢
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {lesson1Config.title}
              </h1>
              <p className="text-white/80 mt-1">{lesson1Config.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Score Bar */}
      <section className="bg-white border-b border-amber-200 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" fill="currentColor" strokeWidth={1.75} />
                <span className="font-bold text-amber-800">{totalScore} ұпай</span>
              </div>
              <div className="text-sm text-amber-600">
                {totalAnswered} сұраққа жауап берілді
              </div>
            </div>
            <div className="text-sm text-amber-600">
              Қалды: {remainingQuestions} сұрақ
            </div>
          </div>
        </div>
      </section>

      {/* Questions */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {currentQuestions.map((question, index) => {
            const isCorrect = results[question.id]
            const showExplanation = showResults && !isCorrect

            return (
              <div
                key={question.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all ${
                  showResults
                    ? isCorrect
                      ? 'ring-4 ring-emerald-200'
                      : 'ring-4 ring-red-200'
                    : ''
                }`}
              >
                {/* Question Header */}
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-amber-800">
                      {index + 1}-сұрақ
                    </span>
                    {showResults && (
                      isCorrect ? (
                        <div className="flex items-center gap-2 text-emerald-600">
                          <CheckCircle className="w-6 h-6" strokeWidth={2} />
                          <span className="font-bold">Дұрыс!</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600">
                          <XCircle className="w-6 h-6" strokeWidth={2} />
                          <span className="font-bold">Қате</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Question Content */}
                <div className="p-6">
                  <p className="text-2xl sm:text-3xl text-center mb-8 leading-relaxed">
                    {question.question}
                  </p>

                  {/* Options */}
                  <div className="grid grid-cols-2 gap-4">
                    {question.options?.map((option, optIndex) => {
                      const letter = ['A', 'B', 'C', 'D'][optIndex]
                      const isSelected = answers[question.id] === option
                      const isCorrectOption = option === question.correctAnswer
                      
                      let buttonClass = 'bg-amber-50 border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-100'
                      
                      if (showResults) {
                        if (isCorrectOption) {
                          buttonClass = 'bg-emerald-100 border-2 border-emerald-400'
                        } else if (isSelected && !isCorrectOption) {
                          buttonClass = 'bg-red-100 border-2 border-red-400'
                        } else {
                          buttonClass = 'bg-gray-50 border-2 border-gray-200 opacity-50'
                        }
                      } else if (isSelected) {
                        buttonClass = 'bg-amber-200 border-2 border-amber-500'
                      }

                      return (
                        <button
                          key={optIndex}
                          onClick={() => handleAnswer(question.id, option)}
                          disabled={showResults}
                          className={`p-4 sm:p-6 rounded-xl text-xl sm:text-2xl font-bold transition-all ${buttonClass} ${
                            showResults ? 'cursor-default' : 'cursor-pointer'
                          }`}
                        >
                          <span className="text-amber-600 mr-2">{letter}.</span>
                          <span className={showResults && isCorrectOption ? 'text-emerald-700' : 'text-gray-800'}>
                            {option}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Explanation */}
                  {showExplanation && question.explanation && (
                    <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <p className="text-amber-800">
                        <span className="font-bold">💡 Түсіндірме: </span>
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Action Buttons */}
      <section className="py-8 bg-white border-t border-amber-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {!showResults ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-amber-600">
                {answeredCount} / {currentQuestions.length} сұраққа жауап берілді
              </p>
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white text-lg font-bold rounded-xl shadow-lg transition-all"
              >
                Тексеру ✓
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Batch Result */}
              <div className="flex items-center justify-center gap-4 p-6 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Trophy className={`w-8 h-8 ${currentCorrect === questionsPerBatch ? 'text-amber-500' : 'text-amber-400'}`} strokeWidth={1.75} />
                    <span className="text-3xl font-bold text-amber-800">
                      {currentCorrect} / {currentQuestions.length}
                    </span>
                  </div>
                  <p className="text-amber-600">
                    {currentCorrect === questionsPerBatch ? 'Керемет! Барлығы дұрыс! 🎉' : 
                     currentCorrect >= questionsPerBatch * 0.6 ? 'Жақсы нәтиже! 👍' : 
                     'Жаттығуды жалғастырыңыз! 💪'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={loadNextBatch}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-lg font-bold rounded-xl shadow-lg transition-all"
                >
                  Келесі 5 тапсырма
                  <ChevronRight className="w-5 h-5" strokeWidth={2} />
                </button>
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-amber-300 hover:border-amber-400 hover:bg-amber-50 text-amber-700 font-bold rounded-xl transition-all"
                >
                  <RotateCcw className="w-5 h-5" strokeWidth={2} />
                  Басынан бастау
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
