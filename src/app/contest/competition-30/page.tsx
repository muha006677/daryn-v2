'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Question } from '@/app/api/generate-question/route'
import { generateCompetitionQuestions, DEFAULT_COMPETITION_CONFIG, type Subject, type CompetitionQuestion } from '@/lib/competition/competitionEngine'
import { addResult } from '@/lib/results/resultsStore'
import type { GameResult } from '@/types/results'

type GameState = 'menu' | 'playing' | 'finished'

interface AnswerRecord {
  questionIndex: number
  selectedAnswer: string
  isCorrect: boolean
  subject: Subject
  subjectName: string
}

export default function Competition30Page() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [grade, setGrade] = useState<string>('2')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [questions, setQuestions] = useState<CompetitionQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>([])
  const [isLocked, setIsLocked] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length

  const startGame = () => {
    setIsLoading(true)
    setError(null)
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setAnswerRecords([])
    setIsLocked(false)

    try {
      const generated = generateCompetitionQuestions(parseInt(grade), DEFAULT_COMPETITION_CONFIG)
      
      if (generated.length === 0) {
        setError('Сұрақтар әзірге қолжетімсіз')
      } else {
        setQuestions(generated)
        setGameState('playing')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Қате орын алды')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOptionSelect = (optionLetter: string) => {
    if (isLocked || !currentQuestion) return

    const isCorrect = optionLetter === currentQuestion.answer
    const newSelectedAnswers = { ...selectedAnswers, [currentQuestionIndex]: optionLetter }
    setSelectedAnswers(newSelectedAnswers)
    setIsLocked(true)

    // 记录答案
    setAnswerRecords(prev => [
      ...prev,
      {
        questionIndex: currentQuestionIndex,
        selectedAnswer: optionLetter,
        isCorrect,
        subject: currentQuestion.subject,
        subjectName: currentQuestion.subjectName,
      },
    ])
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setIsLocked(false)
    } else {
      setGameState('finished')
    }
  }

  const resetGame = () => {
    setGameState('menu')
    setQuestions([])
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setAnswerRecords([])
    setIsLocked(false)
  }

  // 计算统计信息
  const calculateStats = () => {
    const totalCorrect = answerRecords.filter(r => r.isCorrect).length
    const totalWrong = answerRecords.length - totalCorrect
    const totalScore = totalCorrect

    // 按科目统计
    const subjectStats: Record<string, { correct: number; total: number }> = {}
    
    answerRecords.forEach(record => {
      const key = record.subjectName
      if (!subjectStats[key]) {
        subjectStats[key] = { correct: 0, total: 0 }
      }
      subjectStats[key].total++
      if (record.isCorrect) {
        subjectStats[key].correct++
      }
    })

    // 确保所有科目都有统计（即使没有答题）
    DEFAULT_COMPETITION_CONFIG.subjects.forEach(subject => {
      if (!subjectStats[subject.name]) {
        subjectStats[subject.name] = { correct: 0, total: 0 }
      }
    })

    return { totalCorrect, totalWrong, totalScore, subjectStats }
  }

  const stats = gameState === 'finished' ? calculateStats() : null

  // 保存结果
  useEffect(() => {
    if (gameState === 'finished' && answerRecords.length > 0 && stats) {
      // 按学科聚合
      const domainStats: Record<string, { correct: number; total: number }> = {}
      answerRecords.forEach(record => {
        const domain = record.subject
        if (!domainStats[domain]) {
          domainStats[domain] = { correct: 0, total: 0 }
        }
        domainStats[domain].total += 1
        if (record.isCorrect) {
          domainStats[domain].correct += 1
        }
      })

      // 为每个学科保存结果
      Object.entries(domainStats).forEach(([domain, stats]) => {
        const domainAccuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
        const result: GameResult = {
          gameId: `competition-30-${Date.now()}-${domain}`,
          domain: domain,
          correct: stats.correct,
          total: stats.total,
          accuracy: domainAccuracy,
          createdAt: new Date().toISOString(),
        }
        addResult(result)
      })
    }
  }, [gameState, answerRecords, stats])

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Басты бетке қайту
        </Link>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">30 сұрақтық олимпиадалық режим</h1>
          <p className="text-slate-600">6 пәннен аралас таңдау тапсырмалары</p>
        </div>

        {gameState === 'menu' && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 max-w-md mx-auto">
            <div className="space-y-6">
              <div>
                <label className="block font-medium text-slate-700 mb-2">Сынып:</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {['1', '2', '3', '4', '5', '6'].map(g => (
                    <option key={g} value={g}>{g}-сынып</option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm font-medium text-slate-700 mb-2">Тапсырмалар:</p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Математика: 5 тапсырма</li>
                  <li>• English: 5 тапсырма</li>
                  <li>• Қазақ тілі: 5 тапсырма</li>
                  <li>• Қазақ әдебиеті: 5 тапсырма</li>
                  <li>• Жаратылыстану: 5 тапсырма</li>
                  <li>• Әлемтану: 5 тапсырма</li>
                  <li className="font-bold text-slate-900 mt-2">Барлығы: 30 тапсырма</li>
                </ul>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                  {error}
                </div>
              )}

              <button
                onClick={startGame}
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {isLoading ? 'Жасалуда...' : 'Бастау'}
              </button>
            </div>
          </div>
        )}

        {gameState === 'playing' && currentQuestion && (
          <div className="space-y-6">
            {/* 进度条 */}
            <div className="bg-white rounded-xl shadow-md border-2 border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-slate-700">
                  Тапсырма {currentQuestionIndex + 1} / {totalQuestions}
                </span>
                <span className="text-sm text-slate-600">
                  {currentQuestion.subjectName}
                </span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* 题目卡片 */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 flex items-center justify-between text-white">
                <span className="font-medium">Тапсырма {currentQuestionIndex + 1} / {totalQuestions}</span>
                <span className="text-sm">{currentQuestion.subjectName}</span>
              </div>

              <div className="p-8">
                <p className="text-2xl text-slate-800 text-center mb-8 min-h-[100px] flex items-center justify-center leading-relaxed">
                  {currentQuestion.prompt || '—'}
                </p>

                {/* 选项列表 */}
                {currentQuestion.options && currentQuestion.options.length > 0 ? (
                  <div className="space-y-3 mb-6">
                    {currentQuestion.options.map((option, idx) => {
                      const optionLetter = idx === 0 ? 'A' : idx === 1 ? 'B' : idx === 2 ? 'C' : 'D'
                      const isSelected = selectedAnswers[currentQuestionIndex] === optionLetter
                      const isCorrect = optionLetter === currentQuestion.answer
                      const isWrong = isSelected && !isCorrect

                      return (
                        <button
                          key={idx}
                          onClick={() => handleOptionSelect(optionLetter)}
                          disabled={isLocked}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                            isCorrect && isLocked
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                              : isWrong
                              ? 'bg-red-50 border-red-500 text-red-900'
                              : isSelected
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-900'
                              : isLocked
                              ? 'bg-slate-50 border-slate-300 text-slate-500 cursor-not-allowed'
                              : 'bg-white border-slate-300 text-slate-800 hover:border-indigo-500 hover:bg-indigo-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                              isCorrect && isLocked
                                ? 'bg-emerald-500 text-white'
                                : isWrong
                                ? 'bg-red-500 text-white'
                                : isSelected
                                ? 'bg-indigo-500 text-white'
                                : 'bg-slate-300 text-slate-700'
                            }`}>
                              {optionLetter}
                            </span>
                            <span className="flex-1 text-lg">{option}</span>
                            {isCorrect && isLocked && (
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
                  <div className="text-center text-slate-500 mb-6">
                    Таңдау опциялары жоқ
                  </div>
                )}

                {/* 解释 */}
                {isLocked && currentQuestion.explanation && (
                  <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-slate-600 font-semibold mb-1">Түсіндірме:</p>
                    <p className="text-slate-700">{currentQuestion.explanation}</p>
                  </div>
                )}

                {/* 下一题按钮 */}
                {isLocked && (
                  <button
                    onClick={nextQuestion}
                    className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg rounded-xl hover:opacity-90 transition-all"
                  >
                    {currentQuestionIndex < totalQuestions - 1 ? 'Келесі →' : 'Нәтижелерді көрсету'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {gameState === 'finished' && stats && (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-amber-200 p-8 max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Ойын аяқталды!</h2>
            </div>

            {/* 总分 */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6 text-white text-center mb-8">
              <p className="text-lg font-medium mb-2">Жалпы ұпай</p>
              <p className="text-6xl font-bold">{stats.totalScore} / {totalQuestions}</p>
            </div>

            {/* 正确/错误统计 */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-emerald-50 rounded-xl p-6 text-center">
                <p className="text-lg font-medium text-emerald-700 mb-2">Дұрыс жауап</p>
                <p className="text-4xl font-bold text-emerald-600">{stats.totalCorrect}</p>
              </div>
              <div className="bg-red-50 rounded-xl p-6 text-center">
                <p className="text-lg font-medium text-red-700 mb-2">Қате жауап</p>
                <p className="text-4xl font-bold text-red-600">{stats.totalWrong}</p>
              </div>
            </div>

            {/* 分科统计 */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Пән бойынша статистика:</h3>
              <div className="space-y-3">
                {DEFAULT_COMPETITION_CONFIG.subjects.map(subject => {
                  const subjectStat = stats.subjectStats[subject.name]
                  const correct = subjectStat?.correct || 0
                  const total = subjectStat?.total || subject.count
                  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0

                  return (
                    <div key={subject.subject} className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-700">{subject.name}</span>
                        <span className="text-sm font-bold text-slate-600">
                          {correct} / {total} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            percentage >= 80 ? 'bg-emerald-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <button
              onClick={resetGame}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg rounded-xl hover:opacity-90 transition-all"
            >
              Қайта бастау
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

