'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Scale, ArrowLeft, Monitor, RotateCcw, Settings } from 'lucide-react'
import {
  DifficultyLevel,
  DIFFICULTY_CONFIG,
  SKILL_BADGES,
  getSkillBadge,
} from '@/lib/classroomGames/types'

type Phase = 'menu' | 'game' | 'challenge' | 'results'

interface JudgeQuestion {
  statement: string
  isTrue: boolean
  explanation: string
  difficulty: DifficultyLevel
}

interface JudgeAnswer {
  questionId: number
  response: boolean | null
  isCorrect: boolean
  timeMs: number
}

interface GameResult {
  totalQuestions: number
  correctCount: number
  accuracy: number
  avgTimeMs: number
  skillBadge: 'high' | 'good' | 'practice'
  challengeCorrect: boolean
  difficultyBreakdown: {
    easy: { correct: number; total: number }
    medium: { correct: number; total: number }
    hard: { correct: number; total: number }
  }
}

const QUESTIONS: JudgeQuestion[] = [
  // Easy
  { statement: '2 + 2 = 4', isTrue: true, explanation: 'Қосу дұрыс', difficulty: 'easy' },
  { statement: '5 - 3 = 3', isTrue: false, explanation: '5 - 3 = 2', difficulty: 'easy' },
  { statement: 'Күн — жұлдыз', isTrue: true, explanation: 'Күн ең жақын жұлдыз', difficulty: 'easy' },
  { statement: 'Ай — планета', isTrue: false, explanation: 'Ай — Жердің серігі', difficulty: 'easy' },
  { statement: '10 > 5', isTrue: true, explanation: '10 санынан 5 кіші', difficulty: 'easy' },
  { statement: 'Жыл = 365 күн', isTrue: true, explanation: 'Қарапайым жылда 365 күн', difficulty: 'easy' },
  { statement: '3 × 3 = 6', isTrue: false, explanation: '3 × 3 = 9', difficulty: 'easy' },
  { statement: 'Су 100°C-да қайнайды', isTrue: true, explanation: 'Қалыпты қысымда', difficulty: 'easy' },
  
  // Medium
  { statement: '12 × 12 = 144', isTrue: true, explanation: '12² = 144', difficulty: 'medium' },
  { statement: 'Үшбұрыштың бұрыштары қосындысы 360°', isTrue: false, explanation: '180°', difficulty: 'medium' },
  { statement: 'Жердің ең биік тауы — Эверест', isTrue: true, explanation: '8848 м', difficulty: 'medium' },
  { statement: 'Пи саны = 3.14', isTrue: false, explanation: 'π ≈ 3.14159...', difficulty: 'medium' },
  { statement: 'Квадраттың барлық қабырғалары тең', isTrue: true, explanation: 'Квадрат анықтамасы', difficulty: 'medium' },
  { statement: '0 × 100 = 100', isTrue: false, explanation: '0 × 100 = 0', difficulty: 'medium' },
  { statement: '1 км = 1000 м', isTrue: true, explanation: 'Ұзындық бірліктері', difficulty: 'medium' },
  { statement: 'Шаршының периметрі = 4a', isTrue: true, explanation: 'a — қабырға ұзындығы', difficulty: 'medium' },
  
  // Hard
  { statement: '√144 = 14', isTrue: false, explanation: '√144 = 12', difficulty: 'hard' },
  { statement: 'Жарық жылдамдығы ≈ 300 000 км/с', isTrue: true, explanation: 'c ≈ 299 792 км/с', difficulty: 'hard' },
  { statement: '2³ = 6', isTrue: false, explanation: '2³ = 8', difficulty: 'hard' },
  { statement: 'Шеңбердің ауданы = πr²', isTrue: true, explanation: 'Шеңбер ауданы формуласы', difficulty: 'hard' },
  { statement: '100 ÷ 4 = 20', isTrue: false, explanation: '100 ÷ 4 = 25', difficulty: 'hard' },
  { statement: 'Цельсий бойынша абсолют нөл = -273°C', isTrue: true, explanation: '−273.15 °C', difficulty: 'hard' },
  { statement: 'Жердің диаметрі ≈ 12 000 км', isTrue: true, explanation: '≈ 12 742 км', difficulty: 'hard' },
  { statement: '1 + 2 + 3 + ... + 10 = 50', isTrue: false, explanation: '= 55', difficulty: 'hard' },
]

