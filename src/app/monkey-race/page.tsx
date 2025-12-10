'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Question } from '@/app/api/generate-question/route'
import { getQuestions, getLocalQuestionsSync } from '@/lib/questionEngine'
import MonkeyDuelRace from '@/components/MonkeyDuelRace'

type GameState = 'menu' | 'playing' | 'finished'
type CurrentTeam = 'A' | 'B'

export default function MonkeyRacePage() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [grade, setGrade] = useState<string>('2')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fallbackUsed, setFallbackUsed] = useState(false)
  
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [currentTeam, setCurrentTeam] = useState<CurrentTeam>('A')
  
  // 计分：solvedCount 和 correctCount
  const [team1Solved, setTeam1Solved] = useState(0)
  const [team1Correct, setTeam1Correct] = useState(0)
  const [team2Solved, setTeam2Solved] = useState(0)
  const [team2Correct, setTeam2Correct] = useState(0)
  
  // 用于显示的总分（优先使用 correctCount，否则使用 solvedCount）
  const team1Score = team1Correct > 0 ? team1Correct : team1Solved
  const team2Score = team2Correct > 0 ? team2Correct : team2Solved
  
  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const currentQuestion = questions[currentQuestionIndex]

  const startGame = async () => {
    setIsLoading(true)
    setError(null)
    setShowAnswer(false)
    setCurrentQuestionIndex(0)
    setCurrentTeam('A')
    setTeam1Solved(0)
    setTeam1Correct(0)
    setTeam2Solved(0)
    setTeam2Correct(0)
    setSelectedAnswer(null)
    setFallbackUsed(false)

    try {
      const result = await getQuestions({
        domain: 'mixed',
        grade: parseInt(grade),
        count: 10,
        seed: `monkey-race-${Date.now()}`,
      })

      if (result.length === 0) {
        setError('Тапсырмалар табылмады. Қайта көріңіз.')
      } else {
        setQuestions(result)
        setGameState('playing')
        if (result.length < 10) {
          setFallbackUsed(true)
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Қате орын алды. Қайта көріңіз.'
      setError(errorMessage)
      try {
        const localQuestions = getLocalQuestionsSync({
          domain: 'mixed',
          grade: parseInt(grade),
          count: 10,
        })
        if (localQuestions.length > 0) {
          setQuestions(localQuestions)
          setGameState('playing')
          setFallbackUsed(true)
          setError('API қате, жергілікті банк қолданылды')
        }
      } catch (fallbackErr) {
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 检查答案是否正确
  const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
    // 简单匹配：去除空格和大小写
    const normalized = (str: string) => str.trim().toLowerCase()
    return normalized(userAnswer) === normalized(correctAnswer)
  }

  // 提交答案
  const submitAnswer = (answer: string) => {
    if (!currentQuestion) return
    
    setSelectedAnswer(answer)
    setShowAnswer(true)
    
    const isCorrect = checkAnswer(answer, currentQuestion.answer || '')
    
    // 根据当前队伍更新分数
    if (currentTeam === 'A') {
      setTeam1Solved(prev => prev + 1)
      if (isCorrect) {
        setTeam1Correct(prev => prev + 1)
      }
    } else {
      setTeam2Solved(prev => prev + 1)
      if (isCorrect) {
        setTeam2Correct(prev => prev + 1)
      }
    }
  }

  // 手动加分（保留原有功能）
  const addTeam1Point = () => {
    setTeam1Solved(prev => prev + 1)
    setTeam1Correct(prev => prev + 1)
  }

  const addTeam2Point = () => {
    setTeam2Solved(prev => prev + 1)
    setTeam2Correct(prev => prev + 1)
  }

  const addBothPoints = () => {
    setTeam1Solved(prev => prev + 1)
    setTeam1Correct(prev => prev + 1)
    setTeam2Solved(prev => prev + 1)
    setTeam2Correct(prev => prev + 1)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowAnswer(false)
      setSelectedAnswer(null)
    } else {
      setGameState('finished')
    }
  }

  const resetGame = () => {
    setGameState('menu')
    setQuestions([])
    setCurrentQuestionIndex(0)
    setCurrentTeam('A')
    setTeam1Solved(0)
    setTeam1Correct(0)
    setTeam2Solved(0)
    setTeam2Correct(0)
    setShowAnswer(false)
    setSelectedAnswer(null)
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Басты бетке қайту
        </Link>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🐵</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Екі маймылдың ағашқа жарысы</h1>
          <p className="text-slate-600">Екі команда сынасып, дұрыс жауап беру арқылы ағашқа көтеріледі</p>
        </div>

        {gameState === 'menu' && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <label className="font-medium text-slate-700">Сынып:</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-green-500 outline-none"
              >
                {['1', '2', '3', '4', '5', '6'].map(g => (
                  <option key={g} value={g}>{g}-сынып</option>
                ))}
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={startGame}
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {isLoading ? 'Жасалуда...' : 'Бастау'}
            </button>
          </div>
        )}

        {gameState === 'playing' && currentQuestion && (
          <div className="space-y-6">
            {/* 对战可视化 */}
            <MonkeyDuelRace
              teamAScore={team1Score}
              teamBScore={team2Score}
              targetLead={5}
            />

            {/* 队伍切换 */}
            <div className="bg-white rounded-xl shadow-md border-2 border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700">Қазіргі топ:</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentTeam('A')}
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${
                      currentTeam === 'A'
                        ? 'bg-green-500 text-white shadow-lg scale-105'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    1-топ
                  </button>
                  <button
                    onClick={() => setCurrentTeam('B')}
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${
                      currentTeam === 'B'
                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    2-топ
                  </button>
                </div>
              </div>
              <div className="mt-3 text-sm text-slate-500 text-center">
                {currentTeam === 'A' ? (
                  <span>1-топ жауап береді</span>
                ) : (
                  <span>2-топ жауап береді</span>
                )}
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between text-white">
                <span className="font-medium">Сұрақ {currentQuestionIndex + 1} / {questions.length}</span>
              </div>

              <div className="p-8">
                <p className="text-3xl text-slate-800 text-center mb-8 min-h-[120px] flex items-center justify-center leading-relaxed">
                  {currentQuestion.prompt || '—'}
                </p>

                {/* 如果是 MCQ，显示选项 */}
                {currentQuestion.options && currentQuestion.options.length > 0 ? (
                  <div className="space-y-3 mb-6">
                    {currentQuestion.options.map((option, idx) => {
                      const optionLetter = idx === 0 ? 'A' : idx === 1 ? 'B' : 'C'
                      const isSelected = selectedAnswer === optionLetter
                      const isCorrect = showAnswer && optionLetter === currentQuestion.answer
                      const isWrong = showAnswer && isSelected && optionLetter !== currentQuestion.answer

                      return (
                        <button
                          key={idx}
                          onClick={() => !showAnswer && submitAnswer(optionLetter)}
                          disabled={showAnswer}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                              : isWrong
                              ? 'bg-red-50 border-red-500 text-red-900'
                              : isSelected
                              ? 'bg-blue-50 border-blue-500 text-blue-900'
                              : 'bg-slate-50 border-slate-300 text-slate-800 hover:border-slate-400 hover:bg-slate-100'
                          } ${showAnswer ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                              isCorrect
                                ? 'bg-emerald-500 text-white'
                                : isWrong
                                ? 'bg-red-500 text-white'
                                : isSelected
                                ? 'bg-blue-500 text-white'
                                : 'bg-slate-300 text-slate-700'
                            }`}>
                              {optionLetter}
                            </span>
                            <span className="flex-1 text-lg">{option}</span>
                            {isCorrect && (
                              <span className="text-emerald-600 font-bold">✓ Дұрыс</span>
                            )}
                            {isWrong && (
                              <span className="text-red-600 font-bold">✗ Қате</span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  // 非 MCQ 题目，显示答案输入或手动计分
                  <>
                    {showAnswer && currentQuestion.answer && (
                      <div className={`border-2 rounded-xl p-6 text-center mb-6 ${
                        selectedAnswer && checkAnswer(selectedAnswer, currentQuestion.answer)
                          ? 'bg-emerald-50 border-emerald-200'
                          : selectedAnswer
                          ? 'bg-red-50 border-red-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}>
                        <p className="text-sm text-slate-600 mb-2 font-semibold">Дұрыс жауап:</p>
                        <p className="text-2xl font-bold text-slate-700">{currentQuestion.answer}</p>
                        {selectedAnswer && (
                          <p className="mt-2 text-sm">
                            {checkAnswer(selectedAnswer, currentQuestion.answer) ? (
                              <span className="text-emerald-600">✓ Дұрыс!</span>
                            ) : (
                              <span className="text-red-600">✗ Қате</span>
                            )}
                          </p>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => setShowAnswer(!showAnswer)}
                      className="w-full py-4 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-medium text-lg transition-colors mb-6"
                    >
                      {showAnswer ? '👁 Жауапты жасыру' : '👁 Жауапты көрсету'}
                    </button>

                    {/* 手动计分按钮（备用） */}
                    <div className="grid grid-cols-3 gap-4">
                      <button
                        onClick={addTeam1Point}
                        className="py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all text-lg"
                      >
                        1-топ +1
                      </button>
                      <button
                        onClick={addBothPoints}
                        className="py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all text-lg"
                      >
                        Екеуі де
                      </button>
                      <button
                        onClick={addTeam2Point}
                        className="py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all text-lg"
                      >
                        2-топ +1
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-all"
              >
                Тоқтату
              </button>
              <button
                onClick={nextQuestion}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all"
              >
                Келесі сұрақ →
              </button>
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-200 p-8 max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Ойын аяқталды!</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 rounded-xl p-6">
                <p className="text-lg font-medium text-green-700 mb-2">1-топ</p>
                <p className="text-4xl font-bold text-green-600">{team1Score}</p>
                <p className="text-sm text-slate-500 mt-2">
                  Дұрыс: {team1Correct} | Жалпы: {team1Solved}
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6">
                <p className="text-lg font-medium text-blue-700 mb-2">2-топ</p>
                <p className="text-4xl font-bold text-blue-600">{team2Score}</p>
                <p className="text-sm text-slate-500 mt-2">
                  Дұрыс: {team2Correct} | Жалпы: {team2Solved}
                </p>
              </div>
            </div>
            
            {/* 最终对战可视化 */}
            <MonkeyDuelRace
              teamAScore={team1Score}
              teamBScore={team2Score}
              targetLead={5}
            />
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg rounded-xl hover:opacity-90 transition-all"
            >
              Қайта бастау
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
