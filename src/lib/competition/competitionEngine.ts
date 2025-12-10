// 30题竞赛模式 - 题库引擎
import type { Question } from '@/app/api/generate-question/route'
import type { Question as LocalQuestion } from '../gameBanks'
import { getMathCompetitionQuestions } from './mathLocalBank'
import { getEnglishCompetitionQuestions } from './englishLocalBank'
import { getKazakhLangCompetitionQuestions } from './kazakhLangLocalBank'
import { getKazakhLitCompetitionQuestions } from './kazakhLitLocalBank'
import { getNaturalScienceCompetitionQuestions } from './naturalScienceLocalBank'
import { getWorldStudiesCompetitionQuestions } from './worldStudiesLocalBank'

export type Subject = 
  | 'math'
  | 'english'
  | 'kazakh_lang'
  | 'kazakh_lit'
  | 'natural_science'
  | 'world_studies'

export type CompetitionQuestion = Question & {
  subject: Subject
  subjectName: string
}

export interface SubjectConfig {
  subject: Subject
  name: string
  count: number
}

export interface CompetitionConfig {
  totalQuestions: number
  subjects: SubjectConfig[]
}

// 默认配置：每科5题，共30题
export const DEFAULT_COMPETITION_CONFIG: CompetitionConfig = {
  totalQuestions: 30,
  subjects: [
    { subject: 'math', name: 'Математика', count: 5 },
    { subject: 'english', name: 'English', count: 5 },
    { subject: 'kazakh_lang', name: 'Қазақ тілі', count: 5 },
    { subject: 'kazakh_lit', name: 'Қазақ әдебиеті', count: 5 },
    { subject: 'natural_science', name: 'Жаратылыстану', count: 5 },
    { subject: 'world_studies', name: 'Әлемтану', count: 5 },
  ],
}

// 从本地题库获取题目
function getSubjectQuestions(subject: Subject, grade: number): LocalQuestion[] {
  switch (subject) {
    case 'math':
      return getMathCompetitionQuestions(grade)
    case 'english':
      return getEnglishCompetitionQuestions(grade)
    case 'kazakh_lang':
      return getKazakhLangCompetitionQuestions(grade)
    case 'kazakh_lit':
      return getKazakhLitCompetitionQuestions(grade)
    case 'natural_science':
      return getNaturalScienceCompetitionQuestions(grade)
    case 'world_studies':
      return getWorldStudiesCompetitionQuestions(grade)
    default:
      return []
  }
}

// 从数组中随机选择指定数量的元素
function randomSelect<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

// 生成竞赛题目
export function generateCompetitionQuestions(
  grade: number,
  config: CompetitionConfig = DEFAULT_COMPETITION_CONFIG
): CompetitionQuestion[] {
  const allQuestions: CompetitionQuestion[] = []
  const warnings: string[] = []

  // 从每科抽取指定数量的题目
  for (const subjectConfig of config.subjects) {
    const subjectQuestions = getSubjectQuestions(subjectConfig.subject, grade)
    
    if (subjectQuestions.length < subjectConfig.count) {
      warnings.push(
        `${subjectConfig.name} 题库不足：需要 ${subjectConfig.count} 题，但只有 ${subjectQuestions.length} 题`
      )
      console.warn(
        `[Competition] ${subjectConfig.name} 题库不足：需要 ${subjectConfig.count} 题，但只有 ${subjectQuestions.length} 题`
      )
    }

    const selected = randomSelect(subjectQuestions, subjectConfig.count)
    
    // 转换为 MCQ 格式并添加学科信息
    const converted = selected.map(q => {
      // 解析题目文本，提取 prompt 和 options
      const lines = q.q.split('\n').map(l => l.trim()).filter(l => l.length > 0)
      const prompt = lines[0] || q.q
      const options: string[] = []
      
      // 提取选项（A) ... B) ... 等格式）
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i]
        const match = line.match(/^[A-D]\)\s*(.+)$/)
        if (match) {
          options.push(match[1])
        }
      }

      // 确保 options 和 answer 不为空
      const answer = (q.a || '').trim().toUpperCase()
      const finalOptions = options.length > 0 ? options : ['A', 'B', 'C', 'D'].slice(0, 4)

      const result: CompetitionQuestion = {
        id: `comp-${subjectConfig.subject}-${Date.now()}-${Math.random()}`,
        domain: subjectConfig.subject,
        grade: grade,
        type: 'mcq',
        prompt,
        options: finalOptions,
        answer: answer,
        explanation: q.meta?.explanation,
        meta: q.meta,
        subject: subjectConfig.subject,
        subjectName: subjectConfig.name,
      }
      return result
    })

    allQuestions.push(...converted)
  }

  // 如果总题数不足，从其他科目补足
  if (allQuestions.length < config.totalQuestions) {
    const needed = config.totalQuestions - allQuestions.length
    warnings.push(`总题数不足，需要补充 ${needed} 题`)
    console.warn(`[Competition] 总题数不足，需要补充 ${needed} 题`)

    // 从所有科目中随机抽取补充
    const allSubjectQuestions: LocalQuestion[] = []
    for (const subjectConfig of config.subjects) {
      allSubjectQuestions.push(...getSubjectQuestions(subjectConfig.subject, grade))
    }

    const additional = randomSelect(allSubjectQuestions, needed)
    additional.forEach(q => {
      const lines = q.q.split('\n').map(l => l.trim()).filter(l => l.length > 0)
      const prompt = lines[0] || q.q
      const options: string[] = []
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i]
        const match = line.match(/^[A-D]\)\s*(.+)$/)
        if (match) {
          options.push(match[1])
        }
      }

      const answer = (q.a || '').trim().toUpperCase()
      const finalOptions = options.length > 0 ? options : ['A', 'B', 'C', 'D'].slice(0, 4)

      const result: CompetitionQuestion = {
        id: `comp-math-${Date.now()}-${Math.random()}`,
        domain: 'math',
        grade: grade,
        type: 'mcq',
        prompt,
        options: finalOptions,
        answer: answer,
        explanation: q.meta?.explanation,
        meta: q.meta,
        subject: 'math', // 默认归类
        subjectName: 'Математика',
      }
      allQuestions.push(result)
    })
  }

  // 随机打乱顺序
  const shuffled = allQuestions.sort(() => Math.random() - 0.5)

  return shuffled.slice(0, config.totalQuestions)
}

