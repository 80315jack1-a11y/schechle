'use client'

import { TimelineEvent, Deadline, TaskBlock } from '@/types/timeline'
import { START_HOUR, END_HOUR, HOUR_HEIGHT, TIMELINE_HEIGHT } from '@/lib/constants'
import DeadlineMarker from './DeadlineMarker'
import TaskBlockItem from './TaskBlockItem'

interface Props {
  dayIndex: number
  dayLabel: string
  dateLabel: string
  events: TimelineEvent[]
  isToday: boolean
  isSelected: boolean
  onSelect: () => void
  onUpdateTask: (id: string, updates: Partial<TaskBlock>) => void
  onDelete: (id: string) => void
}

const DAY_NAMES = ['一', '二', '三', '四', '五', '六']

export default function DayColumn({
  dayIndex,
  dayLabel,
  dateLabel,
  events,
  isToday,
  isSelected,
  onSelect,
  onUpdateTask,
  onDelete,
}: Props) {
  const deadlines = events.filter((e): e is Deadline => e.type === 'deadline')
  const tasks = events.filter((e): e is TaskBlock => e.type === 'task')

  const hours = []
  for (let h = START_HOUR; h <= END_HOUR; h++) {
    hours.push(h)
  }

  return (
    <div
      className={`flex-1 min-w-0 flex flex-col border-r border-gray-700/30 last:border-r-0 cursor-pointer ${
        isSelected ? 'bg-gray-800/50' : ''
      }`}
      onClick={onSelect}
    >
      {/* Day header */}
      <div
        className={`sticky top-0 z-20 text-center py-2 border-b border-gray-700/50 ${
          isToday ? 'bg-blue-900/40' : 'bg-gray-900/95'
        }`}
      >
        <div className={`text-sm font-medium ${isToday ? 'text-blue-400' : 'text-gray-300'}`}>
          週{DAY_NAMES[dayIndex]}
        </div>
        <div className={`text-xs ${isToday ? 'text-blue-300' : 'text-gray-500'}`}>
          {dateLabel}
        </div>
      </div>

      {/* Timeline body */}
      <div className="relative flex-1" style={{ height: TIMELINE_HEIGHT }}>
        {/* Hour grid lines */}
        {hours.map((hour) => (
          <div
            key={hour}
            className="absolute left-0 right-0 border-t border-gray-700/30"
            style={{ top: (hour - START_HOUR) * HOUR_HEIGHT }}
          />
        ))}

        {/* Deadline markers */}
        {deadlines.map((d) => (
          <DeadlineMarker key={d.id} deadline={d} onDelete={onDelete} />
        ))}

        {/* Task blocks */}
        {tasks.map((t) => (
          <TaskBlockItem
            key={t.id}
            task={t}
            onUpdate={onUpdateTask}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}
