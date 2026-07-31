import { TimelineData, TimelineEvent } from '@/types/timeline'

const STORAGE_KEY = 'timeline-data'

function getTodayKey(): string {
  const now = new Date()
  return now.toISOString().split('T')[0]
}

export function loadTimeline(date?: string): TimelineEvent[] {
  if (typeof window === 'undefined') return []
  const key = date || getTodayKey()
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}-${key}`)
    if (!raw) return []
    const data: TimelineData = JSON.parse(raw)
    return data.events
  } catch {
    return []
  }
}

export function saveTimeline(events: TimelineEvent[], date?: string): void {
  if (typeof window === 'undefined') return
  const key = date || getTodayKey()
  const data: TimelineData = { date: key, events }
  localStorage.setItem(`${STORAGE_KEY}-${key}`, JSON.stringify(data))
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
