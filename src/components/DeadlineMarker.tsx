'use client'

import { Deadline } from '@/types/timeline'
import { minutesToPixels } from '@/lib/timeUtils'

interface Props {
  deadline: Deadline
  onDelete: (id: string) => void
}

/** Horizontal colored line representing a deadline */
export default function DeadlineMarker({ deadline, onDelete }: Props) {
  const top = minutesToPixels(deadline.time)

  return (
    <div
      className="absolute left-16 right-0 flex items-center group z-10"
      style={{ top }}
    >
      {/* The line */}
      <div
        className="flex-1 h-0.5 opacity-80"
        style={{ backgroundColor: deadline.color }}
      />
      {/* Label */}
      <div
        className="absolute left-2 -translate-y-full px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap"
        style={{ backgroundColor: deadline.color, color: '#fff' }}
      >
        {deadline.label}
      </div>
      {/* Delete button (visible on hover) */}
      <button
        onClick={() => onDelete(deadline.id)}
        className="absolute right-2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
        aria-label="刪除"
      >
        ×
      </button>
    </div>
  )
}
