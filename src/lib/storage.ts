import { TimelineEvent } from '@/types/timeline'

const STORAGE_KEY = 'timeline-week'

export interface WeekData {
  weekKey: string // e.g. "2026-W31"
  days: TimelineEvent[][] // index 0=Mon, 1=Tue, ... 5=Sat
}

/** Get ISO week key for current week (or a given date) */
export function getWeekKey(date?: Date): string {
  const d = date || new Date()
  // Get Thursday of current week to determine ISO week number
  const thursday = new Date(d)
  thursday.setDate(d.getDate() - ((d.getDay() + 6) % 7) + 3)
  const yearStart = new Date(thursday.getFullYear(), 0, 1)
  const weekNum = Math.ceil(((thursday.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${thursday.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`
}

/** Get dates (Mon-Sat) for the current week */
export function getWeekDates(date?: Date): Date[] {
  const d = date || new Date()
  const dayOfWeek = d.getDay() // 0=Sun, 1=Mon, ...
  const monday = new Date(d)
  monday.setDate(d.getDate() - ((dayOfWeek + 6) % 7))
  monday.setHours(0, 0, 0, 0)

  const dates: Date[] = []
  for (let i = 0; i < 6; i++) {
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)
    dates.push(day)
  }
  return dates
}

export function loadWeek(weekKey?: string): TimelineEvent[][] {
  if (typeof window === 'undefined') return [[], [], [], [], [], []]
  const key = weekKey || getWeekKey()
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}-${key}`)
    if (!raw) return [[], [], [], [], [], []]
    const data: WeekData = JSON.parse(raw)
    // Ensure we always have 6 days
    while (data.days.length < 6) data.days.push([])
    return data.days
  } catch {
    return [[], [], [], [], [], []]
  }
}

export function saveWeek(days: TimelineEvent[][], weekKey?: string): void {
  if (typeof window === 'undefined') return
  const key = weekKey || getWeekKey()
  const data: WeekData = { weekKey: key, days }
  localStorage.setItem(`${STORAGE_KEY}-${key}`, JSON.stringify(data))
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
