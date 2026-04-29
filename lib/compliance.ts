import { PROHIBITED_SOURCES } from './scoring'
import type { DncStatus } from './types'

export function sourceNeedsReview(source: string) {
  const s = source.toLowerCase()
  return PROHIBITED_SOURCES.some(p => s.includes(p))
}

export function canGenerateOutreach(dnc: DncStatus) {
  return dnc === 'clear'
}
