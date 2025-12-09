import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getGradePolicyDescription, generateSessionNonce } from '@/lib/gradePolicy'

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API кілті табылмады. Жоба түбіндегі .env.local файлына OPENAI_API_KEY=sk-... қосыңыз.' },
        { status: 500 }
      )
    }

    const openai = new OpenAI({ apiKey })

    // Parse request body
    const body = await request.json()
    const { grade, subject, topic, duration, difficulty } = body

    // Validate required fields
    if (!grade || !subject || !topic) {
      return NextResponse.json(
        { error: 'Сынып, пән және тақырып міндетті түрде толтырылуы керек.' },
        { status: 400 }
      )
    }

    const gradeNum = parseInt(grade.toString(), 10)
    const gradePolicy = getGradePolicyDescription(gradeNum)
    const sessionNonce = generateSessionNonce()

    // Build the prompt for structured JSON output
    const prompt = `Сен тәжірибелі қазақстандық мұғалімсің. Төмендегі параметрлер бойынша тапсырмалар жаса:

${gradePolicy}

Пән: ${subject}
Тақырып: ${topic}
Сабақ ұзақтығы: ${duration || '40 минут'}
Сессия ID: ${sessionNonce}

МАҢЫЗДЫ ТАЛАПТАР:
1. Дәл 10-12 тапсырма жаса
2. Әр тапсырма қысқа, нақты болсын (бір сұрақ/есеп)
3. ЖОҒАРЫДА БЕРЕЛГЕН САН ДИАПАЗОНДАРЫ ЖӘНЕ ТІЛ ДЕҢГЕЙІН ҚАТАН САҚТА
4. Егер ${subject} === "Математика" болса, тек ${gradeNum}-сыныпқа сай сандар мен операциялар қолданылсын
5. Егер ${subject} === "Қазақ тілі" болса, тек ${gradeNum}-сыныпқа сай сөйлем ұзындығы мен күрделілік қолданылсын
6. Барлық мәтін 100% қазақ тілінде болсын
7. Оқушының жас ерекшелігіне сай болсын

ЖАУАП ФОРМАТЫ (тек JSON, басқа ештеңе жазба):
{
  "tasks": [
    "Бірінші тапсырма мәтіні",
    "Екінші тапсырма мәтіні",
    "..."
  ],
  "answers": [
    "Бірінші жауап",
    "Екінші жауап",
    "..."
  ]
}

Тек таза JSON қайтар, ешқандай түсініктеме немесе markdown қоспа.`

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Сен қазақ тілінде тапсырмалар жасайтын білікті педагогсың. Жауаптарыңды ТЕК JSON форматында бер. Ешқандай markdown, түсініктеме немесе қосымша мәтін қоспа. ЖОҒАРЫДА КӨРСЕТІЛГЕН САН ДИАПАЗОНДАРЫ ЖӘНЕ ДЕҢГЕЙ ШЕКТЕРІН ҚАТАН САҚТА.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2500,
    })

    const content = completion.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json(
        { error: 'AI жауап бере алмады. Қайта көріңіз.' },
        { status: 500 }
      )
    }

    // Parse JSON response
    try {
      // Clean the response - remove markdown code blocks if present
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
      
      // Validate structure
      if (!Array.isArray(parsed.tasks) || !Array.isArray(parsed.answers)) {
        throw new Error('Invalid structure')
      }

      // Ensure arrays have same length
      if (parsed.tasks.length !== parsed.answers.length) {
        // Pad answers if needed
        while (parsed.answers.length < parsed.tasks.length) {
          parsed.answers.push('—')
        }
      }

      return NextResponse.json({
        tasks: parsed.tasks,
        answers: parsed.answers
      })

    } catch {
      console.error('JSON parse error, raw content:', content)
      return NextResponse.json(
        { error: 'AI жауабын өңдеу мүмкін болмады. Қайта көріңіз.' },
        { status: 500 }
      )
    }

  } catch (error: unknown) {
    console.error('Worksheet generation error:', error)
    
    // Handle OpenAI specific errors
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: 'OpenAI API кілті жарамсыз. Кілтті тексеріңіз.' },
          { status: 401 }
        )
      }
      if (error.status === 429) {
        return NextResponse.json(
          { error: 'API сұраныстар лимитіне жеттіңіз. Бірнеше минуттан кейін қайта көріңіз.' },
          { status: 429 }
        )
      }
      if (error.status === 503) {
        return NextResponse.json(
          { error: 'OpenAI сервері қазір қолжетімсіз. Кейінірек қайта көріңіз.' },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Қате орын алды. Қайта көріңіз.' },
      { status: 500 }
    )
  }
}
