'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import {
  createInitialState,
  updatePerformance,
  getNextDifficulty,
  applyDifficultyChange,
  getAccuracy,
  getSessionSummary,
  type PerformanceState,
  type Difficulty,
} from '@/lib/adaptiveEngine'
import {
  getQuestionByDifficulty,
  validateAnswerByIndex,
  getAvailableTopics,
  getTopicLabel,
  type Topic,
  type Question,
} from '@/lib/questionBank'
import {
  calculateStressIndex,
  getQuickStressGrade,
  STRESS_LABELS,
  STRESS_COLORS,
  STRESS_TEXT_COLORS,
  type StressGrade,
  type StressResult,
} from '@/lib/stressIndex'

type SessionPhase = 'setup' | 'training' | 'results'

export default function TrainingPage() {
  // Get available topics dynamically from questionBank
  const availableTopics = useMemo(() => getAvailableTopics(), [])
  
  // Session state
  const [phase, setPhase] = useState<SessionPhase>('setup')
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>(() => {
    const topics = getAvailableTopics()
    return topics.length > 0 ? [topics[0]] : []
  })
  
  // Performance state (from adaptiveEngine)
  const [perfState, setPerfState] = useState<PerformanceState>(() => createInitialState(5))
  
  // Current question state
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  
  // UI state
  const [quickStress, setQuickStress] = useState<StressGrade>('C')
  const [finalStress, setFinalStress] = useState<StressResult | null>(null)

  // Generate next question based on current difficulty
  const generateNextQuestion = useCallback(() => {
    const question = getQuestionByDifficulty(perfState.currentDifficulty, selectedTopics)
    setCurrentQuestion(question)
    setSelectedOption(null)
    setFeedback(null)
    setTimeLeft(question.baseTime)
    startTimeRef.current = Date.now()
  }, [perfState.currentDifficulty, selectedTopics])

  // Process answer submission
  const processAnswer = useCallback((optionIndex: number | null, timedOut: boolean = false) => {
    if (!currentQuestion || feedback) return

    const timeSpent = (Date.now() - startTimeRef.current) / 1000 // in seconds
    const isCorrect = !timedOut && optionIndex !== null && validateAnswerByIndex(currentQuestion, optionIndex)

    // Show feedback
    setFeedback(isCorrect ? 'correct' : 'incorrect')

    // Update performance state
    setPerfState(prev => {
      // Step 1: Update performance metrics
      let newState = updatePerformance(prev, isCorrect, timeSpent, currentQuestion.baseTime)
      
      // Step 2: Get next difficulty based on updated performance
      const nextDifficulty = getNextDifficulty(newState)
      
      // Step 3: Apply difficulty change
      newState = applyDifficultyChange(newState, nextDifficulty)
      
      // Update quick stress indicator
      const accuracy = getAccuracy(newState)
      const grade = getQuickStressGrade(accuracy, newState.streak, newState.wrongStreak)
      setQuickStress(grade)
      
      return newState
    })

    // Move to next question after delay
    setTimeout(() => {
      generateNextQuestion()
    }, 1500)
  }, [currentQuestion, feedback, generateNextQuestion])

  // Timer effect
  useEffect(() => {
    if (phase !== 'training' || !currentQuestion || feedback) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          processAnswer(null, true) // timeout
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [phase, currentQuestion, feedback, processAnswer])

  // Start training session
  const startTraining = () => {
    if (selectedTopics.length === 0) return
    
    setPerfState(createInitialState(5))
    setQuickStress('C')
    setFinalStress(null)
    setPhase('training')
    
    // Generate first question after state is set
    setTimeout(() => {
      const question = getQuestionByDifficulty(5, selectedTopics)
      setCurrentQuestion(question)
      setSelectedOption(null)
      setFeedback(null)
      setTimeLeft(question.baseTime)
      startTimeRef.current = Date.now()
    }, 100)
  }

  // End training and show results
  const endTraining = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    
    const stressResult = calculateStressIndex(perfState)
    setFinalStress(stressResult)
    setPhase('results')
  }

  // Handle option selection
  const handleOptionSelect = (index: number) => {
    if (feedback) return
    setSelectedOption(index)
    processAnswer(index, false)
  }

  // Toggle topic selection
  const toggleTopic = (topic: Topic) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    )
  }

  // Calculate display values
  const accuracy = perfState.totalAnswered > 0
    ? Math.round(getAccuracy(perfState) * 100)
    : 0
  const timerPercent = currentQuestion
    ? (timeLeft / currentQuestion.baseTime) * 100
    : 100
  const timerColor = timerPercent > 50 ? 'bg-green-500' : timerPercent > 25 ? 'bg-yellow-500' : 'bg-red-500'

  // ============ RENDER ============
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">MathForce AI</h1>
          <p className="text-slate-600">Адаптивті математикалық жаттығу жүйесі</p>
        </div>

        {/* ============ SETUP PHASE ============ */}
        {phase === 'setup' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Тақырыпты таңдаңыз</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {availableTopics.map(topic => (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    selectedTopics.includes(topic)
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {getTopicLabel(topic)}
                </button>
              ))}
            </div>

            <button
              onClick={startTraining}
              disabled={selectedTopics.length === 0}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Бастау
            </button>
          </div>
        )}

        {/* ============ TRAINING PHASE ============ */}
        {phase === 'training' && (
          <div className="space-y-4">
            
            {/* Stats Bar */}
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Деңгей</p>
                    <p className="text-2xl font-bold text-indigo-600">{perfState.currentDifficulty}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Дұрыс</p>
                    <p className="text-2xl font-bold text-green-600">{perfState.correctCount}/{perfState.totalAnswered}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Серия</p>
                    <p className="text-2xl font-bold text-purple-600">{perfState.streak}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500">Стресс</p>
                  <span className={`inline-block px-3 py-1 rounded-lg text-white font-bold ${STRESS_COLORS[quickStress]}`}>
                    {quickStress}
                  </span>
                </div>
              </div>
            </div>

            {/* Timer Bar */}
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">Уақыт</span>
                <span className="text-lg font-mono font-bold text-slate-900">{timeLeft}s</span>
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${timerColor}`}
                  style={{ width: `${timerPercent}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            {currentQuestion && (
              <div className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-colors ${
                feedback === 'correct' ? 'border-green-500 bg-green-50' :
                feedback === 'incorrect' ? 'border-red-500 bg-red-50' :
                'border-transparent'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">
                    {getTopicLabel(currentQuestion.topic)}
                  </span>
                  <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-600 rounded font-medium">
                    Деңгей {currentQuestion.difficulty}
                  </span>
                </div>

                <p className="text-xl font-bold text-slate-900 text-center mb-6 min-h-[3rem]">
                  {currentQuestion.statement}
                </p>

                {/* Multiple Choice Options */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedOption === index
                    const isCorrectOption = index === currentQuestion.correctIndex
                    
                    let buttonClass = 'p-4 rounded-xl border-2 text-lg font-medium transition-all text-center '
                    
                    if (feedback) {
                      if (isCorrectOption) {
                        buttonClass += 'border-green-500 bg-green-100 text-green-800'
                      } else if (isSelected && !isCorrectOption) {
                        buttonClass += 'border-red-500 bg-red-100 text-red-800'
                      } else {
                        buttonClass += 'border-slate-200 bg-slate-50 text-slate-400'
                      }
                    } else {
                      buttonClass += 'border-slate-200 bg-white text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer'
                    }
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(index)}
                        disabled={!!feedback}
                        className={buttonClass}
                      >
                        <span className="font-bold mr-2">{['A', 'B', 'C', 'D'][index]}.</span>
                        {option}
                      </button>
                    )
                  })}
                </div>

                {/* Feedback with explanation */}
                {feedback && (
                  <div className={`mt-4 p-4 rounded-xl ${
                    feedback === 'correct' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <p className={`text-center font-semibold text-lg mb-2 ${
                      feedback === 'correct' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {feedback === 'correct' ? 'Дұрыс!' : 'Қате!'}
                    </p>
                    <p className="text-sm text-slate-700 text-center">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* End Button */}
            <button
              onClick={endTraining}
              className="w-full py-3 bg-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-300 transition-colors"
            >
              Аяқтау
            </button>
          </div>
        )}

        {/* ============ RESULTS PHASE ============ */}
        {phase === 'results' && finalStress && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-6">Сессия нәтижесі</h2>

            {/* Stress Grade */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-white text-4xl font-bold ${STRESS_COLORS[finalStress.grade]}`}>
                {finalStress.grade}
              </div>
              <p className={`mt-3 text-xl font-semibold ${STRESS_TEXT_COLORS[finalStress.grade]}`}>
                {STRESS_LABELS[finalStress.grade]}
              </p>
              <p className="mt-2 text-slate-600">{finalStress.message}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-indigo-600">{perfState.totalAnswered}</p>
                <p className="text-sm text-slate-500">Жалпы сұрақ</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-green-600">{accuracy}%</p>
                <p className="text-sm text-slate-500">Дұрыстық</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-purple-600">{perfState.maxStreak}</p>
                <p className="text-sm text-slate-500">Макс серия</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-amber-600">{perfState.currentDifficulty}</p>
                <p className="text-sm text-slate-500">Соңғы деңгей</p>
              </div>
            </div>

            {/* Stress Factors */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-slate-900 mb-3">Талдау</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Қиын есептер дәлдігі</span>
                  <span className="font-medium">{Math.round(finalStress.factors.highDifficultyAccuracy * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Уақыт тұрақтылығы</span>
                  <span className="font-medium">{Math.round(finalStress.factors.timeVariance * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Қатеден қалпына келу</span>
                  <span className="font-medium">{Math.round(finalStress.factors.recoveryScore * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setPhase('setup')}
                className="flex-1 py-3 bg-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-300 transition-colors"
              >
                Басты бет
              </button>
              <button
                onClick={startTraining}
                className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
              >
                Қайта бастау
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
