'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Zap, ArrowLeft, Monitor, RotateCcw, Settings } from 'lucide-react'
import {
  DifficultyLevel,
  DIFFICULTY_CONFIG,
  SKILL_BADGES,
  getSkillBadge,
  getSpeedLevel,
} from '@/lib/classroomGames/types'

type Phase = 'menu' | 'game' | 'challenge' | 'results'

interface ReactionRound {
  color: string
  expectedAction: string
  response: string | null
  timeMs: number
  isCorrect: boolean
}

interface GameResult {
  totalRounds: number
  correctCount: number
  accuracy: number
  avgReactionTime: number
  fastestReaction: number
  slowestReaction: number
  skillBadge: 'high' | 'good' | 'practice'
  challengeCorrect: boolean
}

const COLORS = [
  { name: 'Қызыл', class: 'bg-red-500', emoji: '🔴' },
  { name: 'Сары', class: 'bg-yellow-400', emoji: '🟡' },
  { name: 'Жасыл', class: 'bg-green-500', emoji: '🟢' },
  { name: 'Көк', class: 'bg-blue-500', emoji: '🔵' },
  { name: 'Қызғылт', class: 'bg-pink-500', emoji: '🩷' },
]

const RULES = {
  easy: [
    { color: 'Қызыл', action: 'Тоқта!' },
    { color: 'Жасыл', action: 'Жүр!' },
    { color: 'Сары', action: 'Күте тұр!' },
  ],
  medium: [
    { color: 'Қызыл', action: 'Секір!' },
    { color: 'Жасыл', action: 'Отыр!' },
    { color: 'Сары', action: 'Тұр!' },
    { color: 'Көк', action: 'Қол соқ!' },
  ],
  hard: [
    { color: 'Қызыл', action: 'Оңға!' },
    { color: 'Жасыл', action: 'Солға!' },
    { color: 'Сары', action: 'Алға!' },
    { color: 'Көк', action: 'Артқа!' },
    { color: 'Қызғылт', action: 'Айнал!' },
  ],
}

