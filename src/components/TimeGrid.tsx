'use client'

import { START_HOUR, END_HOUR, HOUR_HEIGHT } from '@/lib/constants'

/** Renders the time labels on the left side */
export default function TimeGrid() {
  const hours = []
  for (let h = START_HOUR; h <= END_HOUR; h++) {
    hours.push(h)
  }

  return (
    <div className="w-14 shrink-0 relative">
      {hours.map((hour) => (
        <div
          key={hour}
          className="absolute left-0 right-0 text-right pr-2 -translate-y-1/2 text-xs text-gray-400 select-none"
          style={{ top: (hour - START_HOUR) * HOUR_HEIGHT }}
        >
          {hour.toString().padStart(2, '0')}:00
        </div>
      ))}
    </div>
  )
}
