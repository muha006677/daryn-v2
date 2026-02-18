'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Globe, ArrowLeft, Monitor, RotateCcw, Settings } from 'lucide-react'
import {
  DifficultyLevel,
  DIFFICULTY_CONFIG,
  SKILL_BADGES,
  getSkillBadge,
} from '@/lib/classroomGames/types'

type Phase = 'menu' | 'game' | 'challenge' | 'results'

interface WorldQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  difficulty: DifficultyLevel
  category: string
}

interface WorldAnswer {
  questionId: number
  selectedIndex: number | null
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
  categoryBreakdown: Record<string, { correct: number; total: number }>
}

const QUESTIONS: WorldQuestion[] = [
  // Easy - Nature
  { question: 'Күн қандай бағытта батады?', options: ['Шығыста', 'Батыста', 'Оңтүстікте', 'Солтүстікте'], correctIndex: 1, explanation: 'Күн батыста батады', difficulty: 'easy', category: 'Табиғат' },
  { question: 'Адамның қанша тісі бар?', options: ['20', '28', '32', '36'], correctIndex: 2, explanation: 'Ересек адамда 32 тіс', difficulty: 'easy', category: 'Биология' },
  { question: 'Су қандай түсте?', options: ['Көк', 'Жасыл', 'Түссіз', 'Ақ'], correctIndex: 2, explanation: 'Таза су түссіз', difficulty: 'easy', category: 'Табиғат' },
  { question: 'Жылда қанша ай бар?', options: ['10', '11', '12', '13'], correctIndex: 2, explanation: 'Жылда 12 ай', difficulty: 'easy', category: 'Уақыт' },
  { question: 'Құстар қалай ұшады?', options: ['Қанаттарымен', 'Құйрықтарымен', 'Аяқтарымен', 'Тұмсықтарымен'], correctIndex: 0, explanation: 'Құстар қанаттарын қолданады', difficulty: 'easy', category: 'Биология' },
  
  // Medium - Geography
  { question: 'Қазақстанның астанасы қала?', options: ['Алматы', 'Астана', 'Шымкент', 'Ақтөбе'], correctIndex: 1, explanation: 'Астана — Қазақстан астанасы', difficulty: 'medium', category: 'География' },
  { question: 'Жердің ең үлкен мұхиты?', options: ['Атлант', 'Үнді', 'Тынық', 'Солтүстік Мұзды'], correctIndex: 2, explanation: 'Тынық мұхит ең үлкен', difficulty: 'medium', category: 'География' },
  { question: 'Күн жүйесінде неше планета бар?', options: ['7', '8', '9', '10'], correctIndex: 1, explanation: 'Күн жүйесінде 8 планета', difficulty: 'medium', category: 'Ғарыш' },
  { question: 'Қай жануар ең жылдам?', options: ['Арыстан', 'Жүйрік', 'Қаршыға', 'Ит'], correctIndex: 2, explanation: 'Қаршыға ең жылдам құс', difficulty: 'medium', category: 'Биология' },
  { question: 'Жердің ең ұзын өзені?', options: ['Амазонка', 'Ніл', 'Янцзы', 'Міссісіпі'], correctIndex: 1, explanation: 'Ніл өзені — ең ұзын', difficulty: 'medium', category: 'География' },
  
  // Hard - Science
  { question: 'Жарық жылдамдығы қанша?', options: ['100 000 км/с', '200 000 км/с', '300 000 км/с', '400 000 км/с'], correctIndex: 2, explanation: 'c ≈ 300 000 км/с', difficulty: 'hard', category: 'Физика' },
  { question: 'Су қандай температурада қайнайды?', options: ['90°C', '100°C', '110°C', '120°C'], correctIndex: 1, explanation: 'Су 100°C-да қайнайды', difficulty: 'hard', category: 'Физика' },
  { question: 'ДНҚ қандай пішінде?', options: ['Түзу', 'Шеңбер', 'Қос спираль', 'Үшбұрыш'], correctIndex: 2, explanation: 'ДНҚ қос спираль пішінді', difficulty: 'hard', category: 'Биология' },
  { question: 'Жердің ядросы неден тұрады?', options: ['Алтын', 'Темір', 'Мыс', 'Күміс'], correctIndex: 1, explanation: 'Жер ядросы негізінен темірден', difficulty: 'hard', category: 'Геология' },
  { question: 'Атмосферада ең көп қай газ?', options: ['Оттегі', 'Азот', 'Көмірқышқыл газы', 'Сутегі'], correctIndex: 1, explanation: 'Атмосферада 78% азот', difficulty: 'hard', category: 'Химия' },
]

