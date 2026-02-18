'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  MicroTestType,
  MicroTestQuestion,
  MicroTestAnswer,
  MicroTestResult,
  MICRO_TEST_CONFIGS,
  getSkillColor,
  getSkillBgColor,
} from '@/lib/microTests/types'
import { getQuestionsForTest } from '@/lib/microTests/questionBanks'
import { calculateMicroTestResult, formatTime } from '@/lib/microTests/scoring'

type Phase = 'menu' | 'test' | 'results'

export default function MicroTestsPage() {
  const [phase, setPhase] = useState<Phase>('menu')
  const [selectedTest, setSelectedTest] = useState<MicroTestType | null>(null)
  const [questions, setQuestions] = useState<MicroTestQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<MicroTestAnswer[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [questionTimeLeft, setQuestionTimeLeft] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(0)
  const [result, setResult] = useState<MicroTestResult | null>(null)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const currentQuestion = questions[currentIndex]
  const config = selectedTest ? MICRO_TEST_CONFIGS.find(c => c.type === selectedTest) : null

  // Question timer
  useEffect(() => {
    if (phase === 'test' && currentQuestion && !isAnswered) {
      setQuestionTimeLeft(currentQuestion.timeLimit)
      setQuestionStartTime(Date.now())
      
      timerRef.current = setInterval(() => {
        setQuestionTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up for this question - auto submit as wrong
            clearInterval(timerRef.current!)
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      return () => {
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }
  }, [phase, currentIndex, isAnswered])

  const handleTimeUp = useCallback(() => {
    if (!currentQuestion || isAnswered) return
    
    const timeSpent = currentQuestion.timeLimit
    const answer: MicroTestAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: -1,
      isCorrect: false,
      timeSpent,
    }
    
    setAnswers(prev => [...prev, answer])
    setIsAnswered(true)
    
    // Auto advance after 1.5 seconds
    setTimeout(() => {
      nextQuestion()
    }, 1500)
  }, [currentQuestion, isAnswered])

  const startTest = (testType: MicroTestType) => {
    const testConfig = MICRO_TEST_CONFIGS.find(c => c.type === testType)!
    const testQuestions = getQuestionsForTest(testType).slice(0, testConfig.questionCount)
    
    setSelectedTest(testType)
    setQuestions(testQuestions)
    setCurrentIndex(0)
    setAnswers([])
    setSelectedAnswer(null)
    setIsAnswered(false)
    setResult(null)
    setPhase('test')
  }

  const submitAnswer = () => {
    if (selectedAnswer === null || isAnswered || !currentQuestion) return
    
    if (timerRef.current) clearInterval(timerRef.current)
    
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000)
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    
    const answer: MicroTestAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timeSpent,
    }
    
    setAnswers(prev => [...prev, answer])
    setIsAnswered(true)
  }

  const nextQuestion = () => {
    if (currentIndex >= questions.length - 1) {
      finishTest()
      return
    }
    
    setCurrentIndex(prev => prev + 1)
    setSelectedAnswer(null)
    setIsAnswered(false)
  }

  const finishTest = () => {
    if (!selectedTest) return
    
    const testResult = calculateMicroTestResult(selectedTest, answers)
    setResult(testResult)
    setPhase('results')
  }

  const backToMenu = () => {
    setPhase('menu')
    setSelectedTest(null)
    setQuestions([])
    setAnswers([])
    setResult(null)
  }

  // Menu phase
  if (phase === 'menu') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link href="/" className="text-gray-600 hover:text-gray-800 text-sm mb-4 inline-block">
              ← Басты бетке
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Интеллектуалды микросынақтар
            </h1>
            <p className="text-gray-600">
              Сабақ барысында қолдануға арналған қысқа когнитивтік диагностика модульдері
            </p>
          </div>

          {/* Info banner */}
          <div className="mb-8 p-4 bg-slate-100 border border-slate-200 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔬</span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Жедел диагностика</h3>
                <p className="text-sm text-gray-600">
                  Әр модуль 5-10 минутта аяқталады. Нәтижелер автоматты түрде бағаланады және 3 деңгейлі рейтинг беріледі.
                </p>
              </div>
            </div>
          </div>

          {/* Module cards */}
          <div className="space-y-4">
            {MICRO_TEST_CONFIGS.map((config) => (
              <div
                key={config.type}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center text-3xl">
                      {config.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {config.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {config.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {config.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{config.questionCount} сұрақ</span>
                        <span>{config.totalTimeMinutes} минут</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => startTest(config.type)}
                    className="px-5 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
                  >
                    Бастау
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer info */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Бағалау жүйесі: Жоғары (80%+) / Орташа (50-79%) / Төмен (&lt;50%)</p>
          </div>
        </div>
      </div>
    )
  }

  // Results phase
  if (phase === 'results' && result) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-4xl mb-4">
                {config?.icon}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {result.testName}
              </h1>
              <p className="text-gray-600">Микро-есеп</p>
            </div>

            {/* Score */}
            <div className="mb-8 text-center">
              <div className={`inline-block px-6 py-3 rounded-xl ${getSkillBgColor(result.skillLevel)}`}>
                <div className={`text-4xl font-bold ${getSkillColor(result.skillLevel)}`}>
                  {result.skillLabel}
                </div>
                <div className="text-gray-600 mt-1">
                  {result.correctAnswers}/{result.totalQuestions} дұрыс ({result.accuracy}%)
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{result.correctAnswers}</div>
                <div className="text-sm text-gray-600">Дұрыс</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{result.totalQuestions - result.correctAnswers}</div>
                <div className="text-sm text-gray-600">Қате</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{result.avgTimePerQuestion}с</div>
                <div className="text-sm text-gray-600">Орташа уақыт</div>
              </div>
            </div>

            {/* Feedback */}
            <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <p className="text-gray-700">{result.feedback}</p>
            </div>

            {/* Strengths */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Күшті жақтары</h3>
              <div className="space-y-2">
                {result.strengths.map((strength, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-green-700">
                    <span>✓</span>
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvements */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-3">Жақсарту бағыттары</h3>
              <div className="space-y-2">
                {result.improvements.map((improvement, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-700">
                    <span>→</span>
                    <span>{improvement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={backToMenu}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Басқа модуль
              </button>
              <button
                onClick={() => startTest(selectedTest!)}
                className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
              >
                Қайта тапсыру
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Test phase
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{config?.icon}</span>
              <div>
                <h1 className="font-semibold text-gray-800">{config?.name}</h1>
                <p className="text-sm text-gray-500">
                  Сұрақ {currentIndex + 1}/{questions.length}
                </p>
              </div>
            </div>
            
            <div className={`px-4 py-2 rounded-lg font-mono font-bold text-xl ${
              questionTimeLeft <= 5 ? 'bg-red-100 text-red-600' :
              questionTimeLeft <= 10 ? 'bg-yellow-100 text-yellow-600' :
              'bg-gray-100 text-gray-800'
            }`}>
              {questionTimeLeft}с
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-slate-600 transition-all duration-300"
              style={{ width: `${((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Question */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {currentQuestion && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Question prompt */}
            <div className="mb-6">
              <p className="text-lg text-gray-800 leading-relaxed">{currentQuestion.prompt}</p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx
                const isCorrect = currentQuestion.correctAnswer === idx
                const showResult = isAnswered
                
                let optionClass = 'border-gray-200 bg-white hover:border-slate-400'
                if (isSelected && !showResult) {
                  optionClass = 'border-slate-600 bg-slate-50'
                }
                if (showResult) {
                  if (isCorrect) {
                    optionClass = 'border-green-500 bg-green-50'
                  } else if (isSelected && !isCorrect) {
                    optionClass = 'border-red-500 bg-red-50'
                  } else {
                    optionClass = 'border-gray-200 bg-gray-50 opacity-60'
                  }
                }
                
                return (
                  <button
                    key={idx}
                    onClick={() => !isAnswered && setSelectedAnswer(idx)}
                    disabled={isAnswered}
                    className={`w-full flex items-center gap-4 p-4 border-2 rounded-lg transition-all text-left ${optionClass} ${
                      isAnswered ? 'cursor-default' : 'cursor-pointer'
                    }`}
                  >
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full border-2 font-medium ${
                      isSelected && !showResult ? 'border-slate-600 bg-slate-600 text-white' :
                      showResult && isCorrect ? 'border-green-500 bg-green-500 text-white' :
                      showResult && isSelected && !isCorrect ? 'border-red-500 bg-red-500 text-white' :
                      'border-gray-300 text-gray-600'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 text-gray-800">{option}</span>
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            {isAnswered && (
              <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-gray-700">{currentQuestion.explanation}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end">
              {!isAnswered ? (
                <button
                  onClick={submitAnswer}
                  disabled={selectedAnswer === null}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    selectedAnswer !== null
                      ? 'bg-slate-800 text-white hover:bg-slate-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Жауап беру
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
                >
                  {currentIndex >= questions.length - 1 ? 'Аяқтау' : 'Келесі'}
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
