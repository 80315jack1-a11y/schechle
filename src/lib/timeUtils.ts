import { START_HOUR, MINUTE_HEIGHT } from './constants'

/** Convert minutes from midnight to pixel offset from timeline top */
export function minutesToPixels(minutes: number): number {
  const startMinutes = START_HOUR * 60
  return (minutes - startMinutes) * MINUTE_HEIGHT
}

/** Convert pixel offset from timeline top to minutes from midnight */
export function pixelsToMinutes(pixels: number): number {
  const startMinutes = START_HOUR * 60
  return Math.round(pixels / MINUTE_HEIGHT) + startMinutes
}

/** Snap minutes to nearest 5-minute interval */
export function snapToGrid(minutes: number, gridSize: number = 5): number {
  return Math.round(minutes / gridSize) * gridSize
}

/** Format minutes from midnight to HH:MM string */
export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

/** Parse HH:MM string to minutes from midnight */
export function parseTime(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + (m || 0)
}