const CHALLENGE_QUESTIONS: WorldQuestion[] = [
  { question: '🏆 Жердің жасы шамамен қанша?', options: ['4.5 миллиард жыл', '1 миллиард жыл', '100 миллион жыл', '10 миллиард жыл'], correctIndex: 0, explanation: 'Жер 4.5 млрд жаста', difficulty: 'hard', category: 'Ғылым' },
  { question: '🏆 Қай елде ең көп халық?', options: ['Үндістан', 'АҚШ', 'Қытай', 'Индонезия'], correctIndex: 2, explanation: '2024 ж. Қытай 1.4 млрд', difficulty: 'hard', category: 'География' },
  { question: '🏆 Ең кішкентай планета?', options: ['Марс', 'Меркурий', 'Плутон', 'Венера'], correctIndex: 1, explanation: 'Меркурий ең кіші планета', difficulty: 'hard', category: 'Ғарыш' },
]

export default function WorldQuickPage() {
  const [phase, setPhase] = useState<Phase>('menu')
  const [grade, setGrade] = useState<number>(2)
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium')
  const [isClassroomMode, setIsClassroomMode] = useState(false)
  
  const [questions, setQuestions] = useState<WorldQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<WorldAnswer[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(0)
  const [isAnswered, setIsAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [result, setResult] = useState<GameResult | null>(null)
  const [challengeQuestion, setChallengeQuestion] = useState<WorldQuestion | null>(null)
  const [challengeAnswer, setChallengeAnswer] = useState<number | null>(null)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const currentQuestion = questions[currentIndex]

  const startGame = useCallback(() => {
    let gameQuestions: WorldQuestion[]
    
    if (difficulty === 'medium') {
      const easy = QUESTIONS.filter(q => q.difficulty === 'easy').slice(0, 3)
      const medium = QUESTIONS.filter(q => q.difficulty === 'medium').slice(0, 4)
      const hard = QUESTIONS.filter(q => q.difficulty === 'hard').slice(0, 3)
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
    setTimeLeft(difficulty === 'easy' ? 20 : difficulty === 'medium' ? 15 : 12)
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
    
    const timeMs = Date.now() - questionStartTime
    const answer: WorldAnswer = {
      questionId: currentIndex,
      selectedIndex: null,
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
  }, [phase, questionStartTime, isAnswered, currentIndex])

  const handleAnswer = useCallback((optionIndex: number) => {
    if (isAnswered) return
    
    const question = phase === 'challenge' ? challengeQuestion : currentQuestion
    if (!question) return
    
    setSelectedAnswer(optionIndex)
    setIsAnswered(true)
    
    const timeMs = Date.now() - questionStartTime
    const isCorrect = optionIndex === question.correctIndex
    
    if (phase === 'challenge') {
      setChallengeAnswer(optionIndex)
      setTimeout(() => finishGame(isCorrect), 2000)
    } else {
      const answer: WorldAnswer = {
        questionId: currentIndex,
        selectedIndex: optionIndex,
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
      setTimeLeft(difficulty === 'easy' ? 20 : difficulty === 'medium' ? 15 : 12)
    } else {
      const challenge = CHALLENGE_QUESTIONS[Math.floor(Math.random() * CHALLENGE_QUESTIONS.length)]
      setChallengeQuestion(challenge)
      setPhase('challenge')
      setSelectedAnswer(null)
      setIsAnswered(false)
      setQuestionStartTime(Date.now())
      setTimeLeft(20)
    }
  }, [currentIndex, questions, difficulty])

  const finishGame = useCallback((challengeCorrect: boolean) => {
    const correctCount = answers.filter(a => a.isCorrect).length
    const accuracy = answers.length > 0 ? (correctCount / answers.length) * 100 : 0
    const avgTimeMs = answers.length > 0 
      ? answers.reduce((acc, a) => acc + a.timeMs, 0) / answers.length 
      : 0
    
    const categoryBreakdown: Record<string, { correct: number; total: number }> = {}
    questions.forEach((q, i) => {
      if (!categoryBreakdown[q.category]) {
        categoryBreakdown[q.category] = { correct: 0, total: 0 }
      }
      categoryBreakdown[q.category].total++
      if (answers[i]?.isCorrect) {
        categoryBreakdown[q.category].correct++
      }
    })
    
    const gameResult: GameResult = {
      totalQuestions: answers.length,
      correctCount,
      accuracy: Math.round(accuracy),
      avgTimeMs: Math.round(avgTimeMs),
      skillBadge: getSkillBadge(accuracy),
      challengeCorrect,
      categoryBreakdown,
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
    <div className={`min-h-screen py-8 ${isClassroomMode ? 'bg-teal-900' : 'bg-gradient-to-b from-teal-100 to-cyan-50'}`}>
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${isClassroomMode ? 'max-w-6xl' : 'max-w-4xl'}`}>
        
        <Link href="/" className={`inline-flex items-center gap-2 mb-6 ${isClassroomMode ? 'text-teal-200 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
          <ArrowLeft className="w-5 h-5" strokeWidth={1.75} />
          Басты бетке қайту
        </Link>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`rounded-2xl bg-teal-500 flex items-center justify-center ${isClassroomMode ? 'w-24 h-24' : 'w-16 h-16'}`}>
              <Globe className={`text-white ${isClassroomMode ? 'w-12 h-12' : 'w-8 h-8'}`} strokeWidth={1.75} />
            </div>
          </div>
          <h1 className={`font-bold mb-2 ${isClassroomMode ? 'text-5xl text-white' : 'text-4xl text-slate-900'}`}>
            Дүниетану Q&A
          </h1>
          <p className={isClassroomMode ? 'text-xl text-teal-200' : 'text-slate-600'}>
            Білім байқауы ойыны
          </p>
        </div>

        {/* Menu Phase */}
        {phase === 'menu' && (
          <div className={`rounded-2xl shadow-xl p-8 ${isClassroomMode ? 'bg-teal-800 border-2 border-teal-500' : 'bg-white border border-slate-200'}`}>
            
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
                        ? 'bg-teal-700 text-teal-200 hover:bg-teal-600'
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
                        ? 'bg-cyan-500 text-white ring-4 ring-cyan-300'
                        : isClassroomMode
                        ? 'bg-teal-700 text-teal-200 hover:bg-teal-600'
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
              className="w-full py-5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-2xl rounded-xl hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-3"
            >
              <Globe className="w-7 h-7" strokeWidth={1.75} />
              Білім байқауын бастау!
            </button>
          </div>
        )}

        {/* Game Phase */}
        {(phase === 'game' || phase === 'challenge') && (
          <div className={`rounded-2xl shadow-xl p-8 ${isClassroomMode ? 'bg-teal-800 border-2 border-teal-500' : 'bg-white border border-slate-200'}`}>
            
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
                timeLeft <= 5 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : isClassroomMode 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-slate-100 text-slate-700'
              }`}>
                ⏱️ {timeLeft}с
              </div>
            </div>

            {/* Progress Bar */}
            {phase === 'game' && (
              <div className="w-full h-3 bg-slate-200 rounded-full mb-6 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            )}

            {/* Category Badge */}
            {phase === 'game' && currentQuestion && (
              <div className="flex justify-center gap-2 mb-4">
                <span className={`px-4 py-2 rounded-full font-bold ${isClassroomMode ? 'bg-teal-600 text-white' : 'bg-teal-100 text-teal-700'}`}>
                  📚 {currentQuestion.category}
                </span>
                <span className={`px-4 py-2 rounded-full text-white font-bold ${
                  currentQuestion.difficulty === 'easy' ? 'bg-green-500' :
                  currentQuestion.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  {DIFFICULTY_CONFIG[currentQuestion.difficulty].emoji}
                </span>
              </div>
            )}

            {/* Question */}
            <div className={`text-center mb-8 ${isClassroomMode ? 'py-8' : 'py-4'}`}>
              <p className={`font-bold leading-relaxed ${isClassroomMode ? 'text-4xl text-white' : 'text-2xl text-slate-900'}`}>
                {phase === 'challenge' ? challengeQuestion?.question : currentQuestion?.question}
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
              {(phase === 'challenge' ? challengeQuestion?.options : currentQuestion?.options)?.map((option, idx) => {
                const question = phase === 'challenge' ? challengeQuestion : currentQuestion
                const isCorrect = idx === question?.correctIndex
                const isSelected = selectedAnswer === idx
                
                let buttonClass = ''
                if (isAnswered) {
                  if (isCorrect) {
                    buttonClass = 'bg-green-500 text-white ring-4 ring-green-300'
                  } else if (isSelected) {
                    buttonClass = 'bg-red-500 text-white ring-4 ring-red-300'
                  } else {
                    buttonClass = isClassroomMode ? 'bg-teal-700 text-teal-300' : 'bg-slate-100 text-slate-400'
                  }
                } else {
                  buttonClass = isClassroomMode 
                    ? 'bg-teal-600 text-white hover:bg-teal-500 hover:scale-105' 
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200 hover:scale-105'
                }
                
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={isAnswered}
                    className={`p-5 rounded-xl font-bold transition-all ${isClassroomMode ? 'text-xl' : 'text-lg'} ${buttonClass}`}
                  >
                    {['A', 'B', 'C', 'D'][idx]}. {option}
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            {isAnswered && (
              <div className={`mt-6 p-4 rounded-xl ${isClassroomMode ? 'bg-teal-700 text-teal-200' : 'bg-teal-50 text-teal-700'}`}>
                <p className="font-bold">
                  💡 {phase === 'challenge' ? challengeQuestion?.explanation : currentQuestion?.explanation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Results Phase */}
        {phase === 'results' && result && (
          <div className={`rounded-2xl shadow-xl p-8 ${isClassroomMode ? 'bg-teal-800 border-2 border-teal-500' : 'bg-white border border-slate-200'}`}>
            
            {/* Main Badge */}
            <div className="text-center mb-8">
              <div className={`text-8xl mb-4 ${isClassroomMode ? 'text-9xl' : ''}`}>
                {SKILL_BADGES[result.skillBadge].emoji}
              </div>
              <h2 className={`font-bold mb-2 ${isClassroomMode ? 'text-4xl text-white' : 'text-3xl text-slate-900'}`}>
                {SKILL_BADGES[result.skillBadge].label}
              </h2>
              <p className={`text-lg ${isClassroomMode ? 'text-teal-200' : 'text-slate-600'}`}>
                {result.accuracy >= 80 ? 'Керемет білім! 🧠' : result.accuracy >= 60 ? 'Жақсы жұмыс! 👏' : 'Жаттығуды жалғастыр! 💪'}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className={`p-6 rounded-xl text-center ${isClassroomMode ? 'bg-teal-700' : 'bg-slate-50'}`}>
                <div className={`text-4xl font-bold ${isClassroomMode ? 'text-white' : 'text-teal-600'}`}>
                  {result.accuracy}%
                </div>
                <div className={isClassroomMode ? 'text-teal-200' : 'text-slate-600'}>Дәлдік</div>
              </div>
              <div className={`p-6 rounded-xl text-center ${isClassroomMode ? 'bg-teal-700' : 'bg-slate-50'}`}>
                <div className={`text-4xl font-bold ${isClassroomMode ? 'text-white' : 'text-blue-600'}`}>
                  {result.correctCount}/{result.totalQuestions}
                </div>
                <div className={isClassroomMode ? 'text-teal-200' : 'text-slate-600'}>Дұрыс</div>
              </div>
              <div className={`p-6 rounded-xl text-center ${isClassroomMode ? 'bg-teal-700' : 'bg-slate-50'}`}>
                <div className={`text-4xl font-bold ${isClassroomMode ? 'text-white' : 'text-green-600'}`}>
                  {(result.avgTimeMs / 1000).toFixed(1)}с
                </div>
                <div className={isClassroomMode ? 'text-teal-200' : 'text-slate-600'}>Орташа уақыт</div>
              </div>
              <div className={`p-6 rounded-xl text-center ${isClassroomMode ? 'bg-teal-700' : 'bg-slate-50'}`}>
                <div className={`text-4xl ${isClassroomMode ? 'text-white' : 'text-slate-700'}`}>
                  {result.avgTimeMs < 8000 ? '🚀 Жылдам' : result.avgTimeMs < 12000 ? '⚡ Қалыпты' : '🐢 Баяу'}
                </div>
                <div className={isClassroomMode ? 'text-teal-200' : 'text-slate-600'}>Жылдамдық</div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className={`p-6 rounded-xl mb-8 ${isClassroomMode ? 'bg-teal-700' : 'bg-slate-50'}`}>
              <h3 className={`font-bold mb-4 ${isClassroomMode ? 'text-white' : 'text-slate-900'}`}>
                📊 Санат бойынша нәтиже:
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(result.categoryBreakdown).map(([category, stats]) => (
                  <div key={category} className={`p-3 rounded-lg ${isClassroomMode ? 'bg-teal-600' : 'bg-white'}`}>
                    <div className={`text-sm ${isClassroomMode ? 'text-teal-200' : 'text-slate-600'}`}>{category}</div>
                    <div className={`text-xl font-bold ${isClassroomMode ? 'text-white' : 'text-teal-600'}`}>
                      {stats.correct}/{stats.total}
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
                  Челлендж: {result.challengeCorrect ? 'Жеңіс! 🌍' : 'Келесі жолы!'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={startGame}
                className="py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-xl rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" strokeWidth={1.75} />
                Қайта ойнау
              </button>
              <button
                onClick={resetGame}
                className={`py-4 font-bold text-xl rounded-xl transition-all flex items-center justify-center gap-2 ${
                  isClassroomMode 
                    ? 'bg-teal-600 text-white hover:bg-teal-500' 
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
