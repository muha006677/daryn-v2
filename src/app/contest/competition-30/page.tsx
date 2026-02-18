'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  UNTQuestion,
  ReadingPassage,
  AnswerRecord,
  DiagnosticReport,
  UNT_SUBJECTS,
  UNT_TOTAL_POINTS,
  UNT_TOTAL_TIME_SECONDS,
} from '@/lib/unt/types'
import {
  generateExamQuestions,
  createInitialExamState,
  formatTime,
  getQuestionIndexInExam,
  getPassageForQuestion,
  calculateProgress,
  getSubjectProgress,
  isLastQuestionInSubject,
} from '@/lib/unt/examEngine'
import {
  scoreAnswer,
  getOptionLetter,
  getSelectedLetters,
} from '@/lib/unt/scoringEngine'
import {
  updateAdaptiveState,
  updatePerformanceState,
  createInitialAdaptiveState,
  createInitialPerformanceState,
  getAdaptiveDifficultyLabel,
  calculateExpectedPace,
} from '@/lib/unt/adaptiveEngine'
import { generateDiagnosticReport } from '@/lib/unt/diagnosticReport'

type ExamPhase = 'intro' | 'exam' | 'results'

export default function UNTExamPage() {
  const [phase, setPhase] = useState<ExamPhase>('intro')
  const [questions, setQuestions] = useState<UNTQuestion[]>([])
  const [passages, setPassages] = useState<ReadingPassage[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [answers, setAnswers] = useState<AnswerRecord[]>([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)
  
  const [globalTimeRemaining, setGlobalTimeRemaining] = useState(UNT_TOTAL_TIME_SECONDS)
  const [examStartTime, setExamStartTime] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(0)
  
  const [performanceState, setPerformanceState] = useState(createInitialPerformanceState())
  const [adaptiveState, setAdaptiveState] = useState(createInitialAdaptiveState())
  
  const [diagnosticReport, setDiagnosticReport] = useState<DiagnosticReport | null>(null)
  const [wasAutoSubmitted, setWasAutoSubmitted] = useState(false)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Global timer
  useEffect(() => {
    if (phase === 'exam' && globalTimeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setGlobalTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up - auto submit
            clearInterval(timerRef.current!)
            setWasAutoSubmitted(true)
            finishExam(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      return () => {
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }
  }, [phase])

  const startExam = useCallback(() => {
    const examState = createInitialExamState(generateExamQuestions(5))
    setQuestions(examState.questions)
    setPassages(examState.passages)
    setCurrentIndex(0)
    setAnswers([])
    setGlobalTimeRemaining(UNT_TOTAL_TIME_SECONDS)
    setExamStartTime(Date.now())
    setQuestionStartTime(Date.now())
    setPerformanceState(createInitialPerformanceState())
    setAdaptiveState(createInitialAdaptiveState())
    setSelectedAnswers([])
    setShowExplanation(false)
    setIsAnswered(false)
    setPhase('exam')
  }, [])

  const finishExam = useCallback((autoSubmit: boolean = false) => {
    if (timerRef.current) clearInterval(timerRef.current)
    
    const totalTimeUsed = UNT_TOTAL_TIME_SECONDS - globalTimeRemaining
    const report = generateDiagnosticReport(
      answers,
      performanceState,
      adaptiveState,
      totalTimeUsed,
      autoSubmit
    )
    
    setDiagnosticReport(report)
    setPhase('results')
  }, [answers, performanceState, adaptiveState, globalTimeRemaining])

  const handleAnswerSelect = (index: number) => {
    if (isAnswered) return
    
    const currentQuestion = questions[currentIndex]
    if (!currentQuestion) return
    
    if (currentQuestion.type === 'single') {
      setSelectedAnswers([index])
    } else {
      // Multiple choice - toggle selection
      setSelectedAnswers(prev => {
        if (prev.includes(index)) {
          return prev.filter(i => i !== index)
        } else {
          return [...prev, index]
        }
      })
    }
  }

  const submitAnswer = () => {
    if (selectedAnswers.length === 0 || isAnswered) return
    
    const currentQuestion = questions[currentIndex]
    if (!currentQuestion) return
    
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000)
    const isUnderTimePressure = globalTimeRemaining < UNT_TOTAL_TIME_SECONDS * 0.25
    
    const answerRecord = scoreAnswer(
      currentQuestion,
      selectedAnswers,
      timeSpent,
      currentIndex
    )
    
    const newAnswers = [...answers, answerRecord]
    setAnswers(newAnswers)
    
    // Update adaptive state
    const newAdaptiveState = updateAdaptiveState(
      adaptiveState,
      answerRecord,
      newAnswers,
      globalTimeRemaining
    )
    setAdaptiveState(newAdaptiveState)
    
    // Update performance state
    const newPerformanceState = updatePerformanceState(
      performanceState,
      answerRecord,
      isUnderTimePressure
    )
    setPerformanceState(newPerformanceState)
    
    setIsAnswered(true)
    setShowExplanation(true)
  }

  const nextQuestion = () => {
    if (currentIndex >= questions.length - 1) {
      finishExam(false)
      return
    }
    
    setCurrentIndex(prev => prev + 1)
    setSelectedAnswers([])
    setShowExplanation(false)
    setIsAnswered(false)
    setQuestionStartTime(Date.now())
  }

  const skipQuestion = () => {
    // Skip without answering
    if (currentIndex >= questions.length - 1) {
      finishExam(false)
      return
    }
    
    setCurrentIndex(prev => prev + 1)
    setSelectedAnswers([])
    setShowExplanation(false)
    setIsAnswered(false)
    setQuestionStartTime(Date.now())
  }

  // Render functions
  const currentQuestion = questions[currentIndex]
  const currentPassage = currentQuestion ? getPassageForQuestion(passages, currentQuestion) : null
  const questionInfo = currentQuestion ? getQuestionIndexInExam(questions, currentIndex) : null
  const subjectProgress = getSubjectProgress(questions, currentIndex)
  const paceInfo = calculateExpectedPace(
    currentIndex,
    UNT_TOTAL_TIME_SECONDS - globalTimeRemaining
  )

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                ҰБТға дайындық тест
              </h1>
              <p className="text-gray-600">
                Ұлттық бірыңғай тестілеу симуляциясы
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Емтихан құрылымы</h2>
              <div className="space-y-3">
                {UNT_SUBJECTS.map((subject, idx) => (
                  <div key={subject.subject} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-gray-800">{subject.name}</span>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <span>
                        {subject.singleChoiceCount > 0 && `${subject.singleChoiceCount} бір жауапты`}
                        {subject.multipleChoiceCount > 0 && ` + ${subject.multipleChoiceCount} көп жауапты`}
                      </span>
                      <span className="ml-2 font-semibold text-blue-600">{subject.totalPoints} ұпай</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Жалпы</span>
                  <span className="font-bold text-blue-600 text-lg">{UNT_TOTAL_POINTS} ұпай / 120 сұрақ</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Ережелер</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Жалпы уақыт: <strong>4 сағат (240 минут)</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Бір жауапты сұрақ: 5 нұсқа (A-E), 1 дұрыс жауап</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Көп жауапты сұрақ: 8 нұсқа (A-H), 2-4 дұрыс жауап</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Көп жауапты сұрақта толық сәйкестік қажет (2 ұпай)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>Қиындық деңгейі сіздің көрсеткіштеріңізге бейімделеді</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <Link
                href="/"
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Артқа
              </Link>
              <button
                onClick={startExam}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Тестті бастау
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'results' && diagnosticReport) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Диагностикалық есеп
              </h1>
              {diagnosticReport.wasAutoSubmitted && (
                <p className="text-orange-600 font-medium">
                  Уақыт аяқталғандықтан тест автоматты түрде жіберілді
                </p>
              )}
            </div>

            {/* Score Overview */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  {diagnosticReport.totalScore} / {diagnosticReport.maxScore}
                </div>
                <div className="text-xl text-gray-700">
                  {diagnosticReport.percentage}% — Баға: <span className="font-bold">{diagnosticReport.grade}</span>
                </div>
              </div>
            </div>

            {/* Subject Results */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Пәндер бойынша нәтижелер</h2>
              <div className="space-y-3">
                {diagnosticReport.subjectResults.map(result => {
                  const percentage = result.maxScore > 0 ? (result.totalScore / result.maxScore) * 100 : 0
                  const isStrongest = result.subject === diagnosticReport.strongestSubject.subject
                  const isWeakest = result.subject === diagnosticReport.weakestSubject.subject
                  
                  return (
                    <div 
                      key={result.subject} 
                      className={`p-4 rounded-lg border ${
                        isStrongest ? 'border-green-300 bg-green-50' : 
                        isWeakest ? 'border-red-300 bg-red-50' : 
                        'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">{result.name}</span>
                          {isStrongest && <span className="text-xs px-2 py-0.5 bg-green-200 text-green-800 rounded">Ең күшті</span>}
                          {isWeakest && <span className="text-xs px-2 py-0.5 bg-red-200 text-red-800 rounded">Ең әлсіз</span>}
                        </div>
                        <span className="font-semibold text-gray-800">
                          {result.totalScore} / {result.maxScore}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            percentage >= 80 ? 'bg-green-500' : 
                            percentage >= 60 ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Дұрыс: {result.correctAnswers}/{result.totalQuestions}</span>
                        <span>Орташа қиындық: {result.avgDifficulty}</span>
                        <span>Орташа уақыт: {result.avgTimePerQuestion.toFixed(0)}с</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Time Management */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Уақытты басқару</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {formatTime(diagnosticReport.totalTimeUsed)}
                  </div>
                  <div className="text-sm text-gray-600">Жұмсалған уақыт</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className={`text-2xl font-bold ${
                    diagnosticReport.timeManagement.pace === 'optimal' ? 'text-green-600' :
                    diagnosticReport.timeManagement.pace === 'rushed' ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {diagnosticReport.timeManagement.pace === 'optimal' ? 'Оңтайлы' :
                     diagnosticReport.timeManagement.pace === 'rushed' ? 'Тез' : 'Баяу'}
                  </div>
                  <div className="text-sm text-gray-600">Қарқын</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {diagnosticReport.timeManagement.actualPacePerQuestion}с
                  </div>
                  <div className="text-sm text-gray-600">Орташа уақыт/сұрақ</div>
                </div>
              </div>
            </div>

            {/* Stress Response */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Стресске төзімділік</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Қалыпты жағдайда дәлдік</span>
                    <span className="font-semibold">{diagnosticReport.stressResponse.normalAccuracy}%</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Қысым кезінде дәлдік</span>
                    <span className="font-semibold">{diagnosticReport.stressResponse.pressureAccuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Дәлдік төмендеуі</span>
                    <span className={`font-semibold ${
                      diagnosticReport.stressResponse.accuracyDrop < 5 ? 'text-green-600' :
                      diagnosticReport.stressResponse.accuracyDrop < 15 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>{diagnosticReport.stressResponse.accuracyDrop}%</span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${
                      diagnosticReport.stressResponse.stressResistance === 'high' ? 'text-green-600' :
                      diagnosticReport.stressResponse.stressResistance === 'moderate' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {diagnosticReport.stressResponse.stressResistance === 'high' ? 'Жоғары' :
                       diagnosticReport.stressResponse.stressResistance === 'moderate' ? 'Орташа' : 'Төмен'}
                    </div>
                    <div className="text-sm text-gray-600">Стресске төзімділік</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cognitive Profile */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Когнитивті профиль</h2>
              <div className="space-y-3">
                {[
                  { label: 'Логикалық ойлау', value: diagnosticReport.cognitiveProfile.logicalStrength },
                  { label: 'Аналитикалық шыдамдылық', value: diagnosticReport.cognitiveProfile.analyticalEndurance },
                  { label: 'Көп қадамды ойлау', value: diagnosticReport.cognitiveProfile.multiStepReasoning },
                  { label: 'Заңдылықтарды тану', value: diagnosticReport.cognitiveProfile.patternRecognition },
                  { label: 'Есеп шығару', value: diagnosticReport.cognitiveProfile.problemSolving },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-4">
                    <span className="w-48 text-gray-600">{item.label}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          item.value >= 80 ? 'bg-green-500' :
                          item.value >= 60 ? 'bg-blue-500' :
                          item.value >= 40 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-semibold">{item.value}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {diagnosticReport.cognitiveProfile.overallCognitiveScore}%
                </div>
                <div className="text-sm text-gray-600">Жалпы когнитивті балл</div>
              </div>
            </div>

            {/* Multiple Choice Precision */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Көп жауапты сұрақтар талдауы</h2>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="text-xl font-bold text-gray-800">{diagnosticReport.multipleChoicePrecision.totalAttempted}</div>
                  <div className="text-xs text-gray-600">Барлығы</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <div className="text-xl font-bold text-green-600">{diagnosticReport.multipleChoicePrecision.fullyCorrect}</div>
                  <div className="text-xs text-gray-600">Толық дұрыс</div>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg text-center">
                  <div className="text-xl font-bold text-yellow-600">{diagnosticReport.multipleChoicePrecision.partiallyCorrect}</div>
                  <div className="text-xs text-gray-600">Ішінара дұрыс</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg text-center">
                  <div className="text-xl font-bold text-red-600">{diagnosticReport.multipleChoicePrecision.completelyWrong}</div>
                  <div className="text-xs text-gray-600">Қате</div>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Заңдылық: </span>
                <span className="font-medium text-gray-800">{diagnosticReport.multipleChoicePrecision.commonMistakePattern}</span>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Ұсыныстар</h2>
              <div className="space-y-2">
                {diagnosticReport.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-600 font-bold">•</span>
                    <span className="text-gray-700">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <Link
                href="/"
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Басты бетке
              </Link>
              <button
                onClick={startExam}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Қайта тапсыру
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Exam phase
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-gray-800">ҰБТ Симуляциясы</h1>
              <div className="text-sm text-gray-600">
                {questionInfo?.subjectName}
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Pace indicator */}
              <div className={`text-sm px-3 py-1 rounded-full ${
                paceInfo.status === 'on_track' ? 'bg-green-100 text-green-700' :
                paceInfo.status === 'ahead' ? 'bg-blue-100 text-blue-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                {paceInfo.status === 'on_track' ? 'Қалыпты қарқын' :
                 paceInfo.status === 'ahead' ? 'Жылдам қарқын' : 'Баяу қарқын'}
              </div>
              
              {/* Difficulty */}
              <div className="text-sm">
                <span className="text-gray-600">Қиындық: </span>
                <span className="font-medium">{getAdaptiveDifficultyLabel(adaptiveState.currentDifficulty)}</span>
                <span className="text-gray-400 ml-1">({adaptiveState.currentDifficulty}/10)</span>
              </div>
              
              {/* Timer */}
              <div className={`text-xl font-mono font-bold ${
                globalTimeRemaining < 600 ? 'text-red-600' :
                globalTimeRemaining < 1800 ? 'text-orange-600' :
                'text-gray-800'
              }`}>
                {formatTime(globalTimeRemaining)}
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex gap-1">
              {subjectProgress.map((prog, idx) => (
                <div key={idx} className="flex-1">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${prog.total > 0 ? (prog.current / prog.total) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="text-xs text-center text-gray-500 mt-1">
                    {UNT_SUBJECTS[idx].name.split(' ')[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Reading passage */}
        {currentPassage && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">{currentPassage.title}</h3>
            <div className="text-gray-700 whitespace-pre-line leading-relaxed">
              {currentPassage.content}
            </div>
            {currentPassage.source && (
              <p className="text-sm text-gray-500 mt-3 italic">— {currentPassage.source}</p>
            )}
          </div>
        )}

        {/* Question card */}
        {currentQuestion && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Question header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Сұрақ {questionInfo?.overallIndex}/{questionInfo?.totalQuestions}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentQuestion.type === 'single' 
                    ? 'bg-gray-100 text-gray-700' 
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {currentQuestion.type === 'single' ? 'Бір жауапты' : 'Көп жауапты (2-4 жауап)'}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                Қиындық: {currentQuestion.difficulty}/10
              </span>
            </div>

            {/* Question prompt */}
            <div className="mb-6">
              <p className="text-lg text-gray-800 leading-relaxed">{currentQuestion.prompt}</p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswers.includes(idx)
                const isCorrect = currentQuestion.correctAnswers.includes(idx)
                const showResult = isAnswered
                
                let optionClass = 'border-gray-200 bg-white hover:border-blue-300'
                if (isSelected && !showResult) {
                  optionClass = 'border-blue-500 bg-blue-50'
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
                    onClick={() => handleAnswerSelect(idx)}
                    disabled={isAnswered}
                    className={`w-full flex items-center gap-4 p-4 border-2 rounded-lg transition-all text-left ${optionClass} ${
                      isAnswered ? 'cursor-default' : 'cursor-pointer'
                    }`}
                  >
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full border-2 font-medium ${
                      isSelected && !showResult ? 'border-blue-500 bg-blue-500 text-white' :
                      showResult && isCorrect ? 'border-green-500 bg-green-500 text-white' :
                      showResult && isSelected && !isCorrect ? 'border-red-500 bg-red-500 text-white' :
                      'border-gray-300 text-gray-600'
                    }`}>
                      {getOptionLetter(idx)}
                    </span>
                    <span className="flex-1 text-gray-800">{option}</span>
                    {showResult && isCorrect && (
                      <span className="text-green-600">✓</span>
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <span className="text-red-600">✗</span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Түсіндірме</h4>
                <p className="text-gray-700">{currentQuestion.explanation}</p>
                <div className="mt-2 text-sm text-gray-600">
                  Дұрыс жауап: <strong>{getSelectedLetters(currentQuestion.correctAnswers)}</strong>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {currentQuestion.type === 'multiple' && !isAnswered && (
                  <span>Таңдалды: {selectedAnswers.length} жауап</span>
                )}
                {isAnswered && (
                  <span className={answers[answers.length - 1]?.isCorrect ? 'text-green-600' : 'text-red-600'}>
                    {answers[answers.length - 1]?.isCorrect ? 
                      `+${answers[answers.length - 1]?.points} ұпай` : 
                      '0 ұпай'}
                  </span>
                )}
              </div>
              
              <div className="flex gap-3">
                {!isAnswered && (
                  <>
                    <button
                      onClick={skipQuestion}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Өткізіп жіберу
                    </button>
                    <button
                      onClick={submitAnswer}
                      disabled={selectedAnswers.length === 0}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        selectedAnswers.length > 0
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Жауап беру
                    </button>
                  </>
                )}
                {isAnswered && (
                  <button
                    onClick={nextQuestion}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {currentIndex >= questions.length - 1 ? 'Аяқтау' : 'Келесі сұрақ'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stats bar */}
        <div className="mt-6 flex items-center justify-center gap-8 text-sm text-gray-600">
          <div>
            Дұрыс: <span className="font-semibold text-green-600">{performanceState.correctCount}</span>
          </div>
          <div>
            Қате: <span className="font-semibold text-red-600">{performanceState.totalAnswered - performanceState.correctCount}</span>
          </div>
          <div>
            Серия: <span className="font-semibold">{performanceState.currentStreak}</span>
          </div>
          <button
            onClick={() => finishExam(false)}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Тестті аяқтау
          </button>
        </div>
      </main>
    </div>
  )
}
