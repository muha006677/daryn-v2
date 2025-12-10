// Математика - 竞赛模式题库
import type { Question } from '../gameBanks'

export function getMathCompetitionQuestions(grade: number): Question[] {
  const questions: Question[] = [
    {
      q: '5 + 7 = ?\nA) 11\nB) 12\nC) 13\nD) 14',
      a: 'B',
      meta: { explanation: '5 + 7 = 12' },
    },
    {
      q: '10 - 4 = ?\nA) 5\nB) 6\nC) 7\nD) 8',
      a: 'B',
      meta: { explanation: '10 - 4 = 6' },
    },
    {
      q: '3 × 4 = ?\nA) 10\nB) 11\nC) 12\nD) 13',
      a: 'C',
      meta: { explanation: '3 × 4 = 12' },
    },
    {
      q: '20 ÷ 5 = ?\nA) 3\nB) 4\nC) 5\nD) 6',
      a: 'B',
      meta: { explanation: '20 ÷ 5 = 4' },
    },
    {
      q: '8 + 9 = ?\nA) 16\nB) 17\nC) 18\nD) 19',
      a: 'B',
      meta: { explanation: '8 + 9 = 17' },
    },
    {
      q: '15 - 8 = ?\nA) 6\nB) 7\nC) 8\nD) 9',
      a: 'B',
      meta: { explanation: '15 - 8 = 7' },
    },
    {
      q: '6 × 3 = ?\nA) 16\nB) 17\nC) 18\nD) 19',
      a: 'C',
      meta: { explanation: '6 × 3 = 18' },
    },
    {
      q: '24 ÷ 6 = ?\nA) 3\nB) 4\nC) 5\nD) 6',
      a: 'B',
      meta: { explanation: '24 ÷ 6 = 4' },
    },
  ]

  if (grade >= 3) {
    questions.push(
      {
        q: '25 + 37 = ?\nA) 60\nB) 61\nC) 62\nD) 63',
        a: 'C',
        meta: { explanation: '25 + 37 = 62' },
      },
      {
        q: '50 - 23 = ?\nA) 26\nB) 27\nC) 28\nD) 29',
        a: 'B',
        meta: { explanation: '50 - 23 = 27' },
      },
      {
        q: '7 × 8 = ?\nA) 54\nB) 55\nC) 56\nD) 57',
        a: 'C',
        meta: { explanation: '7 × 8 = 56' },
      },
      {
        q: '72 ÷ 9 = ?\nA) 7\nB) 8\nC) 9\nD) 10',
        a: 'B',
        meta: { explanation: '72 ÷ 9 = 8' },
      },
    )
  }

  return questions
}

