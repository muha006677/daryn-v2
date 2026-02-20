'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { VisualCounter } from '@/components/VisualCounter'
import { lesson1Config, AdaptiveQuestion } from '@/lib/courses/generators/grade1Lesson1'
import { 
  getWrongAnswers, 
  removeWrongAnswer, 
  clearWrongAnswers,
  WrongAnswerRecord,
} from '@/lib/progress'
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Trophy,
  Trash2,
  AlertCircle,
} from 'lucide-react'

export default function ReviewPage() {
  const [wrongRecords, setWrongRecords] = useState<WrongAnswerRecord[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [reviewedCount, setReviewedCount] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)

  const lessonId = lesson1Config.id

  useEffect(() => {
    const records = getWrongAnswers(lessonId)
    setWrongRecords(records)
    setIsInitialized(true)
  }, [lessonId])

  const currentRecord = wrongRecords[currentIndex]
  const currentQuestion = currentRecord?.question as AdaptiveQuestion | undefined

  const handleAnswer = (answer: string) => {
    if (showResult) return
    setSelectedAnswer(answer)
  }

  const handleSubmit = () => {
    if (!selectedAnswer || !currentQuestion) return
    
    const correct = selectedAnswer === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setShowResult(true)
    setReviewedCount((prev) => prev + 1)
    
    if (correct) {
      setCorrectCount((prev) => prev + 1)
      removeWrongAnswer(lessonId, currentQuestion.id)
      setWrongRecords((prev) => prev.filter((r) => r.question.id !== currentQuestion.id))
    }
  }

  const handleNext = () => {
    if (isCorrect) {
      if (currentIndex >= wrongRecords.length) {
        setCurrentIndex(Math.max(0, wrongRecords.length - 1))
      }
    } else {
      setCurrentIndex((prev) => (prev + 1) % wrongRecords.length)
    }
    setSelectedAnswer(null)
    setShowResult(false)
    setIsCorrect(false)
  }

  const handleClearAll = () => {
    if (confirm('Барлық қате тапсырмаларды өшіру керек пе?')) {
      clearWrongAnswers(lessonId)
      setWrongRecords([])
    }
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-amber-800 font-medium">Жүктелуде...</p>
        </div>
      </div>
    )
  }

  if (wrongRecords.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-green-50">
        <Navigation />
        
        <section className="pt-32 pb-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-12 h-12 text-emerald-600" strokeWidth={1.75} />
            </div>
            <h1 className="text-3xl font-bold text-emerald-800 mb-4">
              Қате тапсырмалар жоқ! 🎉
            </h1>
            <p className="text-emerald-600 mb-8">
              Сіз барлық тапсырмаларды дұрыс орындадыңыз немесе қателерді түзеттіңіз.
            </p>
            <Link
              href="/courses/1/counting-10"
              className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2} />
              Сабаққа оралу
            </Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-orange-50">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-r from-rose-500 to-orange-500 pt-28 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/courses/1/counting-10"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            <span className="text-sm">Сабаққа оралу</span>
          </Link>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-white" strokeWidth={1.75} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Қате тапсырмаларды қайталау
                </h1>
                <p className="text-white/80 mt-1">
                  {wrongRecords.length} тапсырма қайталауды күтуде
                </p>
              </div>
            </div>
            
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" strokeWidth={2} />
              Барлығын өшіру
            </button>
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="bg-white border-b border-rose-200 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="text-rose-600">
              Тапсырма: {currentIndex + 1} / {wrongRecords.length}
            </div>
            <div className="text-emerald-600 font-medium">
              Түзетілді: {correctCount} ✓
            </div>
          </div>
        </div>
      </section>

      {/* Question */}
      {currentQuestion && (
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`bg-white rounded-3xl shadow-xl overflow-hidden transition-all ${
              showResult
                ? isCorrect
                  ? 'ring-4 ring-emerald-300'
                  : 'ring-4 ring-red-300'
                : ''
            }`}>
              {/* Question Header */}
              <div className="bg-gradient-to-r from-rose-100 to-orange-100 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-rose-800">
                      Қайталау тапсырмасы
                    </span>
                    <p className="text-sm text-rose-600 mt-1">
                      Бұрын {currentRecord.attempts} рет қате жауап берілген
                    </p>
                  </div>
                  {showResult && (
                    isCorrect ? (
                      <div className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle className="w-6 h-6" strokeWidth={2} />
                        <span className="font-bold">Дұрыс! 🎉</span>
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

              {/* Visual Display */}
              <div className="p-6 pb-4">
                <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-6 mb-6">
                  <VisualCounter 
                    count={currentQuestion.count} 
                    objectType={currentQuestion.objectType}
                    size="lg"
                    animated={!showResult}
                  />
                </div>

                <p className="text-xl sm:text-2xl text-center font-medium text-gray-800 mb-6">
                  {currentQuestion.question}
                </p>

                {/* Options */}
                <div className="grid grid-cols-2 gap-4">
                  {currentQuestion.options?.map((option, optIndex) => {
                    const letter = ['A', 'B', 'C', 'D'][optIndex]
                    const isSelected = selectedAnswer === option
                    const isCorrectOption = option === currentQuestion.correctAnswer
                    
                    let buttonClass = 'bg-rose-50 border-3 border-rose-200 hover:border-rose-400 hover:bg-rose-100 hover:scale-105'
                    
                    if (showResult) {
                      if (isCorrectOption) {
                        buttonClass = 'bg-emerald-100 border-3 border-emerald-400 scale-105'
                      } else if (isSelected && !isCorrectOption) {
                        buttonClass = 'bg-red-100 border-3 border-red-400'
                      } else {
                        buttonClass = 'bg-gray-50 border-3 border-gray-200 opacity-50'
                      }
                    } else if (isSelected) {
                      buttonClass = 'bg-rose-200 border-3 border-rose-500 scale-105'
                    }

                    return (
                      <button
                        key={optIndex}
                        onClick={() => handleAnswer(option)}
                        disabled={showResult}
                        className={`p-5 sm:p-6 rounded-2xl text-2xl sm:text-3xl font-bold transition-all duration-200 ${buttonClass} ${
                          showResult ? 'cursor-default' : 'cursor-pointer active:scale-95'
                        }`}
                      >
                        <span className="text-rose-500 mr-2 text-lg">{letter}.</span>
                        <span className={showResult && isCorrectOption ? 'text-emerald-700' : 'text-gray-800'}>
                          {option}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Explanation */}
                {showResult && !isCorrect && currentQuestion.explanation && (
                  <div className="mt-6 p-5 bg-amber-50 rounded-2xl border-2 border-amber-200">
                    <p className="text-amber-800 text-lg">
                      <span className="font-bold">💡 Түсіндірме: </span>
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}

                {showResult && isCorrect && (
                  <div className="mt-6 p-5 bg-emerald-50 rounded-2xl border-2 border-emerald-200 text-center">
                    <p className="text-emerald-800 text-lg font-bold">
                      ✨ Тамаша! Бұл тапсырма қате тізімінен өшірілді!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Action Buttons */}
      <section className="py-8 bg-white border-t border-rose-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {!showResult ? (
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="px-10 py-5 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white text-xl font-bold rounded-2xl shadow-lg transition-all"
              >
                Тексеру ✓
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {wrongRecords.length > 0 ? (
                <button
                  onClick={handleNext}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white text-xl font-bold rounded-2xl shadow-lg transition-all"
                >
                  {isCorrect ? 'Келесі тапсырма' : 'Қайталау'}
                  <RotateCcw className="w-5 h-5" strokeWidth={2} />
                </button>
              ) : (
                <Link
                  href="/courses/1/counting-10"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white text-xl font-bold rounded-2xl shadow-lg transition-all"
                >
                  Сабаққа оралу
                  <ArrowLeft className="w-5 h-5" strokeWidth={2} />
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
