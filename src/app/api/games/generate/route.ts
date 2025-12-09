import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getGradePolicyDescription, generateSessionNonce, getGradePolicy } from '@/lib/gradePolicy'
import {
  getLogicSprintQuestions,
  getMentalMathQuestions,
  getSpeechTopics,
  getReadingMini,
  getFlashMemory,
  getReactionLight,
  getStoryCards,
  getSpotDifference,
  getWorldQuick,
  getTeamStrategy,
  type Question,
} from '@/lib/gameBanks'

type GameType = 
  | 'logic-sprint'
  | 'mental-math'
  | 'speech-1min'
  | 'reading-mini'
  | 'flash-memory'
  | 'reaction-light'
  | 'story-cards'
  | 'spot-difference'
  | 'world-quick'
  | 'team-strategy'

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    const body = await request.json()
    const { gameType, grade } = body

    if (!gameType || !grade) {
      return NextResponse.json(
        { error: 'Ойын түрі және сынып міндетті.' },
        { status: 400 }
      )
    }

    const gradeNum = parseInt(grade.toString(), 10)
    const gradePolicy = getGradePolicyDescription(gradeNum)
    const sessionNonce = generateSessionNonce()

    // Егер API key жоқ болса, local fallback
    if (!apiKey) {
      return getLocalFallback(gameType as GameType, gradeNum)
    }

    const openai = new OpenAI({ apiKey })
    const prompt = buildPrompt(gameType as GameType, gradeNum, gradePolicy, sessionNonce)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Сен қазақ тілінде ойындарға арналған тапсырмалар жасайтын педагогсың. Жауаптарыңды ТЕК JSON форматында бер. ЖОҒАРЫДА КӨРСЕТІЛГЕН ДЕҢГЕЙ ШЕКТЕРІН ҚАТАН САҚТА.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 2000,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return getLocalFallback(gameType as GameType, gradeNum)
    }

    try {
      let cleanContent = content.trim()
      if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7)
      else if (cleanContent.startsWith('```')) cleanContent = cleanContent.slice(3)
      if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3)
      cleanContent = cleanContent.trim()

      const parsed = JSON.parse(cleanContent)
      
      // Convert to unified format { items: [...] }
      return convertToUnifiedFormat(gameType as GameType, parsed, gradeNum)
    } catch {
      return getLocalFallback(gameType as GameType, gradeNum)
    }

  } catch (error) {
    console.error('Game generation error:', error)
    return getLocalFallback((error as any)?.gameType || 'logic-sprint', 2)
  }
}

function buildPrompt(gameType: GameType, grade: number, policy: string, nonce: string): string {
  const basePrompt = `${policy}\nСессия ID: ${nonce}\n\n`

  switch (gameType) {
    case 'logic-sprint':
      return `${basePrompt}Логикалық заңдылық табу тапсырмалары. Дәл 10 қысқа сұрақ + жауап. JSON: { "items": [{ "q": "...", "a": "..." }] }`

    case 'mental-math':
      return `${basePrompt}Жылдам арифметика. Дәл 10 қысқа есеп. JSON: { "items": [{ "q": "...", "a": "..." }] }`

    case 'speech-1min':
      return `${basePrompt}1 минут сөйлеу тақырыптары. Дәл 10 тақырып. JSON: { "items": [{ "q": "тақырып" }] }`

    case 'reading-mini':
      return `${basePrompt}Оқу түсіну. 2-3 қысқа мәтін (2-4 сөйлем) + әр мәтінге 2 сұрақ. JSON: { "items": [{ "q": "мәтін", "meta": { "questions": ["...", "..."] }, "a": "жауаптар" }] }`

    case 'flash-memory':
      const memCount = getGradePolicy(grade).memory.itemsCount
      return `${basePrompt}Есте сақтау. Дәл 10 тізбек. Әр тізбекте ${memCount} элемент. JSON: { "items": [{ "q": "элементтер тізбегі", "a": "элемент саны" }] }`

    case 'reaction-light':
      return `${basePrompt}Реакция "Бағдаршам" ережелері. 5 түс + әрекет. JSON: { "items": [{ "q": "түс", "a": "әрекет" }] }`

    case 'story-cards':
      return `${basePrompt}Story Cards. 10 комбинация (кейіпкер/орын/зат). JSON: { "items": [{ "q": "кейіпкер", "meta": { "place": "...", "object": "..." }, "a": "орын + зат" }] }`

    case 'spot-difference':
      return `${basePrompt}Айырмашылықты тап. 8-10 мәтіндік сипаттама. JSON: { "items": [{ "q": "сипаттама", "a": "айырмашылық" }] }`

    case 'world-quick':
      return `${basePrompt}Дүниетану. Дәл 10 жеңіл сұрақ. JSON: { "items": [{ "q": "...", "a": "..." }] }`

    case 'team-strategy':
      return `${basePrompt}Командалық стратегия. 8-10 ситуациялық сұрақ. JSON: { "items": [{ "q": "...", "a": "..." }] }`

    default:
      return basePrompt
  }
}

function convertToUnifiedFormat(gameType: GameType, parsed: any, grade: number): NextResponse {
  let items: Question[] = []

  switch (gameType) {
    case 'logic-sprint':
    case 'mental-math':
    case 'spot-difference':
    case 'world-quick':
    case 'team-strategy':
      items = parsed.items || parsed.questions || []
      break

    case 'speech-1min':
      items = (parsed.items || parsed.topics || []).map((t: string) => ({ q: t }))
      break

    case 'reading-mini':
      items = parsed.items || parsed.texts || []
      break

    case 'flash-memory':
      items = (parsed.items || parsed.sequences || []).map((s: any) => ({
        q: Array.isArray(s.items) ? s.items.join(', ') : s.q || '',
        a: s.items?.length?.toString() || s.a || ''
      }))
      break

    case 'reaction-light':
      items = parsed.items || []
      break

    case 'story-cards':
      items = parsed.items || []
      break
  }

  // Ensure minimum items
  while (items.length < 5) {
    items.push({ q: '—', a: '—' })
  }

  return NextResponse.json({ items: items.slice(0, 10) })
}

function getLocalFallback(gameType: GameType, grade: number): NextResponse {
  let items: Question[] = []

  switch (gameType) {
    case 'logic-sprint':
      items = getLogicSprintQuestions(grade)
      break
    case 'mental-math':
      items = getMentalMathQuestions(grade)
      break
    case 'speech-1min':
      items = getSpeechTopics(grade)
      break
    case 'reading-mini':
      items = getReadingMini(grade)
      break
    case 'flash-memory':
      items = getFlashMemory(grade)
      break
    case 'reaction-light':
      items = getReactionLight()
      break
    case 'story-cards':
      items = getStoryCards()
      break
    case 'spot-difference':
      items = getSpotDifference(grade)
      break
    case 'world-quick':
      items = getWorldQuick(grade)
      break
    case 'team-strategy':
      items = getTeamStrategy(grade)
      break
    default:
      items = [{ q: '—', a: '—' }]
  }

  return NextResponse.json({ items })
}
