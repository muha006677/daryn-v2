'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { BrainCircuit, ArrowLeft, Monitor, RotateCcw, Settings } from 'lucide-react'
import {
  GameQuestion,
  GameAnswer,
  GameResult,
  DifficultyLevel,
  DIFFICULTY_CONFIG,
  calculateGameResult,
} from '@/lib/classroomGames/types'
import {
  generateFlashMemoryQuestions,
  generateMemoryChallengeQuestion,
  generateProgressiveQuestions,
} from '@/lib/classroomGames/questionGenerators'

type Phase = 'menu' | 'memorize' | 'answer' | 'challenge_memorize' | 'challenge_answer' | 'results'

export default function FlashMemoryPage() {
  const [phase, setPhase] = useState<Phase>('menu')
  const [grade, setGrade] = useState<number>(2)
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium')
  const [isClassroomMode, setIsClassroomMode] = useState(false)
  
  const [questions, setQuestions] = useState<GameQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<GameAnswer[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [memorizeTime, setMemorizeTime] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(0)
  const [result, setResult] = useState<GameResult | null>(null)
  const [challengeQuestion, setChallengeQuestion] = useState<GameQuestion | null>(null)
  const [challengeAnswer, setChallengeAnswer] = useState<GameAnswer | null>(null)
  const [displaySequence, setDisplaySequence] = useState('')
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const currentQuestion = questions[currentIndex]

  const startGame = useCallback(() => {
    let gameQuestions: GameQuestion[]
    
    if (difficulty === 'medium') {
      gameQuestions = generateProgressiveQuestions(generateFlashMemoryQuestions, grade, 8)
    } else {
      gameQuestions = generateFlashMemoryQuestions(grade, difficulty, 8)
    }
    
    setQuestions(gameQuestions)
    setCurrentIndex(0)
    setAnswers([])
    setSelectedAnswer(null)
    setIsAnswered(false)
    setResult(null)
    setChallengeQuestion(null)
    setChallengeAnswer(null)
    startMemorizePhase(gameQuestions[0])
  }, [grade, difficulty])

  const startMemorizePhase = (question: GameQuestion) => {
    const sequence = question.prompt.split('\n')[0].replace('Санды есте сақта: ', '')
    setDisplaySequence(sequence)
    
    const memTime = question.difficulty === 'easy' ? 4 : question.difficulty === 'medium' ? 3 : 2
    setMemorizeTime(memTime)
    setPhase('memorize')
    
    setTimeout(() => {
      setPhase('answer')
      setQuestionStartTime(Date.now())
      setTimeLeft(question.timeLimit)
    }, memTime * 1000)
  }

  const startChallenge = () => {
    const challenge = generateMemoryChallengeQuestion()
    setChallengeQuestion(challenge)
    
    const sequence = challenge.prompt.split('\n')[0].replace('🌟 ЧЕЛЛЕНДЖ: Түстерді есте сақта: ', '')
    setDisplaySequence(sequence)
    setMemorizeTime(3)
    setPhase('challenge_memorize')
    
    setTimeout(() => {
      setPhase('challenge_answer')
      setQuestionStartTime(Date.now())
      setTimeLeft(challenge.timeLimit)
    }, 3000)
  }

  useEffect(() => {
    if (phase !== 'answer' && phase !== 'challenge_answer') return
    if (isAnswered) return
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [phase, currentIndex, isAnswered])

  const handleTimeout = useCallback(() => {
    if (isAnswered) return
    
    const question = phase === 'challenge_answer' ? challengeQuestion : currentQuestion
    if (!question) return
    
    const timeSpent = (Date.now() - questionStartTime) / 1000
    const answer: GameAnswer = {
      questionId: question.id,
      selectedAnswer: -1,
      isCorrect: false,
      timeSpent,
      difficulty: question.difficulty,
    }
    
    if (phase === 'challenge_answer') {
      setChallengeAnswer(answer)
      finishGame(answer)
    } else {
      setAnswers(prev => [...prev, answer])
      setIsAnswered(true)
      setTimeout(() => nextQuestion(), 1500)
    }
  }, [phase, currentQuestion, challengeQuestion, questionStartTime, isAnswered])

  const handleAnswer = useCallback((optionIndex: number) => {
    if (isAnswered) return
    
    const question = phase === 'challenge_answer' ? challengeQuestion : currentQuestion
    if (!question) return
    
    setSelectedAnswer(optionIndex)
    setIsAnswered(true)
    
    const timeSpent = (Date.now() - questionStartTime) / 1000
    const isCorrect = optionIndex === question.correctAnswer
    
    const answer: GameAnswer = {
      questionId: question.id,
      selectedAnswer: optionIndex,
      isCorrect,
      timeSpent,
      difficulty: question.difficulty,
    }
    
    if (phase === 'challenge_answer') {
      setChallengeAnswer(answer)
      setTimeout(() => finishGame(answer), 2000)
    } else {
      setAnswers(prev => [...prev, answer])
      setTimeout(() => nextQuestion(), 1500)
    }
  }, [phase, currentQuestion, challengeQuestion, questionStartTime, isAnswered])

  const nextQuestion = useCallback(() => {
    setSelectedAnswer(null)
    setIsAnswered(false)
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      startMemorizePhase(questions[currentIndex + 1])
    } else {
      startChallenge()
    }
  }, [currentIndex, questions])

  const finishGame = useCallback((finalChallengeAnswer?: GameAnswer) => {
    const gameResult = calculateGameResult(answers, 15, finalChallengeAnswer)
    setResult(gameResult)
    setPhase('results')
  }, [answers])

  const resetGame = () => {
    setPhase('menu')
    setQuestions([])
    setCurrentIndex(0)
    setAnswers([])
    setSelectedAnswer(null)
    setIsAnswered(false)
    setResult(null)
    setChallengeQuestion(null)
    setChallengeAnswer(null)
    setDisplaySequence('')
  }

  return (
    <div className={`min-h-screen py-8 ${isClassroomMode ? 'bg-cyan-900' : 'bg-gradient-to-b from-cyan-100 to-teal-50'}`}>
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${isClassroomMode ? 'max-w-6xl' : 'max-w-4xl'}`}>
        
        <Link href="/" className={`inline-flex items-center gap-2 mb-6 ${isClassroomMode ? 'text-cyan-200 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
          <ArrowLeft className="w-5 h-5" strokeWidth={1.75} />
          Басты бетке қайту
        </Link>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`rounded-2xl bg-cyan-500 flex items-center justify-center ${isClassroomMode ? 'w-24 h-24' : 'w-16 h-16'}`}>
              <BrainCircuit className={`text-white ${isClassroomMode ? 'w-12 h-12' : 'w-8 h-8'}`} strokeWidth={1.75} />
            </div>
          </div>
          <h1 className={`font-bold mb-2 ${isClassroomMode ? 'text-5xl text-white' : 'text-4xl text-slate-900'}`}>
            Flash Memory
          </h1>
          <p className={isClassroomMode ? 'text-xl text-cyan-200' : 'text-slate-600'}>
            Есте сақтау қабілетін жаттықтыру ойыны
          </p>
        </div>

        {/* Menu Phase */}
        {phase === 'menu' && (
          <div className={`rounded-2xl shadow-xl p-8 ${isClassroomMode ? 'bg-cyan-800 border-2 border-cyan-500' : 'bg-white border border-slate-200'}`}>
            
            {/* Difficulty Selection */}
            <div className="mb-6">
              <label className={`block font-bold mb-3 ${isClassroomMode ? 'text-white text-xl' : 'text-slate-700'}`}>
                🎯 Деңгей таңдау:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map(level => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`p-4 rounded-xl font-bold text-lg transition-all ${
                      difficulty === level
                        ? level === 'easy' 
                          ? 'bg-green-500 text-white ring-4 ring-green-300'
                          : level === 'medium'
                          ? 'bg-yellow-500 text-white ring-4 ring-yellow-300'
                          : 'bg-red-500 text-white ring-4 ring-red-300'
                        : isClassroomMode
                        ? 'bg-cyan-700 text-cyan-200 hover:bg-cyan-600'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {DIFFICULTY_CONFIG[level].emoji} {DIFFICULTY_CONFIG[level].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grade Selection */}
            <div className="mb-6">
              <label className={`block font-bold mb-3 ${isClassroomMode ? 'text-white text-xl' : 'text-slate-700'}`}>
                📚 Сынып:
              </label>
              <div className="grid grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map(g => (
                  <button
                    key={g}
                    onClick={() => setGrade(g)}
                    className={`p-3 rounded-xl font-bold text-lg transition-all ${
                      grade === g
                        ? 'bg-teal-500 text-white ring-4 ring-teal-300'
                        : isClassroomMode
                        ? 'bg-cyan-700 text-cyan-200 hover:bg-cyan-600'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Classroom Mode Toggle */}
            <div className="mb-8">
              <button
                onClick={() => setIsClassroomMode(!isClassroomMode)}
                className={`w-full p-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                  isClassroomMode
                    ? 'bg-yellow-500 text-black'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                <Monitor className="w-5 h-5" strokeWidth={1.75} />
                {isClassroomMode ? 'Сынып режимі қосулы' : 'Сынып режимін қосу'}
              </button>
            </div>

            {/* Start Button */}
            <button
              onClick={startGame}
              className="w-full py-5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-2xl rounded-xl hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-3"
            >
              <BrainCircuit className="w-7 h-7" strokeWidth={1.75} />
              Есте сақта!
            </button>
          </div>
        )}

        {/* Memorize Phase */}
        {(phase === 'memorize' || phase === 'challenge_memorize') && (
          <div className={`rounded-2xl shadow-xl p-8 ${isClassroomMode ? 'bg-cyan-800 border-2 border-cyan-500' : 'bg-white border border-slate-200'}`}>
            
            <div className="text-center mb-6">
              <span className={`px-6 py-3 rounded-full font-bold text-xl ${
                phase === 'challenge_memorize' 
                  ? 'bg-yellow-500 text-black' 
                  : isClassroomMode 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-cyan-100 text-cyan-700'
              }`}>
                {phase === 'challenge_memorize' ? '🌟 ЧЕЛЛЕНДЖ!' : `Тізбек ${currentIndex + 1} / ${questions.length}`}
              </span>
            </div>

            <div className={`text-center py-12 ${isClassroomMode ? 'py-16' : ''}`}>
              <p className={`mb-4 ${isClassroomMode ? 'text-2xl text-cyan-200' : 'text-lg text-slate-600'}`}>
                👀 Есте сақта!
              </p>
              <div className={`font-bold mb-8 ${isClassroomMode ? 'text-8xl text-white' : 'text-6xl text-slate-900'}`}>
                {displaySequence}
              </div>
              <div className={`text-4xl ${isClassroomMode ? 'text-6xl' : ''} animate-pulse`}>
                ⏳ {memorizeTime}...
              </div>
            </div>
          </div>
        )}

        {/* Answer Phase */}
        {(phase === 'answer' || phase === 'challenge_answer') && (
          <div className={`rounded-2xl shadow-xl p-8 ${isClassroomMode ? 'bg-cyan-800 border-2 border-cyan-500' : 'bg-white border border-slate-200'}`}>
            
            {/* Progress & Timer */}
            <div className="flex items-center justify-between mb-6">
              <div className={`text-lg font-bold ${isClassroomMode ? 'text-white' : 'text-slate-700'}`}>
                {phase === 'challenge_answer' ? (
                  <span className="text-yellow-500">🌟 ЧЕЛЛЕНДЖ!</span>
                ) : (
                  <span>Тізбек {currentIndex + 1} / {questions.length}</span>
                )}
              </div>
              
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-lg ${
                timeLeft <= 5 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : isClassroomMode 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-slate-100 text-slate-700'
              }`}>
                ⏱️ {timeLeft}с
              </div>
            </div>

            {/* Progress Bar */}
            {phase === 'answer' && (
              <div className="w-full h-3 bg-slate-200 rounded-full mb-6 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            )}

            {/* Question */}
            <div className={`text-center mb-8 ${isClassroomMode ? 'py-8' : 'py-4'}`}>
              <p className={`font-bold leading-relaxed ${isClassroomMode ? 'text-3xl text-white' : 'text-2xl text-slate-900'}`}>
                🔒 {phase === 'challenge_answer' 
                  ? challengeQuestion?.prompt.split('\n\n')[1] 
                  : currentQuestion?.prompt.split('\n\n')[1]}
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
              {(phase === 'challenge_answer' ? challengeQuestion?.options : currentQuestion?.options)?.map((option, idx) => {
                const question = phase === 'challenge_answer' ? challengeQuestion : currentQuestion
                const isCorrect = idx === question?.correctAnswer
                const isSelected = selectedAnswer === idx
                
                let buttonClass = ''
                if (isAnswered) {
                  if (isCorrect) {
                    buttonClass = 'bg-green-500 text-white ring-4 ring-green-300'
                  } else if (isSelected) {
                    buttonClass = 'bg-red-500 text-white ring-4 ring-red-300'
                  } else {
                    buttonClass = isClassroomMode ? 'bg-cyan-700 text-cyan-300' : 'bg-slate-100 text-slate-400'
                  }
                } else {
                  buttonClass = isClassroomMode 
                    ? 'bg-cyan-600 text-white hover:bg-cyan-500 hover:scale-105' 
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200 hover:scale-105'
                }
                
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={isAnswered}
                    className={`p-6 rounded-xl font-bold transition-all ${isClassroomMode ? 'text-3xl' : 'text-2xl'} ${buttonClass}`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Results Phase */}
        {phase === 'results' && result && (
          <div className={`rounded-2xl shadow-xl p-8 ${isClassroomMode ? 'bg-cyan-800 border-2 border-cyan-500' : 'bg-white border border-slate-200'}`}>
            
            {/* Main Badge */}
            <div className="text-center mb-8">
              <div className={`text-8xl mb-4 ${isClassroomMode ? 'text-9xl' : ''}`}>
                {result.badgeEmoji}
              </div>
              <h2 className={`font-bold mb-2 ${isClassroomMode ? 'text-4xl text-white' : 'text-3xl text-slate-900'}`}>
                {result.badgeLabel}
              </h2>
              <p className={`text-lg ${isClassroomMode ? 'text-cyan-200' : 'text-slate-600'}`}>
                {result.accuracy >= 80 ? 'Керемет есте сақтау! 🧠' : result.accuracy >= 60 ? 'Жақсы жұмыс! 👏' : 'Жаттығуды жалғастыр! 💪'}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className={`p-6 rounded-xl text-center ${isClassroomMode ? 'bg-cyan-700' : 'bg-slate-50'}`}>
                <div className={`text-4xl font-bold ${isClassroomMode ? 'text-white' : 'text-cyan-600'}`}>
                  {result.accuracy}%
                </div>
                <div className={isClassroomMode ? 'text-cyan-200' : 'text-slate-600'}>Дәлдік</div>
              </div>
              <div className={`p-6 rounded-xl text-center ${isClassroomMode ? 'bg-cyan-700' : 'bg-slate-50'}`}>
                <div className={`text-4xl font-bold ${isClassroomMode ? 'text-white' : 'text-blue-600'}`}>
                  {result.correctAnswers}/{result.totalQuestions}
                </div>
                <div className={isClassroomMode ? 'text-cyan-200' : 'text-slate-600'}>Дұрыс</div>
              </div>
              <div className={`p-6 rounded-xl text-center ${isClassroomMode ? 'bg-cyan-700' : 'bg-slate-50'}`}>
                <div className={`text-4xl font-bold ${isClassroomMode ? 'text-white' : 'text-green-600'}`}>
                  {result.avgTimePerQuestion}с
                </div>
                <div className={isClassroomMode ? 'text-cyan-200' : 'text-slate-600'}>Орташа уақыт</div>
              </div>
              <div className={`p-6 rounded-xl text-center ${isClassroomMode ? 'bg-cyan-700' : 'bg-slate-50'}`}>
                <div className={`text-4xl ${isClassroomMode ? 'text-white' : 'text-slate-700'}`}>
                  {result.speedLevel === 'fast' ? '🚀 Жылдам' : result.speedLevel === 'normal' ? '⚡ Қалыпты' : '🐢 Баяу'}
                </div>
                <div className={isClassroomMode ? 'text-cyan-200' : 'text-slate-600'}>Жылдамдық</div>
              </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className={`p-6 rounded-xl mb-8 ${isClassroomMode ? 'bg-cyan-700' : 'bg-slate-50'}`}>
              <h3 className={`font-bold mb-4 ${isClassroomMode ? 'text-white' : 'text-slate-900'}`}>
                📊 Деңгей бойынша нәтиже:
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map(level => (
                  <div key={level} className="text-center">
                    <div className={`text-2xl font-bold ${
                      level === 'easy' ? 'text-green-500' : level === 'medium' ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {result.difficultyBreakdown[level].correct}/{result.difficultyBreakdown[level].total}
                    </div>
                    <div className={isClassroomMode ? 'text-cyan-200' : 'text-slate-600'}>
                      {DIFFICULTY_CONFIG[level].label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenge Result */}
            {result.challengeCompleted && (
              <div className={`p-6 rounded-xl mb-8 ${result.challengeCorrect ? 'bg-yellow-100' : 'bg-orange-100'}`}>
                <div className="text-center">
                  <span className="text-4xl">{result.challengeCorrect ? '🏆' : '🎯'}</span>
                  <p className={`font-bold mt-2 ${result.challengeCorrect ? 'text-yellow-700' : 'text-orange-700'}`}>
                    Челлендж: {result.challengeCorrect ? 'Супер есте сақтау! 🧠' : 'Келесі жолы!'}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={startGame}
                className="py-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-xl rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" strokeWidth={1.75} />
                Қайта ойнау
              </button>
              <button
                onClick={resetGame}
                className={`py-4 font-bold text-xl rounded-xl transition-all flex items-center justify-center gap-2 ${
                  isClassroomMode 
                    ? 'bg-cyan-600 text-white hover:bg-cyan-500' 
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                <Settings className="w-5 h-5" strokeWidth={1.75} />
                Баптау
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
