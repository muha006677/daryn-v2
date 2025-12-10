// 统一的题目引擎 - 类型安全的题目生成和转换
import { Question as ApiQuestion } from '@/app/api/generate-question/route'
import { Question as LocalQuestion } from './gameBanks'
import { getKazLangLitQuestions } from './kazLangLitLocalBank'
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
} from './gameBanks'
import {
  getCaptureFlagQuestions,
  getCastleSiegeQuestions,
  getComboRushQuestions,
} from './newGamesBanks'
import {
  getLogicProQuestions,
  getMathUltraQuestions,
  getPoemCompleteQuestions,
  getEssayMasterQuestions,
  getRapidRetellQuestions,
  getMemoryProQuestions,
} from './contestBanks'

export type Domain = 
  | 'math_logic'
  | 'math_ultra'
  | 'kaz_lang_lit'
  | 'kaz_poem'
  | 'kaz_essay'
  | 'kaz_retell'
  | 'memory'
  | 'reaction'
  | 'reading'
  | 'mixed'
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
  | 'capture-flag'
  | 'castle-siege'
  | 'combo-rush'
  | 'quick-judge'
  | 'sentence-puzzle'

export interface QuestionEngineOptions {
  domain: Domain
  grade: number
  count?: number
  seed?: string
}

/**
 * 从本地题目文本中解析答案
 * 支持多种格式：Дұрыс жауап: X, Correct answer: X, дұрыс жауап: X
 */
function parseAnswerFromText(text: string): string | null {
  const lines = text.split('\n')
  
  // 尝试从文本中解析答案
  for (const line of lines) {
    // 哈萨克语格式
    const kazMatch = line.match(/Дұрыс\s+жауап[:\s]+([A-C]|[^\n]+)/i)
    if (kazMatch) {
      return kazMatch[1].trim()
    }
    
    // 英语格式
    const engMatch = line.match(/Correct\s+answer[:\s]+([A-C]|[^\n]+)/i)
    if (engMatch) {
      return engMatch[1].trim()
    }
    
    // 小写格式
    const lowerMatch = line.match(/дұрыс\s+жауап[:\s]+([A-C]|[^\n]+)/i)
    if (lowerMatch) {
      return lowerMatch[1].trim()
    }
  }
  
  return null
}

/**
 * 从本地题目格式转换为 API Question 格式
 * 确保类型安全：answer 必须是 string，options 必须是 string[] 或 undefined
 */
function convertLocalToApi(
  localQ: LocalQuestion,
  domain: Domain,
  grade: number,
  idx: number
): ApiQuestion | null {
  // 1. 尝试从 q.a 获取答案
  let answerCandidate: string | undefined = localQ.a
  
  // 2. 如果 q.a 不存在，尝试从文本中解析
  if (!answerCandidate) {
    answerCandidate = parseAnswerFromText(localQ.q) || undefined
  }
  
  // 3. 如果 meta 中有答案，也尝试获取
  if (!answerCandidate && localQ.meta?.answer) {
    answerCandidate = String(localQ.meta.answer)
  }
  
  // 4. 如果仍然没有答案，跳过该题目
  if (!answerCandidate || answerCandidate.trim() === '' || answerCandidate === '—') {
    return null
  }
  
  // 5. 解析题目文本
  const lines = localQ.q.split('\n')
  const promptLines = lines.filter(line => 
    !/^[A-C]\)/.test(line) && 
    !/^Дұрыс\s+жауап/i.test(line) &&
    !/^Correct\s+answer/i.test(line)
  )
  const options = lines
    .filter(line => /^[A-C]\)/.test(line))
    .map(line => line.replace(/^[A-C]\)\s*/, '').trim())
    .filter(opt => opt.length > 0)
  
  // 6. 构建 API Question
  return {
    id: `${domain}-${grade}-${idx}-${Date.now()}`,
    domain,
    grade,
    type: options.length > 0 ? 'mcq' : 'short',
    prompt: promptLines.join('\n').trim() || localQ.q.trim(),
    options: options.length > 0 ? options : undefined,
    answer: answerCandidate.trim(),
    explanation: localQ.meta?.explanation || `Дұрыс жауап: ${answerCandidate.trim()}`,
    meta: localQ.meta,
  }
}

/**
 * 从本地题库获取题目
 */
