'use client'

import { useState, useEffect, useCallback } from 'react'
import { TimelineEvent, Deadline, TaskBlock } from '@/types/timeline'
import { loadWeek, saveWeek, getWeekDates, getWeekKey, generateId } from '@/lib/storage'
import { TIMELINE_HEIGHT } from '@/lib/constants'
import TimeGrid from './TimeGrid'
import DayColumn from './DayColumn'
import AddEventPanel from './AddEventPanel'
import InstallButton from './InstallButton'
import DataSync from './DataSync'

export default function Timeline() {
  const [days, setDays] = useState<TimelineEvent[][]>([[], [], [], [], [], []])
  const [loaded, setLoaded] = useState(false)
  const [selectedDay, setSelectedDay] = useState(0)
  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [clipboard, setClipboard] = useState<TimelineEvent | null>(null)

  // Compute the reference date for the displayed week
  const getRefDate = useCallback(() => {
    const d = new Date()
    d.setDate(d.getDate() + weekOffset * 7)
    return d
  }, [weekOffset])

  // Load from localStorage on mount or when week changes
  useEffect(() => {
    const refDate = getRefDate()
    const key = getWeekKey(refDate)
    const data = loadWeek(key)
    setDays(data)
    setLoaded(true)
  }, [weekOffset, getRefDate])

  // Save whenever days change
  useEffect(() => {
    if (loaded) {
      const refDate = getRefDate()
      const key = getWeekKey(refDate)
      saveWeek(days, key)
    }
  }, [days, loaded, getRefDate])

  // Determine today's day index within current week
  const today = new Date()
  const weekDates = getWeekDates(getRefDate())
  const todayIndex = weekDates.findIndex(
    (d) => d.toDateString() === today.toDateString()
  )

  // Auto-select today on initial load
  useEffect(() => {
    if (todayIndex >= 0 && weekOffset === 0) {
      setSelectedDay(todayIndex)
    }
  }, [todayIndex, weekOffset])

  // Keyboard shortcuts: Ctrl+C to copy, Ctrl+V to paste
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'c' && selectedEventId) {
        // Find the selected event across all days
        for (const dayEvents of days) {
          const event = dayEvents.find((ev) => ev.id === selectedEventId)
          if (event) {
            setClipboard(event)
            break
          }
        }
      }
      if (e.ctrlKey && e.key === 'v' && clipboard) {
        // Paste to currently selected day with a new ID
        const newEvent = { ...clipboard, id: generateId() }
        setDays((prev) => {
          const next = [...prev]
          next[selectedDay] = [...next[selectedDay], newEvent]
          return next
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedEventId, clipboard, days, selectedDay])

  // Deselect event when clicking empty area
  const handleDeselectEvent = useCallback(() => {
    setSelectedEventId(null)
  }, [])

  const handleSelectEvent = useCallback((id: string) => {
    setSelectedEventId(id)
  }, [])

  const handleAddDeadline = useCallback((dayIndex: number, deadline: Deadline) => {
    setDays((prev) => {
      const next = [...prev]
      next[dayIndex] = [...next[dayIndex], deadline]
      return next
    })
  }, [])

  const handleAddTask = useCallback((dayIndex: number, task: TaskBlock) => {
    setDays((prev) => {
      const next = [...prev]
      next[dayIndex] = [...next[dayIndex], task]
      return next
    })
  }, [])

  const handleUpdateTask = useCallback((dayIndex: number, id: string, updates: Partial<TaskBlock>) => {
    setDays((prev) => {
      const next = [...prev]
      next[dayIndex] = next[dayIndex].map((e) => {
        if (e.id === id && e.type === 'task') {
          return { ...e, ...updates } as TaskBlock
        }
        return e
      })
      return next
    })
  }, [])

  const handleDelete = useCallback((dayIndex: number, id: string) => {
    setDays((prev) => {
      const next = [...prev]
      next[dayIndex] = next[dayIndex].filter((e) => e.id !== id)
      return next
    })
  }, [])

  if (!loaded) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        載入中...
      </div>
    )
  }

  const formatDateLabel = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`

  return (
    <div className="h-screen flex">
      {/* Left sidebar */}
      <aside className="w-64 shrink-0 p-4 overflow-y-auto border-r border-gray-700/50 flex flex-col">
        <h1 className="text-xl font-bold text-white mb-2">📅 週時間軸</h1>

        {/* Week navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            className="text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-700"
          >
            ←
          </button>
          <span className="text-sm text-gray-300">
            {formatDateLabel(weekDates[0])} ~ {formatDateLabel(weekDates[5])}
          </span>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            className="text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-700"
          >
            →
          </button>
        </div>

        {weekOffset !== 0 && (
          <button
            onClick={() => setWeekOffset(0)}
            className="text-xs text-blue-400 hover:text-blue-300 mb-3"
          >
            回到本週
          </button>
        )}

        <AddEventPanel
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          onAddDeadline={handleAddDeadline}
          onAddTask={handleAddTask}
        />

        {/* Install as desktop app */}
        <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-3">
          {clipboard && (
            <div className="text-xs text-green-400 bg-green-900/30 rounded px-2 py-1.5">
              ✂ 已複製：{clipboard.type === 'task' ? (clipboard as TaskBlock).label : (clipboard as Deadline).label}
              <br />
              <span className="text-green-300/70">點選目標天 → Ctrl+V 貼上</span>
            </div>
          )}
          <DataSync days={days} onImport={(imported) => setDays(imported)} />
          <InstallButton />
        </div>
      </aside>

      {/* Main weekly timeline area */}
      <main className="flex-1 overflow-y-auto timeline-scroll pt-1">
        <div className="flex h-full" style={{ minHeight: TIMELINE_HEIGHT + 60 }}>
          {/* Time labels */}
          <TimeGrid />

          {/* Day columns */}
          {weekDates.map((date, i) => (
            <DayColumn
              key={i}
              dayIndex={i}
              dayLabel={`週${['一', '二', '三', '四', '五', '六'][i]}`}
              dateLabel={formatDateLabel(date)}
              events={days[i]}
              isToday={i === todayIndex}
              isSelected={i === selectedDay}
              selectedEventId={selectedEventId}
              onSelect={() => { setSelectedDay(i); handleDeselectEvent() }}
              onSelectEvent={handleSelectEvent}
              onUpdateTask={(id, updates) => handleUpdateTask(i, id, updates)}
              onDelete={(id) => handleDelete(i, id)}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
