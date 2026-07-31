'use client'

import { START_HOUR, END_HOUR, HOUR_HEIGHT } from '@/lib/constants'

/** Renders the vertical time axis with hour labels and grid lines */
export default function TimeGrid() {
  const hours = []
  for (let h = START_HOUR; h <= END_HOUR; h++) {
    hours.push(h)
  }

  return (
    <>
      {hours.map((hour) => (
        <div
          key={hour}
          className="absolute left-0 right-0 flex items-start"
          style={{ top: (hour - START_HOUR) * HOUR_HEIGHT }}
        >
          {/* Hour label */}
          <div className="w-16 shrink-0 text-right pr-3 -translate-y-1/2 text-sm text-gray-400 select-none">
            {hour.toString().padStart(2, '0')}:00
          </div>
          {/* Grid line */}
          <div className="flex-1 border-t border-gray-700/50" />
        </div>
      ))}
    </>
  )
}
