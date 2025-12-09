import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getGradePolicyDescription, generateSessionNonce, getGradePolicy } from '@/lib/gradePolicy'
import { getContestLocalFallback } from '@/lib/contestBanks'

type ContestSubType = 
  | 'logic-pro'
  | 'math-ultra'
  | 'poem-complete'
  | 'essay-master'
  | 'rapid-retell'
  | 'memory-pro'

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    const body = await request.json()
    const { grade, subType } = body

    if (!grade || !subType) {
      return NextResponse.json(
        { error: 'Сынып және бағыт міндетті.' },
        { status: 400 }
      )
    }

    const gradeNum = parseInt(grade.toString(), 10)
    const sessionNonce = generateSessionNonce()

    // Егер API key жоқ болса, local fallback
    if (!apiKey) {
      const items = getContestLocalFallback(subType as ContestSubType, gradeNum)
      return NextResponse.json({ items })
    }

    const openai = new OpenAI({ apiKey })
    const gradePolicy = getGradePolicyDescription(gradeNum)
    const prompt = buildPrompt(subType as ContestSubType, gradeNum, gradePolicy, sessionNonce)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Сен қазақ тілінде дарынды оқушыларға арналған жоғары деңгейлі тапсырмалар жасайтын педагогсың. Жауаптарыңды ТЕК JSON форматында бер. ЖОҒАРЫДА КӨРСЕТІЛГЕН ДЕҢГЕЙ ШЕКТЕРІН ҚАТАН САҚТА. Тапсырмалар шынында күрделі, дарынды оқушыларға арналған болуы керек.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 2500,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      const items = getContestLocalFallback(subType as ContestSubType, gradeNum)
      return NextResponse.json({ items })
    }

    try {
      let cleanContent = content.trim()
      if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7)
      else if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3)
      if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3)
      cleanContent = cleanContent.trim()

      const parsed = JSON.parse(cleanContent)
      
      // Convert to unified format { items: [...] }
      const items = (parsed.items || []).slice(0, 10)
      
      // Ensure minimum items
      while (items.length < 8) {
        items.push({ q: '—', a: '—' })
      }

      return NextResponse.json({ items: items.slice(0, 10) })

    } catch {
      const items = getContestLocalFallback(subType as ContestSubType, gradeNum)
      return NextResponse.json({ items })
    }

  } catch (error) {
    console.error('Contest generation error:', error)
    const gradeNum = parseInt((error as any)?.grade?.toString() || '2', 10)
    const subType = (error as any)?.subType || 'logic-pro'
    const items = getContestLocalFallback(subType as ContestSubType, gradeNum)
    return NextResponse.json({ items })
  }
}

function buildPrompt(subType: ContestSubType, grade: number, policy: string, nonce: string): string {
  const basePrompt = `${policy}\nСессия ID: ${nonce}\n\nДАРЫНДЫ ОҚУШЫЛАРҒА АРНАЛҒАН ЖОҒАРЫ ДЕҢГЕЙЛІ ТАПСЫРМАЛАР ЖАСА. Тапсырмалар шынында күрделі, бірақ бастауыш сыныпқа сай болуы керек.\n\n`

  switch (subType) {
    case 'logic-pro':
      return `${basePrompt}ЛОГИКА PRO: Заңдылық, комбинаторикаға жеңіл кіріспе, шартты логика, диаграмма/кесте ойлау. Дәл 8-10 тапсырма. JSON: { "items": [{ "q": "...", "a": "..." }] }`

    case 'math-ultra':
      return `${basePrompt}МАТЕМАТИКА ULTRA: Көпқадамды есептер, аралас амалдар, стратегиялық есептер. Супер жоғары деңгей. Дәл 8-10 тапсырма. JSON: { "items": [{ "q": "...", "a": "..." }] }`

    case 'poem-complete':
      const poemPolicy = getGradePolicy(grade)
      return `${basePrompt}ӨЛЕҢДІ ТОЛЫҚТЫР: Алдыңғы 2 тармақ берілген. Оқушы соған сай артқы 2 тармақты ойдан құрастырып 1 шумақ аяқтайды. Тақырып/эмоция сәйкестігін сақта. Дәл 8-10 тапсырма. JSON: { "items": [{ "q": "Алдыңғы 2 тармақ\\n?", "a": "Артқы 2 тармақ", "meta": { "lines": ["1-тармақ", "2-тармақ"] } }] }`

    case 'essay-master':
      const essayPolicy = getGradePolicy(grade)
      const minSent = grade <= 2 ? 3 : grade <= 4 ? 5 : 8
      const maxSent = grade <= 2 ? 4 : grade <= 4 ? 7 : 10
      return `${basePrompt}ЭССЕ ШЕБЕРІ: Берілген тақырып бойынша қысқа эссе жазады. Ұзындық: ${minSent}-${maxSent} сөйлем. Дәл 8-10 тақырып. JSON: { "items": [{ "q": "тақырып", "a": "Сипаттама", "meta": { "minSentences": ${minSent}, "maxSentences": ${maxSent} } }] }`

    case 'rapid-retell':
      const timeLimit = grade <= 2 ? 60 : grade <= 4 ? 90 : 120
      return `${basePrompt}ЖЕДЕЛ МАЗМҰНДАМА: Берілген мәтінді оқып ${timeLimit} секунд ішінде мазмұндап береді. Дәл 8-10 мәтін. JSON: { "items": [{ "q": "мәтін", "a": "Сипаттама", "meta": { "timeLimit": ${timeLimit} } }] }`

    case 'memory-pro':
      const memPolicy = getGradePolicy(grade)
      const memCount = memPolicy.memory.itemsCount + 2
      return `${basePrompt}ЕСТЕ САҚТАУ PRO: Қысқа уақыттық есте сақтау + назар тұрақтылығы + жылдам қайта жаңғырту. Әр тізбекте ${memCount} элемент. Дәл 8-10 тапсырма. JSON: { "items": [{ "q": "элементтер тізбегі", "a": "элемент саны", "meta": { "items": [...], "count": ${memCount} } }] }`

    default:
      return basePrompt
  }
}
