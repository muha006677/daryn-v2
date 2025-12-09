// Ойындар үшін ортақ helper функциялар

export type GameItem = string | { q: string; a?: string; meta?: any } | any

/**
 * Безопасно сұрақ мәтінін алу
 */
export function getQ(item: GameItem): string {
  if (typeof item === 'string') {
    return item
  }
  if (item && typeof item === 'object' && 'q' in item) {
    return String(item.q ?? '')
  }
  return ''
}

/**
 * Безопасно жауап мәтінін алу
 */
export function getA(item: GameItem): string {
  if (item && typeof item === 'object' && 'a' in item) {
    return String(item.a ?? '')
  }
  return ''
}

/**
 * Meta деректерін алу
 */
export function getMeta(item: GameItem): any {
  if (item && typeof item === 'object' && 'meta' in item) {
    return item.meta
  }
  return null
}
