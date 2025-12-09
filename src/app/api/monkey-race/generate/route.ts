import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getLocalQuestions } from '@/lib/monkeyRaceLocalBank'
import { getGradePolicyDescription, generateSessionNonce } from '@/lib/gradePolicy'

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    // Parse request body
    const body = await request.json()
    const { grade } = body

    const gradeNum = grade ? parseInt(grade.toString(), 10) : 2
    const gradePolicy = getGradePolicyDescription(gradeNum)
    const sessionNonce = generateSessionNonce()

    // Егер API key жоқ болса, local сұрақтарды қайтар
    if (!apiKey) {
      const localQuestions = getLocalQuestions(gradeNum)
      return NextResponse.json({ questions: localQuestions })
    }

    // OpenAI API арқылы генерациялау
    const openai = new OpenAI({ apiKey })

    const prompt = `Сен тәжірибелі қазақстандық мұғалімсің. Сыныптық ойын "Екі маймылдың ағашқа жарысы" үшін сұрақтар жаса.

${gradePolicy}

Сессия ID: ${sessionNonce}

ТАЛАПТАР:
1. Дәл 10 қысқа сұрақ жаса
2. Пәндер аралас: Математика + Қазақ тілі + Дүниетану + жеңіл Ағылшын тілі
3. Сұрақтар қысқа, анық болсын (1-2 сөйлем)
4. Жауаптар қысқа, нақты болсын (1-5 сөз)
5. Сыныптық жарысқа сай, жылдам жауап беруге мүмкіндік беретіндей
6. ЖОҒАРЫДА БЕРЕЛГЕН САН ДИАПАЗОНДАРЫ ЖӘНЕ ТІЛ ДЕҢГЕЙІН ҚАТАН САҚТА
7. Математика: тек ${gradeNum}-сыныпқа сай сандар мен операциялар
8. Қазақ тілі: тек ${gradeNum}-сыныпқа сай сөйлем ұзындығы
9. Дүниетану: ${gradeNum}-сыныпқа сай күрделілік
10. Ағылшын: ${gradeNum}-сыныпқа сай сөздік деңгейі
11. 100% қазақ тілінде (тек ағылшын сөздері қазақ тілі сабағы/теңестіру үшін)

ЖАУАП ФОРМАТЫ (тек JSON):
{
  "questions": [
    { "q": "Сұрақ мәтіні", "a": "Жауап" },
    { "q": "Сұрақ мәтіні", "a": "Жауап" },
    ...
  ]
}

Тек таза JSON қайтар, ешқандай markdown, түсініктеме немесе қосымша мәтін қоспа.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Сен қазақ тілінде сыныптық ойындарға арналған сұрақтар жасайтын білікті педагогсың. Жауаптарыңды ТЕК JSON форматында бер. Ешқандай markdown, түсініктеме немесе қосымша мәтін қоспа. ЖОҒАРЫДА КӨРСЕТІЛГЕН САН ДИАПАЗОНДАРЫ ЖӘНЕ ДЕҢГЕЙ ШЕКТЕРІН ҚАТАН САҚТА.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1500,
    })

    const content = completion.choices[0]?.message?.content

    if (!content) {
      // AI сәтсіз болса, local fallback
      const localQuestions = getLocalQuestions(gradeNum)
      return NextResponse.json({ questions: localQuestions })
    }

    // Parse JSON response
    try {
      let cleanContent = content.trim()
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7)
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3)
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3)
      }
      cleanContent = cleanContent.trim()

      const parsed = JSON.parse(cleanContent)

      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error('Invalid structure')
      }

      // Ensure exactly 10 questions
      const questions = parsed.questions.slice(0, 10)
      while (questions.length < 10) {
        questions.push({ q: '—', a: '—' })
      }

      return NextResponse.json({ questions })

    } catch {
      // Parse error болса, local fallback
      const localQuestions = getLocalQuestions(gradeNum)
      return NextResponse.json({ questions: localQuestions })
    }

  } catch (error: unknown) {
    console.error('Monkey race generation error:', error)
    
    // Кез келген қатеде local fallback
    const gradeNum = parseInt((error as any)?.grade?.toString() || '2', 10)
    const localQuestions = getLocalQuestions(gradeNum)
    return NextResponse.json({ questions: localQuestions })
  }
}
