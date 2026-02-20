'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { VisualCounter } from '@/components/VisualCounter'
import { 
  generateAdaptiveQuestion, 
  lesson1Config,
  levelNames,
  levelColors,
  DifficultyLevel,
  AdaptiveQuestion,
} from '@/lib/courses/generators/grade1Lesson1'
import { 
  saveWrongAnswer, 
  getWrongAnswerCount,
  saveProgressStats,
  getProgressStats,
  clearProgressStats,
  clearWrongAnswers,
} from '@/lib/progress'
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Trophy, 
  ChevronRight, 
  Star,
  AlertCircle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'

interface AnswerState {
  [questionId: string]: string
}

interface ResultState {
  [questionId: string]: boolean
}

export default function Counting10Page() {
  const [currentQuestions, setCurrentQuestions] = useState<AdaptiveQuestion[]>([])
  const [answers, setAnswers] = useState<AnswerState>({})
  const [results, setResults] = useState<ResultState>({})
  const [showResults, setShowResults] = useState(false)
  
  const [level, setLevel] = useState<DifficultyLevel>(1)
  const [correctStreak, setCorrectStreak] = useState(0)
  const [wrongStreak, setWrongStreak] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [highestLevel, setHighestLevel] = useState<DifficultyLevel>(1)
  
  const [usedQuestionKeys, setUsedQuestionKeys] = useState<Set<string>>(new Set())
  const [wrongCount, setWrongCount] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)
  const [levelChanged, setLevelChanged] = useState<'up' | 'down' | null>(null)

  const questionsPerBatch = lesson1Config.questionsPerBatch
  const lessonId = lesson1Config.id

  useEffect(() => {
    const savedStats = getProgressStats(lessonId)
    if (savedStats) {
      setTotalAnswered(savedStats.totalAnswered)
      setTotalCorrect(savedStats.correctAnswers)
      setLevel(savedStats.currentLevel as DifficultyLevel)
      setHighestLevel(savedStats.highestLevel as DifficultyLevel)
      setCorrectStreak(savedStats.streak)
    }
    setWrongCount(getWrongAnswerCount(lessonId))
    setIsInitialized(true)
  }, [lessonId])

  const generateNewBatch = useCallback(() => {
    const questions: AdaptiveQuestion[] = []
    let attempts = 0
    const maxAttempts = questionsPerBatch * 20

    while (questions.length < questionsPerBatch && attempts < maxAttempts) {
      const question = generateAdaptiveQuestion(
        totalAnswered + questions.length,
        level
      )
      const key = `${question.objectType}-${question.count}`
      
      if (!usedQuestionKeys.has(key)) {
        questions.push(question)
        setUsedQuestionKeys((prev) => new Set(prev).add(key))
      }
      attempts++
    }

    while (questions.length < questionsPerBatch) {
      questions.push(generateAdaptiveQuestion(totalAnswered + questions.length, level))
    }

    return questions
  }, [level, questionsPerBatch, totalAnswered, usedQuestionKeys])

  const loadNextBatch = useCallback(() => {
    const newQuestions = generateNewBatch()
    setCurrentQuestions(newQuestions)
    setAnswers({})
    setResults({})
    setShowResults(false)
    setLevelChanged(null)
  }, [generateNewBatch])

  useEffect(() => {
    if (isInitialized && currentQuestions.length === 0) {
      loadNextBatch()
    }
  }, [isInitialized, currentQuestions.length, loadNextBatch])

  const handleAnswer = (questionId: string, answer: string) => {
    if (showResults) return
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmit = () => {
    const newResults: ResultState = {}
    let batchCorrect = 0
    let batchWrong = 0

    currentQuestions.forEach((q) => {
      const isCorrect = answers[q.id] === q.correctAnswer
      newResults[q.id] = isCorrect
      
      if (isCorrect) {
        batchCorrect++
      } else {
        batchWrong++
        saveWrongAnswer(lessonId, q, answers[q.id] || '')
      }
    })

    setResults(newResults)
    setShowResults(true)
    setWrongCount(getWrongAnswerCount(lessonId))

    const newTotalAnswered = totalAnswered + currentQuestions.length
    const newTotalCorrect = totalCorrect + batchCorrect
    setTotalAnswered(newTotalAnswered)
    setTotalCorrect(newTotalCorrect)

    let newCorrectStreak = batchCorrect === questionsPerBatch ? correctStreak + questionsPerBatch : 0
    let newWrongStreak = batchWrong >= 2 ? wrongStreak + batchWrong : 0
    
    if (batchCorrect < questionsPerBatch) {
      newCorrectStreak = batchCorrect
    }
    if (batchWrong < 2) {
      newWrongStreak = 0
    }

    setCorrectStreak(newCorrectStreak)
    setWrongStreak(newWrongStreak)

    let newLevel = level
    if (newCorrectStreak >= 3 && level < 5) {
      newLevel = (level + 1) as DifficultyLevel
      setLevelChanged('up')
      newCorrectStreak = 0
    } else if (newWrongStreak >= 2 && level > 1) {
      newLevel = (level - 1) as DifficultyLevel
      setLevelChanged('down')
      newWrongStreak = 0
    }

    setLevel(newLevel)
    setCorrectStreak(newCorrectStreak)
    setWrongStreak(newWrongStreak)

    const newHighest = Math.max(highestLevel, newLevel) as DifficultyLevel
    setHighestLevel(newHighest)

    saveProgressStats(lessonId, {
      totalAnswered: newTotalAnswered,
      correctAnswers: newTotalCorrect,
      wrongAnswers: newTotalAnswered - newTotalCorrect,
      currentLevel: newLevel,
      highestLevel: newHighest,
      streak: newCorrectStreak,
    })
  }

  const handleReset = () => {
    clearProgressStats(lessonId)
    clearWrongAnswers(lessonId)
    setUsedQuestionKeys(new Set())
    setCurrentQuestions([])
    setAnswers({})
    setResults({})
    setShowResults(false)
    setLevel(1)
    setCorrectStreak(0)
    setWrongStreak(0)
    setTotalAnswered(0)
    setTotalCorrect(0)
    setHighestLevel(1)
    setWrongCount(0)
    setLevelChanged(null)
  }

  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === currentQuestions.length
  const currentCorrect = Object.values(results).filter(Boolean).length
  const progressPercent = Math.min((totalAnswered / lesson1Config.totalQuestions) * 100, 100)

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
          
          <div className="flex items-center justify-between flex-wrap gap-4">
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
            
            <div className={`px-4 py-2 rounded-xl font-bold ${levelColors[level]}`}>
              Деңгей {level}: {levelNames[level]}
            </div>
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="bg-white border-b border-amber-200 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" fill="currentColor" strokeWidth={1.75} />
                <span className="font-bold text-amber-800">{totalCorrect} ұпай</span>
              </div>
              <div className="text-sm text-amber-600">
                {totalAnswered} / {lesson1Config.totalQuestions} сұрақ
              </div>
            </div>
            <div className="flex items-center gap-4">
              {wrongCount > 0 && (
                <Link
                  href="/courses/1/counting-10/review"
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  <AlertCircle className="w-4 h-4" strokeWidth={2} />
                  Қате тапсырмалар ({wrongCount})
                </Link>
              )}
              <div className="text-sm text-amber-600">
                Streak: {correctStreak} 🔥
              </div>
            </div>
          </div>
          
          <div className="w-full h-3 bg-amber-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* Level Change Notification */}
      {levelChanged && (
        <section className="py-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex items-center justify-center gap-3 p-4 rounded-xl ${
              levelChanged === 'up' 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-orange-100 text-orange-800'
            }`}>
              {levelChanged === 'up' ? (
                <>
                  <TrendingUp className="w-6 h-6" strokeWidth={2} />
                  <span className="font-bold">Керемет! Деңгей көтерілді: {level}</span>
                  <span className="text-2xl">🎉</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-6 h-6" strokeWidth={2} />
                  <span className="font-bold">Деңгей төмендеді: {level}. Қайта жаттығу!</span>
                  <span className="text-2xl">💪</span>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Questions */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {currentQuestions.map((question, index) => {
            const isAnswered = answers[question.id] !== undefined
            const isCorrect = results[question.id]
            const showExplanation = showResults && !isCorrect

            return (
              <div
                key={question.id}
                className={`bg-white rounded-3xl shadow-xl overflow-hidden transition-all ${
                  showResults
                    ? isCorrect
                      ? 'ring-4 ring-emerald-300'
                      : 'ring-4 ring-red-300'
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
                          <span className="font-bold">Дұрыс! ⭐</span>
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
                      count={question.count} 
                      objectType={question.objectType}
                      size="lg"
                      animated={!showResults}
                    />
                  </div>

                  <p className="text-xl sm:text-2xl text-center font-medium text-gray-800 mb-6">
                    {question.question}
                  </p>

                  {/* Options */}
                  <div className="grid grid-cols-2 gap-4">
                    {question.options?.map((option, optIndex) => {
                      const letter = ['A', 'B', 'C', 'D'][optIndex]
                      const isSelected = answers[question.id] === option
                      const isCorrectOption = option === question.correctAnswer
                      
                      let buttonClass = 'bg-amber-50 border-3 border-amber-200 hover:border-amber-400 hover:bg-amber-100 hover:scale-105'
                      
                      if (showResults) {
                        if (isCorrectOption) {
                          buttonClass = 'bg-emerald-100 border-3 border-emerald-400 scale-105'
                        } else if (isSelected && !isCorrectOption) {
                          buttonClass = 'bg-red-100 border-3 border-red-400'
                        } else {
                          buttonClass = 'bg-gray-50 border-3 border-gray-200 opacity-50'
                        }
                      } else if (isSelected) {
                        buttonClass = 'bg-amber-200 border-3 border-amber-500 scale-105'
                      }

                      return (
                        <button
                          key={optIndex}
                          onClick={() => handleAnswer(question.id, option)}
                          disabled={showResults}
                          className={`p-5 sm:p-6 rounded-2xl text-2xl sm:text-3xl font-bold transition-all duration-200 ${buttonClass} ${
                            showResults ? 'cursor-default' : 'cursor-pointer active:scale-95'
                          }`}
                        >
                          <span className="text-amber-500 mr-2 text-lg">{letter}.</span>
                          <span className={showResults && isCorrectOption ? 'text-emerald-700' : 'text-gray-800'}>
                            {option}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Explanation */}
                  {showExplanation && question.explanation && (
                    <div className="mt-6 p-5 bg-amber-50 rounded-2xl border-2 border-amber-200">
                      <p className="text-amber-800 text-lg">
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
              <p className="text-amber-600 text-lg">
                {answeredCount} / {currentQuestions.length} сұраққа жауап берілді
              </p>
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white text-xl font-bold rounded-2xl shadow-lg transition-all"
              >
                Тексеру ✓
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Batch Result */}
              <div className="flex items-center justify-center gap-4 p-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <Trophy className={`w-10 h-10 ${currentCorrect === questionsPerBatch ? 'text-amber-500' : 'text-amber-400'}`} strokeWidth={1.75} />
                    <span className="text-4xl font-bold text-amber-800">
                      {currentCorrect} / {currentQuestions.length}
                    </span>
                  </div>
                  <p className="text-amber-700 text-lg">
                    {currentCorrect === questionsPerBatch ? 'Керемет! Барлығы дұрыс! 🎉🌟' : 
                     currentCorrect >= questionsPerBatch * 0.6 ? 'Жақсы нәтиже! 👍✨' : 
                     'Жаттығуды жалғастырыңыз! 💪🔥'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={loadNextBatch}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xl font-bold rounded-2xl shadow-lg transition-all"
                >
                  Келесі 5 тапсырма
                  <ChevronRight className="w-6 h-6" strokeWidth={2} />
                </button>
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-5 bg-white border-3 border-amber-300 hover:border-amber-400 hover:bg-amber-50 text-amber-700 text-lg font-bold rounded-2xl transition-all"
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
