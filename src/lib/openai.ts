import OpenAI from 'openai'

let client: OpenAI | null = null

export function getOpenAIClient(): OpenAI {
  if (client) {
    return client
  }

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY орта айнымалысы табылмады. .env.local файлына OPENAI_API_KEY=sk-... қосыңыз.')
  }

  client = new OpenAI({ apiKey })
  return client
}

export function getModelName(): string {
  return process.env.OPENAI_MODEL || 'gpt-4o-mini'
}