const CHALLENGE_QUESTIONS: JudgeQuestion[] = [
  { statement: '2²⁰²⁴ — жұп сан', isTrue: true, explanation: '2-нің кез келген дәрежесі жұп', difficulty: 'hard' },
  { statement: 'Квадрат теңдеудің ең көп 3 түбірі бар', isTrue: false, explanation: 'Ең көп 2 түбір', difficulty: 'hard' },
  { statement: '0! = 1', isTrue: true, explanation: 'Факториал анықтамасы бойынша', difficulty: 'hard' },
]

export default function QuickJudgePage() {
  const [phase, setPhase] = useState<Phase>('menu')
  const [grade, setGrade] = useState<number>(2)
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium')
  const [isClassroomMode, setIsClassroomMode] = useState(false)
  
  const [questions, setQuestions] = useState<JudgeQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<JudgeAnswer[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(0)
  const [isAnswered, setIsAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null)
  const [result, setResult] = useState<GameResult | null>(null)
  const [challengeQuestion, setChallengeQuestion] = useState<JudgeQuestion | null>(null)
  const [challengeAnswer, setChallengeAnswer] = useState<boolean | null>(null)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const currentQuestion = questions[currentIndex]

  const startGame = useCallback(() => {
    let gameQuestions: JudgeQuestion[]
    
    if (difficulty === 'medium') {
      const easy = QUESTIONS.filter(q => q.difficulty === 'easy').slice(0, 4)
      const medium = QUESTIONS.filter(q => q.difficulty === 'medium').slice(0, 4)
      const hard = QUESTIONS.filter(q => q.difficulty === 'hard').slice(0, 2)
      gameQuestions = [...easy, ...medium, ...hard].sort(() => Math.random() - 0.5)
    } else {
      gameQuestions = QUESTIONS.filter(q => q.difficulty === difficulty).slice(0, 10)
    }
    
    setQuestions(gameQuestions)
    setCurrentIndex(0)
    setAnswers([])
    setIsAnswered(false)
    setSelectedAnswer(null)
    setResult(null)
    setChallengeQuestion(null)
    setPhase('game')
    setQuestionStartTime(Date.now())
    setTimeLeft(difficulty === 'easy' ? 10 : difficulty === 'medium' ? 7 : 5)
  }, [difficulty])

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
    
    const timeMs = Date.now() - questionStartTime
    const answer: JudgeAnswer = {
      questionId: currentIndex,
      response: null,
      isCorrect: false,
      timeMs,
    }
    
    if (phase === 'challenge') {
      setChallengeAnswer(null)
      finishGame(false)
    } else {
      setAnswers(prev => [...prev, answer])
      setIsAnswered(true)
      setTimeout(() => nextQuestion(), 1500)
    }
  }, [phase, currentQuestion, challengeQuestion, questionStartTime, isAnswered, currentIndex])

  const handleAnswer = useCallback((response: boolean) => {
    if (isAnswered) return
    
    const question = phase === 'challenge' ? challengeQuestion : currentQuestion
    if (!question) return
    
    setSelectedAnswer(response)
    setIsAnswered(true)
    
    const timeMs = Date.now() - questionStartTime
    const isCorrect = response === question.isTrue
    
    if (phase === 'challenge') {
      setChallengeAnswer(response)
      setTimeout(() => finishGame(isCorrect), 2000)
    } else {
      const answer: JudgeAnswer = {
        questionId: currentIndex,
        response,
        isCorrect,
        timeMs,
      }
      setAnswers(prev => [...prev, answer])
      setTimeout(() => nextQuestion(), 1500)
    }
  }, [phase, currentQuestion, challengeQuestion, questionStartTime, isAnswered, currentIndex])

  const nextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
      setQuestionStartTime(Date.now())
      setTimeLeft(difficulty === 'easy' ? 10 : difficulty === 'medium' ? 7 : 5)
    } else {
      const challenge = CHALLENGE_QUESTIONS[Math.floor(Math.random() * CHALLENGE_QUESTIONS.length)]
      setChallengeQuestion(challenge)
      setPhase('challenge')
      setSelectedAnswer(null)
      setIsAnswered(false)
      setQuestionStartTime(Date.now())
      setTimeLeft(15)
    }
  }, [currentIndex, questions, difficulty])

  const finishGame = useCallback((challengeCorrect: boolean) => {
    const correctCount = answers.filter(a => a.isCorrect).length
    const accuracy = answers.length > 0 ? (correctCount / answers.length) * 100 : 0
    const avgTimeMs = answers.length > 0 
      ? answers.reduce((acc, a) => acc + a.timeMs, 0) / answers.length 
      : 0
    
    const difficultyBreakdown = {
      easy: {
        correct: answers.filter((a, i) => questions[i]?.difficulty === 'easy' && a.isCorrect).length,
        total: answers.filter((_, i) => questions[i]?.difficulty === 'easy').length,
      },
      medium: {
        correct: answers.filter((a, i) => questions[i]?.difficulty === 'medium' && a.isCorrect).length,
        total: answers.filter((_, i) => questions[i]?.difficulty === 'medium').length,
      },
      hard: {
        correct: answers.filter((a, i) => questions[i]?.difficulty === 'hard' && a.isCorrect).length,
        total: answers.filter((_, i) => questions[i]?.difficulty === 'hard').length,
      },
    }
    
    const gameResult: GameResult = {
      totalQuestions: answers.length,
      correctCount,
      accuracy: Math.round(accuracy),
      avgTimeMs: Math.round(avgTimeMs),
      skillBadge: getSkillBadge(accuracy),
      challengeCorrect,
      difficultyBreakdown,
    }
    
    setResult(gameResult)
    setPhase('results')
  }, [answers, questions])

  const resetGame = () => {
    setPhase('menu')
    setQuestions([])
    setCurrentIndex(0)
    setAnswers([])
    setIsAnswered(false)
    setSelectedAnswer(null)
    setResult(null)
    setChallengeQuestion(null)
    setChallengeAnswer(null)
  }

  return (
    <div className={`min-h-screen py-8 ${isClassroomMode ? 'bg-indigo-900' : 'bg-gradient-to-b from-indigo-100 to-purple-50'}`}>
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${isClassroomMode ? 'max-w-6xl' : 'max-w-4xl'}`}>
        
        <Link href="/" className={`inline-flex items-center gap-2 mb-6 ${isClassroomMode ? 'text-indigo-200 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
          <ArrowLeft className="w-5 h-5" strokeWidth={1.75} />
          Басты бетке қайту
        </Link>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`rounded-2xl bg-indigo-600 flex items-center justify-center ${isClassroomMode ? 'w-24 h-24' : 'w-16 h-16'}`}>
              <Scale className={`text-white ${isClassroomMode ? 'w-12 h-12' : 'w-8 h-8'}`} strokeWidth={1.75} />
            </div>
          </div>
          <h1 className={`font-bold mb-2 ${isClassroomMode ? 'text-5xl text-white' : 'text-4xl text-slate-900'}`}>
            Дұрыс/Бұрыс тез шешім
          </h1>
          <p className={isClassroomMode ? 'text-xl text-indigo-200' : 'text-slate-600'}>
            Логикалық шапшаңдық ойыны
          </p>
        </div>

        {/* Menu Phase */}
        {phase === 'menu' && (
          <div className={`rounded-2xl shadow-xl p-8 ${isClassroomMode ? 'bg-indigo-800 border-2 border-indigo-500' : 'bg-white border border-slate-200'}`}>
            
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
                        ? 'bg-indigo-700 text-indigo-200 hover:bg-indigo-600'
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
                        ? 'bg-indigo-700 text-indigo-200 hover:bg-indigo-600'
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
              className="w-full py-5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-2xl rounded-xl hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-3"
            >
              <Scale className="w-7 h-7" strokeWidth={1.75} />
              Шешім қабылда!
            </button>
          </div>
        )}

        {/* Game Phase */}
        {(phase === 'game' || phase === 'challenge') && (
          <div className={`rounded-2xl shadow-xl p-8 ${isClassroomMode ? 'bg-indigo-800 border-2 border-indigo-500' : 'bg-white border border-slate-200'}`}>
            
            {/* Progress & Timer */}
            <div className="flex items-center justify-between mb-6">
              <div className={`text-lg font-bold ${isClassroomMode ? 'text-white' : 'text-slate-700'}`}>
                {phase === 'challenge' ? (
                  <span className="text-yellow-500">🏆 ЧЕЛЛЕНДЖ!</span>
                ) : (
                  <span>Сұрақ {currentIndex + 1} / {questions.length}</span>
                )}
              </div>
              
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-lg ${
                timeLeft <= 3 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : isClassroomMode 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-slate-100 text-slate-700'
              }`}>
                ⏱️ {timeLeft}с
              </div>
            </div>

            {/* Progress Bar */}
            {phase === 'game' && (
              <div className="w-full h-3 bg-slate-200 rounded-full mb-6 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            )}

            {/* Current Difficulty Badge */}
            {phase === 'game' && currentQuestion && (
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
              <p className={`font-bold leading-relaxed ${isClassroomMode ? 'text-4xl text-white' : 'text-3xl text-slate-900'}`}>
                {phase === 'challenge' ? challengeQuestion?.statement : currentQuestion?.statement}
              </p>
            </div>

            {/* Answer Buttons */}
            {!isAnswered && (
              <div className="grid grid-cols-2 gap-6">
                <button
                  onClick={() => handleAnswer(true)}
                  className={`p-8 rounded-xl font-bold transition-all ${isClassroomMode ? 'text-3xl' : 'text-2xl'} bg-green-500 text-white hover:bg-green-400 hover:scale-105 shadow-lg`}
                >
                  ✓ Дұрыс
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  className={`p-8 rounded-xl font-bold transition-all ${isClassroomMode ? 'text-3xl' : 'text-2xl'} bg-red-500 text-white hover:bg-red-400 hover:scale-105 shadow-lg`}
                >
                  ✗ Бұрыс
                </button>
              </div>
            )}

            {/* Feedback */}
            {isAnswered && (
              <div className={`p-6 rounded-xl text-center ${
                selectedAnswer === (phase === 'challenge' ? challengeQuestion?.isTrue : currentQuestion?.isTrue)
                  ? 'bg-green-100'
                  : 'bg-red-100'
              }`}>
                <p className={`text-3xl font-bold mb-2 ${
                  selectedAnswer === (phase === 'challenge' ? challengeQuestion?.isTrue : currentQuestion?.isTrue)
                    ? 'text-green-700'
                    : 'text-red-700'
                }`}>
                  {selectedAnswer === (phase === 'challenge' ? challengeQuestion?.isTrue : currentQuestion?.isTrue) ? '✓ Дұрыс!' : '✗ Қате!'}
                </p>
                <p className={`${
                  selectedAnswer === (phase === 'challenge' ? challengeQuestion?.isTrue : currentQuestion?.isTrue)
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {phase === 'challenge' ? challengeQuestion?.explanation : currentQuestion?.explanation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Results Phase */}
        {phase === 'results' && result && (
          <div className={`rounded-2xl shadow-xl p-8 ${isClassroomMode ? 'bg-indigo-800 border-2 border-indigo-500' : 'bg-white border border-slate-200'}`}>
            
            {/* Main Badge */}
            <div className="text-center mb-8">
              <div className={`text-8xl mb-4 ${isClassroomMode ? 'text-9xl' : ''}`}>
                {SKILL_BADGES[result.skillBadge].emoji}
              </div>
              <h2 className={`font-bold mb-2 ${isClassroomMode ? 'text-4xl text-white' : 'text-3xl text-slate-900'}`}>
                {SKILL_BADGES[result.skillBadge].label}
              </h2>
              <p className={`text-lg ${isClassroomMode ? 'text-indigo-200' : 'text-slate-600'}`}>
                {result.accuracy >= 80 ? 'Жылдам ойлау! 🧠' : result.accuracy >= 60 ? 'Жақсы жұмыс! 👏' : 'Жаттығуды жалғастыр! 💪'}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className={`p-6 rounded-xl text-center ${isClassroomMode ? 'bg-indigo-700' : 'bg-slate-50'}`}>
                <div className={`text-4xl font-bold ${isClassroomMode ? 'text-white' : 'text-indigo-600'}`}>
                  {result.accuracy}%
                </div>
                <div className={isClassroomMode ? 'text-indigo-200' : 'text-slate-600'}>Дәлдік</div>
              </div>
              <div className={`p-6 rounded-xl text-center ${isClassroomMode ? 'bg-indigo-700' : 'bg-slate-50'}`}>
                <div className={`text-4xl font-bold ${isClassroomMode ? 'text-white' : 'text-blue-600'}`}>
                  {result.correctCount}/{result.totalQuestions}
                </div>
                <div className={isClassroomMode ? 'text-indigo-200' : 'text-slate-600'}>Дұрыс</div>
              </div>
              <div className={`p-6 rounded-xl text-center ${isClassroomMode ? 'bg-indigo-700' : 'bg-slate-50'}`}>
                <div className={`text-4xl font-bold ${isClassroomMode ? 'text-white' : 'text-green-600'}`}>
                  {(result.avgTimeMs / 1000).toFixed(1)}с
                </div>
                <div className={isClassroomMode ? 'text-indigo-200' : 'text-slate-600'}>Орташа уақыт</div>
              </div>
              <div className={`p-6 rounded-xl text-center ${isClassroomMode ? 'bg-indigo-700' : 'bg-slate-50'}`}>
                <div className={`text-4xl ${isClassroomMode ? 'text-white' : 'text-slate-700'}`}>
                  {result.avgTimeMs < 3000 ? '🚀 Жылдам' : result.avgTimeMs < 5000 ? '⚡ Қалыпты' : '🐢 Баяу'}
                </div>
                <div className={isClassroomMode ? 'text-indigo-200' : 'text-slate-600'}>Жылдамдық</div>
              </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className={`p-6 rounded-xl mb-8 ${isClassroomMode ? 'bg-indigo-700' : 'bg-slate-50'}`}>
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
                    <div className={isClassroomMode ? 'text-indigo-200' : 'text-slate-600'}>
                      {DIFFICULTY_CONFIG[level].label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenge Result */}
            <div className={`p-6 rounded-xl mb-8 ${result.challengeCorrect ? 'bg-yellow-100' : 'bg-orange-100'}`}>
              <div className="text-center">
                <span className="text-4xl">{result.challengeCorrect ? '🏆' : '🎯'}</span>
                <p className={`font-bold mt-2 ${result.challengeCorrect ? 'text-yellow-700' : 'text-orange-700'}`}>
                  Челлендж: {result.challengeCorrect ? 'Жеңіс! 🎉' : 'Келесі жолы!'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={startGame}
                className="py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-xl rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" strokeWidth={1.75} />
                Қайта ойнау
              </button>
              <button
                onClick={resetGame}
                className={`py-4 font-bold text-xl rounded-xl transition-all flex items-center justify-center gap-2 ${
                  isClassroomMode 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500' 
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
