'use client'

import { useState } from 'react'
import { Question } from '@/app/api/generate-question/route'

interface MCQCardProps {
  question: Question
  showAnswer: boolean
  onToggleAnswer: () => void
  index: number
  total: number
}

export default function MCQCard({
  question,
  showAnswer,
  onToggleAnswer,
  index,
  total,
}: MCQCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  // 确保 options 存在且是数组
  const options = question.options || []
  const answer = question.answer || ''
  
  // 获取正确答案的索引 (A=0, B=1, C=2)
  const correctIndex = answer === 'A' ? 0 : answer === 'B' ? 1 : answer === 'C' ? 2 : -1
  const correctOptionText = correctIndex >= 0 && correctIndex < options.length 
    ? options[correctIndex] 
    : ''

  const handleOptionClick = (optionIndex: number) => {
    if (!showAnswer) {
      const optionLetter = optionIndex === 0 ? 'A' : optionIndex === 1 ? 'B' : 'C'
      setSelectedOption(optionLetter)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 flex items-center justify-between text-white">
        <span className="font-medium">Тапсырма {index + 1} / {total}</span>
      </div>

      <div className="p-8">
        <div className="min-h-[100px] flex items-center justify-center mb-6">
          <p className="text-2xl text-slate-800 text-center leading-relaxed whitespace-pre-wrap">
            {question.prompt || '—'}
          </p>
        </div>

        {/* 选项列表 */}
        <div className="space-y-3 mb-6">
          {options.map((option, idx) => {
            const optionLetter = idx === 0 ? 'A' : idx === 1 ? 'B' : 'C'
            const isSelected = selectedOption === optionLetter
            const isCorrect = showAnswer && optionLetter === answer
            const isWrong = showAnswer && isSelected && optionLetter !== answer

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
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

        {/* 答案和解释 */}
        {showAnswer && (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 mb-4">
            <p className="text-sm text-emerald-600 mb-2 font-semibold uppercase">Дұрыс жауап:</p>
            <p className="text-lg font-bold text-emerald-700 mb-2">
              {answer}) {correctOptionText}
            </p>
            {question.explanation && (
              <p className="text-sm text-emerald-600 mt-3 pt-3 border-t border-emerald-200">
                {question.explanation}
              </p>
            )}
          </div>
        )}

        <button
          onClick={() => {
            if (!showAnswer) {
              setSelectedOption(null)
            }
            onToggleAnswer()
          }}
          className="w-full py-4 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-medium text-lg transition-colors"
        >
          {showAnswer ? '👁 Жауапты жасыру' : '👁 Жауапты көрсету'}
        </button>
      </div>
    </div>
  )
}

