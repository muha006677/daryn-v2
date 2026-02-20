'use client'

import { useState, useMemo } from 'react'
import { generateLesson1Questions } from '@/lib/courses/generators/grade1Lesson1'

export default function Lesson1Page() {

  const allQuestions = useMemo(() => generateLesson1Questions(), [])

  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const current = allQuestions[index]
  const group = allQuestions.slice(index, index + 5)

  function handleAnswer(value: number) {
    setSelected(value)
    setShowExplanation(true)
  }

  function next() {
    setSelected(null)
    setShowExplanation(false)
    setIndex(prev => prev + 5)
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>1 сынып · Заттарды санау</h1>

      {group.map(q => (
        <div key={q.id} style={{ marginBottom: 30 }}>
          <p>{q.question}</p>

          <div style={{ display: 'flex', gap: 10 }}>
            {q.options.map(opt => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
              >
                {opt}
              </button>
            ))}
          </div>

          {showExplanation && selected !== null && (
            <p style={{ marginTop: 10 }}>
              {selected === q.correct
                ? "Дұрыс!"
                : q.explanation}
            </p>
          )}
        </div>
      ))}

      {index + 5 < allQuestions.length && (
        <button onClick={next}>Келесі 5 сұрақ</button>
      )}
    </div>
  )
}
