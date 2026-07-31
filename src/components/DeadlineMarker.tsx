'use client'

import { Deadline } from '@/types/timeline'
import { minutesToPixels } from '@/lib/timeUtils'

interface Props {
  deadline: Deadline
  onDelete: (id: string) => void
}

/** Horizontal colored line representing a deadline (within a day column) */
export default function DeadlineMarker({ deadline, onDelete }: Props) {
  const top = minutesToPixels(deadline.time)

  return (
    <div
      className="absolute left-0 right-0 flex items-center group z-10"
      style={{ top }}
    >
      {/* The line */}
      <div
        className="flex-1 h-0.5 opacity-80"
        style={{ backgroundColor: deadline.color }}
      />
      {/* Label */}
      <div
        className="absolute left-1 -translate-y-full px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap max-w-[90%] truncate"
        style={{ backgroundColor: deadline.color, color: '#fff' }}
      >
        {deadline.label}
      </div>
      {/* Delete button (visible on hover) */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(deadline.id) }}
        className="absolute right-1 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
        aria-label="刪除"
      >
        ×
      </button>
    </div>
  )
}