function getLocalQuestions(domain: Domain, grade: number): LocalQuestion[] {
  switch (domain) {
    case 'kaz_lang_lit':
      return getKazLangLitQuestions(grade)
    
    case 'logic-sprint':
      return getLogicSprintQuestions(grade)
    
    case 'mental-math':
      return getMentalMathQuestions(grade)
    
    case 'speech-1min':
      return getSpeechTopics(grade)
    
    case 'reading-mini':
      return getReadingMini(grade)
    
    case 'flash-memory':
      return getFlashMemory(grade)
    
    case 'reaction-light':
      return getReactionLight()
    
    case 'story-cards':
      return getStoryCards()
    
    case 'spot-difference':
      return getSpotDifference(grade)
    
    case 'world-quick':
      return getWorldQuick(grade)
    
    case 'team-strategy':
      return getTeamStrategy(grade)
    
    case 'math_logic':
      return getLogicProQuestions(grade)
    
    case 'math_ultra':
      return getMathUltraQuestions(grade)
    
    case 'kaz_poem':
      return getPoemCompleteQuestions(grade)
    
    case 'kaz_essay':
      return getEssayMasterQuestions(grade)
    
    case 'kaz_retell':
      return getRapidRetellQuestions(grade)
    
    case 'memory':
      return getMemoryProQuestions(grade)
    
    case 'capture-flag':
      return getCaptureFlagQuestions(grade)
    
    case 'castle-siege':
      return getCastleSiegeQuestions(grade)
    
    case 'combo-rush':
      return getComboRushQuestions(grade)
    
    case 'quick-judge':
      // quick-judge 使用特殊的 TrueFalseQuestion 类型，需要特殊处理
      return []
    
    case 'sentence-puzzle':
      // sentence-puzzle 使用特殊的 SentencePuzzleQuestion 类型，需要特殊处理
      return []
    
    default:
      return []
  }
}

/**
 * 从 API 获取题目
 */
async function getApiQuestions(
  domain: Domain,
  grade: number,
  count: number,
  seed?: string
): Promise<ApiQuestion[]> {
  try {
    const response = await fetch('/api/generate-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grade,
        domain,
        difficulty: 'ultra',
        count,
        seed: seed || `engine-${Date.now()}`,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'API қате' }))
      throw new Error(error.error || 'API қате')
    }

    const data = await response.json()
    return data.questions || []
  } catch (error) {
    console.error('API question generation failed:', error)
    throw error
  }
}

/**
 * 统一的题目获取函数
 * 1. 先尝试从本地题库获取
 * 2. 如果不足，尝试从 API 获取补齐
 * 3. 如果 API 失败，返回本地题库（即使不足）
 */
export async function getQuestions(options: QuestionEngineOptions): Promise<ApiQuestion[]> {
  const { domain, grade, count = 5, seed } = options
  
  // 1. 从本地题库获取
  const localQuestions = getLocalQuestions(domain, grade)
  
  // 2. 转换为 API 格式，过滤掉无效题目
  const convertedQuestions: ApiQuestion[] = localQuestions
    .map((q, idx) => convertLocalToApi(q, domain, grade, idx))
    .filter((q): q is ApiQuestion => q !== null)
  
  // 3. 如果本地题目足够，直接返回
  if (convertedQuestions.length >= count) {
    return convertedQuestions.slice(0, count)
  }
  
  // 4. 如果不足，尝试从 API 获取补齐
  const needed = count - convertedQuestions.length
  try {
    const apiQuestions = await getApiQuestions(domain, grade, needed, seed)
    
    // 验证 API 返回的题目类型安全
    const validApiQuestions = apiQuestions
      .filter(q => q.answer && typeof q.answer === 'string' && q.answer.trim() !== '')
      .map(q => ({
        ...q,
        options: q.options && Array.isArray(q.options) ? q.options : undefined,
      }))
    
    // 合并本地和 API 题目
    return [...convertedQuestions, ...validApiQuestions].slice(0, count)
  } catch (error) {
    // API 失败，返回本地题库（即使不足）
    console.warn('API fallback failed, using local bank only:', error)
    return convertedQuestions
  }
}

/**
 * 同步版本 - 仅从本地题库获取（用于 SSR 或快速加载）
 */
export function getLocalQuestionsSync(options: QuestionEngineOptions): ApiQuestion[] {
  const { domain, grade, count = 5 } = options
  
  const localQuestions = getLocalQuestions(domain, grade)
  
  const convertedQuestions: ApiQuestion[] = localQuestions
    .map((q, idx) => convertLocalToApi(q, domain, grade, idx))
    .filter((q): q is ApiQuestion => q !== null)
  
  return convertedQuestions.slice(0, count)
}

