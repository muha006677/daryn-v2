// English - 竞赛模式题库
import type { Question } from '../gameBanks'

export function getEnglishCompetitionQuestions(grade: number): Question[] {
  const questions: Question[] = [
    {
      q: 'What is the English word for "алма"?\nA) Apple\nB) Orange\nC) Banana\nD) Grape',
      a: 'A',
      meta: { explanation: 'Apple means "алма" in Kazakh.' },
    },
    {
      q: 'How do you say "салам" in English?\nA) Hello\nB) Goodbye\nC) Thank you\nD) Please',
      a: 'A',
      meta: { explanation: 'Hello means "салам" in Kazakh.' },
    },
    {
      q: 'What color is "қызыл"?\nA) Blue\nB) Green\nC) Red\nD) Yellow',
      a: 'C',
      meta: { explanation: 'Red means "қызыл" in Kazakh.' },
    },
    {
      q: 'How do you say "күн" in English?\nA) Moon\nB) Sun\nC) Star\nD) Cloud',
      a: 'B',
      meta: { explanation: 'Sun means "күн" in Kazakh.' },
    },
    {
      q: 'What is "су" in English?\nA) Fire\nB) Water\nC) Air\nD) Earth',
      a: 'B',
      meta: { explanation: 'Water means "су" in Kazakh.' },
    },
    {
      q: 'How do you say "үй" in English?\nA) School\nB) House\nC) Car\nD) Tree',
      a: 'B',
      meta: { explanation: 'House means "үй" in Kazakh.' },
    },
    {
      q: 'What is "аю" in English?\nA) Bear\nB) Wolf\nC) Fox\nD) Rabbit',
      a: 'A',
      meta: { explanation: 'Bear means "аю" in Kazakh.' },
    },
    {
      q: 'How do you say "күн" (day) in English?\nA) Day\nB) Night\nC) Week\nD) Month',
      a: 'A',
      meta: { explanation: 'Day means "күн" in Kazakh.' },
    },
  ]

  if (grade >= 3) {
    questions.push(
      {
        q: 'What is the English word for "мектеп"?\nA) Hospital\nB) School\nC) Library\nD) Park',
        a: 'B',
        meta: { explanation: 'School means "мектеп" in Kazakh.' },
      },
      {
        q: 'How do you say "кітап" in English?\nA) Book\nB) Pen\nC) Paper\nD) Pencil',
        a: 'A',
        meta: { explanation: 'Book means "кітап" in Kazakh.' },
      },
    )
  }

  return questions
}