export default function ReactionLightPage() {
  const [phase, setPhase] = useState<Phase>('menu')
  const [grade, setGrade] = useState<number>(2)
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium')
  const [isClassroomMode, setIsClassroomMode] = useState(false)
  
  const [rounds, setRounds] = useState<ReactionRound[]>([])
  const [currentRound, setCurrentRound] = useState(0)
  const [totalRounds] = useState(10)
  const [currentColor, setCurrentColor] = useState<string>('')
  const [showColor, setShowColor] = useState(false)
  const [roundStartTime, setRoundStartTime] = useState(0)
  const [result, setResult] = useState<GameResult | null>(null)
  const [waitingForClick, setWaitingForClick] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [challengeColor, setChallengeColor] = useState<string>('')
  const [isChallenge, setIsChallenge] = useState(false)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const rules = RULES[difficulty]

  const startGame = useCallback(() => {
    setRounds([])
    setCurrentRound(0)
    setResult(null)
    setShowRules(true)
    setPhase('game')
    
    setTimeout(() => {
      setShowRules(false)
      nextRound()
    }, 3000)
  }, [])

  const nextRound = useCallback(() => {
    if (currentRound >= totalRounds) {
      startChallenge()
      return
    }
    
    const delay = Math.random() * 2000 + 1000
    setShowColor(false)
    setWaitingForClick(false)
    
    timerRef.current = setTimeout(() => {
      const randomRule = rules[Math.floor(Math.random() * rules.length)]
      setCurrentColor(randomRule.color)
      setShowColor(true)
      setRoundStartTime(Date.now())
      setWaitingForClick(true)
    }, delay)
  }, [currentRound, totalRounds, rules])

  const startChallenge = () => {
    setIsChallenge(true)
    setShowColor(false)
    setPhase('challenge')
    
    const colors = rules.map(r => r.color)
    const challengeSeq = colors.slice(0, 3).join(' → ')
    setChallengeColor(challengeSeq)
  }

  const handleResponse = useCallback((action: string) => {
    if (!waitingForClick) return
    
    const timeMs = Date.now() - roundStartTime
    const expectedAction = rules.find(r => r.color === currentColor)?.action || ''
    const isCorrect = action === expectedAction
    
    const round: ReactionRound = {
      color: currentColor,
      expectedAction,
      response: action,
      timeMs,
      isCorrect,
    }
    
    setRounds(prev => [...prev, round])
    setCurrentRound(prev => prev + 1)
    setWaitingForClick(false)
    setShowColor(false)
    
    setTimeout(() => {
      if (currentRound + 1 >= totalRounds) {
        startChallenge()
      } else {
        nextRound()
      }
    }, 500)
  }, [waitingForClick, roundStartTime, currentColor, rules, currentRound, totalRounds, nextRound])

  const handleChallengeAnswer = (answer: string) => {
    const expectedSequence = rules.slice(0, 3).map(r => r.action).join(' → ')
    const isCorrect = answer === expectedSequence
    finishGame(isCorrect)
  }

  const finishGame = (challengeCorrect: boolean) => {
    const correctCount = rounds.filter(r => r.isCorrect).length
    const accuracy = (correctCount / rounds.length) * 100
    const times = rounds.map(r => r.timeMs)
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length
    
    const gameResult: GameResult = {
      totalRounds: rounds.length,
      correctCount,
      accuracy: Math.round(accuracy),
      avgReactionTime: Math.round(avgTime),
      fastestReaction: Math.min(...times),
      slowestReaction: Math.max(...times),
      skillBadge: getSkillBadge(accuracy),
      challengeCorrect,
    }
    
    setResult(gameResult)
    setPhase('results')
  }

  const resetGame = () => {
    setPhase('menu')
    setRounds([])
    setCurrentRound(0)
    setCurrentColor('')
    setShowColor(false)
    setResult(null)
    setIsChallenge(false)
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const getColorClass = (colorName: string) => {
    return COLORS.find(c => c.name === colorName)?.class || 'bg-slate-400'
  }

  return (
    <div className={`min-h-screen py-8 ${isClassroomMode ? 'bg-lime-900' : 'bg-gradient-to-b from-lime-100 to-green-50'}`}>
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${isClassroomMode ? 'max-w-6xl' : 'max-w-4xl'}`}>
        
        <Link href="/" className={`inline-flex items-center gap-2 mb-6 ${isClassroomMode ? 'text-lime-200 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
          <ArrowLeft className="w-5 h-5" strokeWidth={1.75} />
          Басты бетке қайту
        </Link>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`rounded-2xl bg-lime-500 flex items-center justify-center ${isClassroomMode ? 'w-24 h-24' : 'w-16 h-16'}`}>
              <Zap className={`text-white ${isClassroomMode ? 'w-12 h-12' : 'w-8 h-8'}`} strokeWidth={1.75} />
            </div>
          </div>
          <h1 className={`font-bold mb-2 ${isClassroomMode ? 'text-5xl text-white' : 'text-4xl text-slate-900'}`}>
            Реакция &quot;Бағдаршам&quot;
          </h1>
          <p className={isClassroomMode ? 'text-xl text-lime-200' : 'text-slate-600'}>
            Жылдам реакция ойыны
          </p>
        </div>

        {/* Menu Phase */}
        {phase === 'menu' && (
          <div className={`rounded-2xl shadow-xl p-8 ${isClassroomMode ? 'bg-lime-800 border-2 border-lime-500' : 'bg-white border border-slate-200'}`}>
            
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
                        ? 'bg-lime-700 text-lime-200 hover:bg-lime-600'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {DIFFICULTY_CONFIG[level].emoji} {DIFFICULTY_CONFIG[level].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rules Preview */}
            <div className={`mb-6 p-4 rounded-xl ${isClassroomMode ? 'bg-lime-700' : 'bg-slate-50'}`}>
              <h3 className={`font-bold mb-3 ${isClassroomMode ? 'text-white' : 'text-slate-700'}`}>
                📋 Ережелер:
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {RULES[difficulty].map((rule, idx) => (
                  <div key={idx} className={`flex items-center gap-2 p-2 rounded-lg ${isClassroomMode ? 'bg-lime-600' : 'bg-white'}`}>
                    <span className={`w-6 h-6 rounded-full ${getColorClass(rule.color)}`}></span>
                    <span className={isClassroomMode ? 'text-white' : 'text-slate-700'}>→ {rule.action}</span>
                  </div>
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
                        ? 'bg-lime-500 text-white ring-4 ring-lime-300'
                        : isClassroomMode
                        ? 'bg-lime-700 text-lime-200 hover:bg-lime-600'
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
              className="w-full py-5 bg-gradient-to-r from-lime-500 to-green-500 text-white font-bold text-2xl rounded-xl hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-3"
            >
              <Zap className="w-7 h-7" strokeWidth={1.75} />
              Бастау!
            </button>
          </div>
        )}

        {/* Game Phase - Rules Display */}
        {phase === 'game' && showRules && (
          <div className={`rounded-2xl shadow-xl p-8 text-center ${isClassroomMode ? 'bg-lime-800 border-2 border-lime-500' : 'bg-white border border-slate-200'}`}>
            <h2 className={`text-3xl font-bold mb-6 ${isClassroomMode ? 'text-white' : 'text-slate-900'}`}>
              📋 Ережелерді есте сақта!
            </h2>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              {rules.map((rule, idx) => (
                <div key={idx} className={`flex items-center justify-center gap-3 p-4 rounded-xl ${isClassroomMode ? 'bg-lime-700' : 'bg-slate-50'}`}>
                  <span className={`w-10 h-10 rounded-full ${getColorClass(rule.color)}`}></span>
                  <span className={`text-xl font-bold ${isClassroomMode ? 'text-white' : 'text-slate-700'}`}>→ {rule.action}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game Phase - Playing */}
        {phase === 'game' && !showRules && (
          <div className={`rounded-2xl shadow-xl p-8 ${isClassroomMode ? 'bg-lime-800 border-2 border-lime-500' : 'bg-white border border-slate-200'}`}>
            
            {/* Progress */}
            <div className="flex items-center justify-between mb-6">
              <div className={`text-lg font-bold ${isClassroomMode ? 'text-white' : 'text-slate-700'}`}>
                Раунд {currentRound + 1} / {totalRounds}
              </div>
              <div className={`px-4 py-2 rounded-full ${isClassroomMode ? 'bg-lime-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                ✅ {rounds.filter(r => r.isCorrect).length}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-200 rounded-full mb-8 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-lime-500 to-green-500 transition-all duration-300"
                style={{ width: `${((currentRound) / totalRounds) * 100}%` }}
              />
            </div>

            {/* Color Display */}
            <div className={`flex items-center justify-center mb-8 ${isClassroomMode ? 'h-64' : 'h-48'}`}>
              {showColor ? (
                <div className={`${isClassroomMode ? 'w-48 h-48' : 'w-36 h-36'} rounded-full ${getColorClass(currentColor)} flex items-center justify-center shadow-2xl animate-pulse`}>
                  <span className={`font-bold text-white ${isClassroomMode ? 'text-3xl' : 'text-2xl'}`}>{currentColor}</span>
                </div>
              ) : (
                <div className={`${isClassroomMode ? 'w-48 h-48' : 'w-36 h-36'} rounded-full bg-slate-300 flex items-center justify-center`}>
                  <span className={`${isClassroomMode ? 'text-4xl' : 'text-3xl'}`}>⏳</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              {rules.map((rule, idx) => (
                <button
                  key={idx}
                  onClick={() => handleResponse(rule.action)}
                  disabled={!waitingForClick}
                  className={`p-6 rounded-xl font-bold transition-all ${isClassroomMode ? 'text-2xl' : 'text-xl'} ${
                    waitingForClick
                      ? isClassroomMode
                        ? 'bg-lime-600 text-white hover:bg-lime-500 hover:scale-105'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200 hover:scale-105'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {rule.action}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Challenge Phase */}
        {phase === 'challenge' && (
          <div className={`rounded-2xl shadow-xl p-8 ${isClassroomMode ? 'bg-lime-800 border-2 border-lime-500' : 'bg-white border border-slate-200'}`}>
            <div className="text-center mb-8">
              <span className="text-6xl">🏆</span>
              <h2 className={`text-3xl font-bold mt-4 ${isClassroomMode ? 'text-white' : 'text-slate-900'}`}>
                ЧЕЛЛЕНДЖ!
              </h2>
              <p className={`mt-2 ${isClassroomMode ? 'text-lime-200' : 'text-slate-600'}`}>
                Дұрыс ретті таңда:
              </p>
              <p className={`mt-4 text-2xl font-bold ${isClassroomMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                {challengeColor}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
              {[
                rules.slice(0, 3).map(r => r.action).join(' → '),
                rules.slice(0, 3).reverse().map(r => r.action).join(' → '),
                [...rules.slice(0, 3)].sort(() => Math.random() - 0.5).map(r => r.action).join(' → '),
              ].map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChallengeAnswer(option)}
                  className={`p-4 rounded-xl font-bold text-lg transition-all ${
                    isClassroomMode
                      ? 'bg-lime-600 text-white hover:bg-lime-500'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Phase */}
        {phase === 'results' && result && (
          <div className={`rounded-2xl shadow-xl p-8 ${isClassroomMode ? 'bg-lime-800 border-2 border-lime-500' : 'bg-white border border-slate-200'}`}>
            
            {/* Main Badge */}
            <div className="text-center mb-8">
              <div className={`text-8xl mb-4 ${isClassroomMode ? 'text-9xl' : ''}`}>
                {SKILL_BADGES[result.skillBadge].emoji}
              </div>
              <h2 className={`font-bold mb-2 ${isClassroomMode ? 'text-4xl text-white' : 'text-3xl text-slate-900'}`}>
                {SKILL_BADGES[result.skillBadge].label}
              </h2>
              <p className={`text-lg ${isClassroomMode ? 'text-lime-200' : 'text-slate-600'}`}>
                {result.accuracy >= 80 ? 'Жылдам реакция! ⚡' : result.accuracy >= 60 ? 'Жақсы жұмыс! 👏' : 'Жаттығуды жалғастыр! 💪'}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className={`p-6 rounded-xl text-center ${isClassroomMode ? 'bg-lime-700' : 'bg-slate-50'}`}>
                <div className={`text-4xl font-bold ${isClassroomMode ? 'text-white' : 'text-lime-600'}`}>
                  {result.accuracy}%
                </div>
                <div className={isClassroomMode ? 'text-lime-200' : 'text-slate-600'}>Дәлдік</div>
              </div>
              <div className={`p-6 rounded-xl text-center ${isClassroomMode ? 'bg-lime-700' : 'bg-slate-50'}`}>
                <div className={`text-4xl font-bold ${isClassroomMode ? 'text-white' : 'text-blue-600'}`}>
                  {result.correctCount}/{result.totalRounds}
                </div>
                <div className={isClassroomMode ? 'text-lime-200' : 'text-slate-600'}>Дұрыс</div>
              </div>
              <div className={`p-6 rounded-xl text-center ${isClassroomMode ? 'bg-lime-700' : 'bg-slate-50'}`}>
                <div className={`text-4xl font-bold ${isClassroomMode ? 'text-white' : 'text-green-600'}`}>
                  {result.avgReactionTime}мс
                </div>
                <div className={isClassroomMode ? 'text-lime-200' : 'text-slate-600'}>Орташа реакция</div>
              </div>
              <div className={`p-6 rounded-xl text-center ${isClassroomMode ? 'bg-lime-700' : 'bg-slate-50'}`}>
                <div className={`text-4xl font-bold ${isClassroomMode ? 'text-white' : 'text-orange-600'}`}>
                  {result.fastestReaction}мс
                </div>
                <div className={isClassroomMode ? 'text-lime-200' : 'text-slate-600'}>Ең жылдам</div>
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
                className="py-4 bg-gradient-to-r from-lime-500 to-green-500 text-white font-bold text-xl rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" strokeWidth={1.75} />
                Қайта ойнау
              </button>
              <button
                onClick={resetGame}
                className={`py-4 font-bold text-xl rounded-xl transition-all flex items-center justify-center gap-2 ${
                  isClassroomMode 
                    ? 'bg-lime-600 text-white hover:bg-lime-500' 
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
