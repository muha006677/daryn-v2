'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Puzzle, ArrowLeft, Monitor, Trophy, RotateCcw, Settings } from 'lucide-react'
import {
  GameQuestion,
  GameAnswer,
  GameResult,
  DifficultyLevel,
  DIFFICULTY_CONFIG,
  SKILL_BADGES,
  calculateGameResult,
} from '@/lib/classroomGames/types'
import {
  generateLogicSprintQuestions,
  generateLogicChallengeQuestion,
  generateProgressiveQuestions,
} from '@/lib/classroomGames/questionGenerators'

type Phase = 'menu' | 'game' | 'challenge' | 'results'

export default function LogicSprintPage() {
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
  const [questionStartTime, setQuestionStartTime] = useState(0)
  const [result, setResult] = useState<GameResult | null>(null)
  const [challengeQuestion, setChallengeQuestion] = useState<GameQuestion | null>(null)
  const [challengeAnswer, setChallengeAnswer] = useState<GameAnswer | null>(null)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const currentQuestion = questions[currentIndex]

  const startGame = useCallback(() => {
    let gameQuestions: GameQuestion[]
    
    if (difficulty === 'medium') {
      gameQuestions = generateProgressiveQuestions(generateLogicSprintQuestions, grade, 8)
    } else {
      gameQuestions = generateLogicSprintQuestions(grade, difficulty, 8)
    }
    
    setQuestions(gameQuestions)
    setCurrentIndex(0)
    setAnswers([])
    setSelectedAnswer(null)
    setIsAnswered(false)
    setResult(null)
    setChallengeQuestion(null)
    setChallengeAnswer(null)
    setPhase('game')
    setQuestionStartTime(Date.now())
    setTimeLeft(gameQuestions[0]?.timeLimit || 15)
  }, [grade, difficulty])

  useEffect(() => {
    if (phase !== 'game' && phase !== 'challenge') return
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
    
    const question = phase === 'challenge' ? challengeQuestion : currentQuestion
    if (!question) return
    
    const timeSpent = (Date.now() - questionStartTime) / 1000
    const answer: GameAnswer = {
      questionId: question.id,
      selectedAnswer: -1,
      isCorrect: false,
      timeSpent,
      difficulty: question.difficulty,
    }
    
    if (phase === 'challenge') {
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
    
    const question = phase === 'challenge' ? challengeQuestion : currentQuestion
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
    
    if (phase === 'challenge') {
      setChallengeAnswer(answer)
      setTimeout(() => finishGame(answer), 2000)
    } else {
      setAnswers(prev => [...prev, answer])
      setTimeout(() => nextQuestion(), 1500)
    }
  }, [phase, currentQuestion, challengeQuestion, questionStartTime, isAnswered])

  const nextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
      setQuestionStartTime(Date.now())
      setTimeLeft(questions[currentIndex + 1]?.timeLimit || 15)
    } else {
      const challenge = generateLogicChallengeQuestion(grade)
      setChallengeQuestion(challenge)
      setPhase('challenge')
      setSelectedAnswer(null)
      setIsAnswered(false)
      setQuestionStartTime(Date.now())
      setTimeLeft(challenge.timeLimit)
    }
  }, [currentIndex, questions, grade])

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
  }

  return (
    <div className={`min-h-screen py-8 ${isClassroomMode ? 'bg-purple-900' : 'bg-gradient-to-b from-purple-100 to-pink-50'}`}>
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${isClassroomMode ? 'max-w-6xl' : 'max-w-4xl'}`}>
        
        <Link href="/" className={`inline-flex items-center gap-2 mb-6 ${isClassroomMode ? 'text-purple-200 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
          <ArrowLeft className="w-5 h-5" strokeWidth={1.75} />
          Басты бетке қайту
        </Link>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`rounded-2xl bg-purple-500 flex items-center justify-center ${isClassroomMode ? 'w-24 h-24' : 'w-16 h-16'}`}>
              <Puzzle className={`text-white ${isClassroomMode ? 'w-12 h-12' : 'w-8 h-8'}`} strokeWidth={1.75} />
            </div>
          </div>
          <h1 className={`font-bold mb-2 ${isClassroomMode ? 'text-5xl text-white' : 'text-4xl text-slate-900'}`}>
            Логикалық спринт
          </h1>
          <p className={isClassroomMode ? 'text-xl text-purple-200' : 'text-slate-600'}>
            Логикалық заңдылық табу ойыны
          </p>
        </div>

        {/* Menu Phase */}
        {phase === 'menu' && (
          <div className={`rounded-2xl shadow-xl p-8 ${isClassroomMode ? 'bg-purple-800 border-2 border-purple-500' : 'bg-white border border-slate-200'}`}>
            
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
                        ? 'bg-purple-700 text-purple-200 hover:bg-purple-600'
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
                        ? 'bg-purple-500 text-white ring-4 ring-purple-300'
                        : isClassroomMode
                        ? 'bg-purple-700 text-purple-200 hover:bg-purple-600'
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
              className="w-full py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-2xl rounded-xl hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-3"
            >
              <Puzzle className="w-7 h-7" strokeWidth={1.75} />
              Ойынды бастау!
            </button>
          </div>
        )}

        {/* Game Phase */}
        {(phase === 'game' || phase === 'challenge') && (
          <div className={`rounded-2xl shadow-xl p-8 ${isClassroomMode ? 'bg-purple-800 border-2 border-purple-500' : 'bg-white border border-slate-200'}`}>
            
            {/* Progress & Timer */}
            <div className="flex items-center justify-between mb-6">
              <div className={`text-lg font-bold ${isClassroomMode ? 'text-white' : 'text-slate-700'}`}>
                {phase === 'challenge' ? (
                  <span className="text-yellow-500">🌟 ЧЕЛЛЕНДЖ!</span>
                ) : (
                  <span>Сұрақ {currentIndex + 1} / {questions.length}</span>
                )}
              </div>
              
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-lg ${
                timeLeft <= 5 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : isClassroomMode 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-slate-100 text-slate-700'
              }`}>
                ⏱️ {timeLeft}с
              </div>
            </div>

            {/* Progress Bar */}
            {phase === 'game' && (
              <div className="w-full h-3 bg-slate-200 rounded-full mb-6 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            )}

            {/* Current Difficulty Badge */}
            {(phase === 'game' && currentQuestion) && (
              <div className="flex justify-center mb-4">
                <span className={`px-4 py-2 rounded-full text-white font-bold ${
                  currentQuestion.difficulty === 'easy' ? 'bg-green-500' :
                  currentQuestion.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  {DIFFICULTY_CONFIG[currentQuestion.difficulty].emoji} {DIFFICULTY_CONFIG[currentQuestion.difficulty].label}
                </span>
              </div>
            )}

            {/* Question */}
            <div className={`text-center mb-8 ${isClassroomMode ? 'py-8' : 'py-4'}`}>
              <p className={`font-bold leading-relaxed ${isClassroomMode ? 'text-4xl text-white' : 'text-2xl text-slate-900'}`}>
                {phase === 'challenge' ? challengeQuestion?.prompt : currentQuestion?.prompt}
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
              {(phase === 'challenge' ? challengeQuestion?.options : currentQuestion?.options)?.map((option, idx) => {
                const question = phase === 'challenge' ? challengeQuestion : currentQuestion
                const isCorrect = idx === question?.correctAnswer
                const isSelected = selectedAnswer === idx
                
                let buttonClass = ''
                if (isAnswered) {
                  if (isCorrect) {
                    buttonClass = 'bg-green-500 text-white ring-4 ring-green-300'
                  } else if (isSelected) {
                    buttonClass = 'bg-red-500 text-white ring-4 ring-red-300'
                  } else {
                    buttonClass = isClassroomMode ? 'bg-purple-700 text-purple-300' : 'bg-slate-100 text-slate-400'
                  }
                } else {
                  buttonClass = isClassroomMode 
                    ? 'bg-purple-600 text-white hover:bg-purple-500 hover:scale-105' 
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200 hover:scale-105'
                }
                
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={isAnswered}
                    className={`p-6 rounded-xl font-bold transition-all ${isClassroomMode ? 'text-2xl' : 'text-xl'} ${buttonClass}`}
                  >
                    {['A', 'B', 'C', 'D'][idx]}. {option}
                  </button>
                )
              })}
            </div>

            {/* Hidden Logic Reveal */}
            {isAnswered && (phase === 'game' ? currentQuestion?.hiddenLogic : challengeQuestion?.hiddenLogic) && (
              <div className={`mt-6 p-4 rounded-xl ${isClassroomMode ? 'bg-purple-700 text-purple-200' : 'bg-purple-50 text-purple-700'}`}>
                <p className="font-bold">💡 {phase === 'game' ? currentQuestion?.hiddenLogic : challengeQuestion?.hiddenLogic}</p>
              </div>
            )}
          </div>
        )}

        {/* Results Phase */}
        {phase === 'results' && result && (
          <div className={`rounded-2xl shadow-xl p-8 ${isClassroomMode ? 'bg-purple-800 border-2 border-purple-500' : 'bg-white border border-slate-200'}`}>
            
            {/* Main Badge */}
            <div className="text-center mb-8">
              <div className={`text-8xl mb-4 ${isClassroomMode ? 'text-9xl' : ''}`}>
                {result.badgeEmoji}
              </div>
              <h2 className={`font-bold mb-2 ${isClassroomMode ? 'text-4xl text-white' : 'text-3xl text-slate-900'}`}>
                {result.badgeLabel}
              </h2>
              <p className={`text-lg ${isClassroomMode ? 'text-purple-200' : 'text-slate-600'}`}>
                {result.accuracy >= 80 ? 'Керемет нәтиже! 🎉' : result.accuracy >= 60 ? 'Жақсы жұмыс! 👏' : 'Жаттығуды жалғастыр! 💪'}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className={`p-6 rounded-xl text-center ${isClassroomMode ? 'bg-purple-700' : 'bg-slate-50'}`}>
                <div className={`text-4xl font-bold ${isClassroomMode ? 'text-white' : 'text-purple-600'}`}>
                  {result.accuracy}%
                </div>
                <div className={isClassroomMode ? 'text-purple-200' : 'text-slate-600'}>Дәлдік</div>
              </div>
              <div className={`p-6 rounded-xl text-center ${isClassroomMode ? 'bg-purple-700' : 'bg-slate-50'}`}>
                <div className={`text-4xl font-bold ${isClassroomMode ? 'text-white' : 'text-blue-600'}`}>
                  {result.correctAnswers}/{result.totalQuestions}
                </div>
                <div className={isClassroomMode ? 'text-purple-200' : 'text-slate-600'}>Дұрыс</div>
              </div>
              <div className={`p-6 rounded-xl text-center ${isClassroomMode ? 'bg-purple-700' : 'bg-slate-50'}`}>
                <div className={`text-4xl font-bold ${isClassroomMode ? 'text-white' : 'text-green-600'}`}>
                  {result.avgTimePerQuestion}с
                </div>
                <div className={isClassroomMode ? 'text-purple-200' : 'text-slate-600'}>Орташа уақыт</div>
              </div>
              <div className={`p-6 rounded-xl text-center ${isClassroomMode ? 'bg-purple-700' : 'bg-slate-50'}`}>
                <div className={`text-4xl ${isClassroomMode ? 'text-white' : 'text-slate-700'}`}>
                  {result.speedLevel === 'fast' ? '🚀 Жылдам' : result.speedLevel === 'normal' ? '⚡ Қалыпты' : '🐢 Баяу'}
                </div>
                <div className={isClassroomMode ? 'text-purple-200' : 'text-slate-600'}>Жылдамдық</div>
              </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className={`p-6 rounded-xl mb-8 ${isClassroomMode ? 'bg-purple-700' : 'bg-slate-50'}`}>
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
                    <div className={isClassroomMode ? 'text-purple-200' : 'text-slate-600'}>
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
                    Челлендж: {result.challengeCorrect ? 'Жеңіс! +10 бонус ұпай!' : 'Келесі жолы!'}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={startGame}
                className="py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" strokeWidth={1.75} />
                Қайта ойнау
              </button>
              <button
                onClick={resetGame}
                className={`py-4 font-bold text-xl rounded-xl transition-all flex items-center justify-center gap-2 ${
                  isClassroomMode 
                    ? 'bg-purple-600 text-white hover:bg-purple-500' 
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
