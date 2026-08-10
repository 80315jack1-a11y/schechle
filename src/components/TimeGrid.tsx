'use client'

import { START_HOUR, END_HOUR, HOUR_HEIGHT, TIMELINE_HEIGHT } from '@/lib/constants'

/** Renders the time labels on the left side */
export default function TimeGrid() {
  const hours = []
  for (let h = START_HOUR; h <= END_HOUR; h++) {
    hours.push(h)
  }

  return (
    <div className="w-14 shrink-0 flex flex-col">
      {/* Spacer matching DayColumn sticky header height */}
      <div className="sticky top-0 z-20 py-2 border-b border-transparent">
        <div className="text-sm">&nbsp;</div>
        <div className="text-xs">&nbsp;</div>
      </div>

      {/* Time labels container */}
      <div className="relative flex-1" style={{ height: TIMELINE_HEIGHT }}>
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
    </div>
  )
}
