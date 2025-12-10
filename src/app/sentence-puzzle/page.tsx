'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getSentencePuzzleQuestions, type SentencePuzzleQuestion } from '@/lib/newGamesBanks'

type GameState = 'menu' | 'playing' | 'finished'

export default function SentencePuzzlePage() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [grade, setGrade] = useState<string>('2')
  const [domain, setDomain] = useState<'kaz_lang' | 'kaz_lit'>('kaz_lang')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [questions, setQuestions] = useState<SentencePuzzleQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedPieces, setSelectedPieces] = useState<string[]>([])
  const [availablePieces, setAvailablePieces] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]

  const startGame = async () => {
    setIsLoading(true)
    setError(null)
    setCurrentQuestionIndex(0)
    setScore(0)
    setShowAnswer(false)

    try {
      const localQuestions = getSentencePuzzleQuestions(parseInt(grade))
      if (localQuestions.length === 0) {
        setError('Сұрақтар әзірге қолжетімсіз')
      } else {
        setQuestions(localQuestions)
        // 初始化第一题的片段
        if (localQuestions.length > 0) {
          const shuffled = [...localQuestions[0].pieces].sort(() => Math.random() - 0.5)
          setAvailablePieces(shuffled)
          setSelectedPieces([])
        }
        setGameState('playing')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Қате орын алды')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePieceClick = (piece: string, fromSelected: boolean) => {
    if (showAnswer) return

    if (fromSelected) {
      // 从已选区域移回可用区域
      setSelectedPieces(prev => prev.filter(p => p !== piece))
      setAvailablePieces(prev => [...prev, piece])
    } else {
      // 从可用区域移到已选区域
      setAvailablePieces(prev => prev.filter(p => p !== piece))
      setSelectedPieces(prev => [...prev, piece])
    }
  }

  const checkAnswer = () => {
    if (!currentQuestion) return

    const selectedOrder = selectedPieces.map(p => {
      const index = currentQuestion.pieces.indexOf(p)
      return index.toString()
    }).join(',')

    const isCorrect = selectedOrder === currentQuestion.answer
    setShowAnswer(true)

    if (isCorrect) {
      setScore(prev => prev + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)
      const shuffled = [...questions[nextIndex].pieces].sort(() => Math.random() - 0.5)
      setAvailablePieces(shuffled)
      setSelectedPieces([])
      setShowAnswer(false)
    } else {
      setGameState('finished')
    }
  }

  const resetGame = () => {
    setGameState('menu')
    setQuestions([])
    setCurrentQuestionIndex(0)
    setScore(0)
    setSelectedPieces([])
    setAvailablePieces([])
    setShowAnswer(false)
  }

  const resetCurrent = () => {
    if (!currentQuestion) return
    const shuffled = [...currentQuestion.pieces].sort(() => Math.random() - 0.5)
    setAvailablePieces(shuffled)
    setSelectedPieces([])
    setShowAnswer(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Басты бетке қайту
        </Link>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🧩</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Сөйлем жұмбағы</h1>
          <p className="text-slate-600">Сөйлемді дұрыс ретпен құрастыру</p>
        </div>

        {gameState === 'menu' && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 max-w-md mx-auto">
            <div className="space-y-6">
              <div>
                <label className="block font-medium text-slate-700 mb-2">Сынып:</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  {['1', '2', '3', '4', '5', '6'].map(g => (
                    <option key={g} value={g}>{g}-сынып</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-2">Бағыт:</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value as 'kaz_lang' | 'kaz_lit')}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                >
                  <option value="kaz_lang">Қазақ тілі</option>
                  <option value="kaz_lit">Қазақ әдебиеті</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                  {error}
                </div>
              )}

              <button
                onClick={startGame}
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-lg rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {isLoading ? 'Жасалуда...' : 'Бастау'}
              </button>
            </div>
          </div>
        )}

        {gameState === 'playing' && currentQuestion && (
          <div className="space-y-6">
            {/* 统计 */}
            <div className="bg-white rounded-xl shadow-md border-2 border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700">
                  Сұрақ {currentQuestionIndex + 1} / {questions.length}
                </span>
                <span className="font-bold text-teal-600">Дұрыс: {score}</span>
              </div>
            </div>

            {/* 题目 */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 p-8">
              <p className="text-2xl text-slate-800 text-center mb-6">
                {currentQuestion.q}
              </p>

              {/* 已选片段区域 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 mb-2">Дұрыс ретпен қойыңыз:</label>
                <div className="min-h-[80px] bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-4 flex flex-wrap gap-2">
                  {selectedPieces.length === 0 ? (
                    <div className="w-full text-center text-slate-400 py-4">
                      Фрагменттерді осы жерге тартыңыз
                    </div>
                  ) : (
                    selectedPieces.map((piece, idx) => (
                      <button
                        key={`selected-${idx}`}
                        onClick={() => handlePieceClick(piece, true)}
                        className="px-4 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-all"
                      >
                        {piece}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* 可用片段区域 */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Фрагменттер:</label>
                <div className="flex flex-wrap gap-2">
                  {availablePieces.map((piece, idx) => (
                    <button
                      key={`available-${idx}`}
                      onClick={() => handlePieceClick(piece, false)}
                      className="px-4 py-2 bg-white border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:border-teal-500 hover:bg-teal-50 transition-all"
                    >
                      {piece}
                    </button>
                  ))}
                </div>
              </div>

              {/* 答案反馈 */}
              {showAnswer && (
                <div className={`mt-6 p-6 rounded-xl ${
                  selectedPieces.map(p => currentQuestion.pieces.indexOf(p).toString()).join(',') === currentQuestion.answer
                    ? 'bg-emerald-50 border-2 border-emerald-200'
                    : 'bg-red-50 border-2 border-red-200'
                }`}>
                  <p className={`text-xl font-bold mb-2 ${
                    selectedPieces.map(p => currentQuestion.pieces.indexOf(p).toString()).join(',') === currentQuestion.answer
                      ? 'text-emerald-700'
                      : 'text-red-700'
                  }`}>
                    {selectedPieces.map(p => currentQuestion.pieces.indexOf(p).toString()).join(',') === currentQuestion.answer
                      ? '✓ Дұрыс!'
                      : '✗ Қате!'}
                  </p>
                  <p className="text-slate-700 font-medium mb-2">Дұрыс сөйлем:</p>
                  <p className="text-lg text-slate-800">
                    {currentQuestion.pieces.map((_, idx) => {
                      const correctIndex = parseInt(currentQuestion.answer.split(',')[idx])
                      return currentQuestion.pieces[correctIndex]
                    }).join(' ')}
                  </p>
                  {currentQuestion.explanation && (
                    <p className="text-sm text-slate-600 mt-3 pt-3 border-t border-slate-200">
                      {currentQuestion.explanation}
                    </p>
                  )}
                </div>
              )}

              {/* 操作按钮 */}
              <div className="mt-6 flex gap-4">
                <button
                  onClick={resetCurrent}
                  disabled={showAnswer}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all disabled:opacity-50"
                >
                  Қалпына келтіру
                </button>
                {!showAnswer ? (
                  <button
                    onClick={checkAnswer}
                    disabled={selectedPieces.length !== currentQuestion.pieces.length}
                    className="flex-1 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Тексеру
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-xl hover:opacity-90 transition-all"
                  >
                    Келесі сұрақ →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-200 p-8 max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Ойын аяқталды!</h2>
            <div className="bg-teal-50 rounded-xl p-6 mb-8">
              <p className="text-lg font-medium text-slate-600 mb-2">Дұрыс жауап</p>
              <p className="text-5xl font-bold text-teal-600">{score} / {questions.length}</p>
            </div>
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-lg rounded-xl hover:opacity-90 transition-all"
            >
              Қайта бастау
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

