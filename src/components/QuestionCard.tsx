'use client'

import { Question } from '@/app/api/generate-question/route'

interface QuestionCardProps {
  question: Question
  showAnswer: boolean
  onToggleAnswer: () => void
  index: number
  total: number
}

export default function QuestionCard({
  question,
  showAnswer,
  onToggleAnswer,
  index,
  total,
}: QuestionCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 flex items-center justify-between text-white">
        <span className="font-medium">Тапсырма {index + 1} / {total}</span>
      </div>

      <div className="p-8">
        <div className="min-h-[150px] flex items-center justify-center mb-6">
          <p className="text-2xl text-slate-800 text-center leading-relaxed whitespace-pre-wrap">
            {question.prompt || '—'}
          </p>
        </div>

        {showAnswer && question.answer && (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 mb-4">
            <p className="text-sm text-emerald-600 mb-2 font-semibold uppercase">Жауабы:</p>
            <p className="text-xl font-bold text-emerald-700 leading-relaxed whitespace-pre-wrap">
              {question.answer}
            </p>
            {question.explanation && (
              <p className="text-sm text-emerald-600 mt-3 pt-3 border-t border-emerald-200">
                {question.explanation}
              </p>
            )}
          </div>
        )}

        <button
          onClick={onToggleAnswer}
          className="w-full py-4 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-medium text-lg transition-colors"
        >
          {showAnswer ? '👁 Жауапты жасыру' : '👁 Жауапты көрсету'}
        </button>
      </div>
    </div>
  )
}
