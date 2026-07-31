// Timeline configuration
export const HOUR_HEIGHT = 80 // pixels per hour
export const MINUTE_HEIGHT = HOUR_HEIGHT / 60 // pixels per minute
export const START_HOUR = 6 // timeline starts at 06:00
export const END_HOUR = 24 // timeline ends at 24:00 (midnight)
export const TOTAL_HOURS = END_HOUR - START_HOUR
export const TIMELINE_HEIGHT = TOTAL_HOURS * HOUR_HEIGHT

// Default colors for quick selection
export const PRESET_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
  '#6366f1', // indigo
  '#14b8a6', // teal
]
