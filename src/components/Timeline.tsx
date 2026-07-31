'use client'

import { useState, useEffect, useCallback } from 'react'
import { TimelineEvent, Deadline, TaskBlock } from '@/types/timeline'
import { loadTimeline, saveTimeline } from '@/lib/storage'
import { TIMELINE_HEIGHT } from '@/lib/constants'
import TimeGrid from './TimeGrid'
import DeadlineMarker from './DeadlineMarker'
import TaskBlockItem from './TaskBlockItem'
import AddEventPanel from './AddEventPanel'

export default function Timeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const data = loadTimeline()
    setEvents(data)
    setLoaded(true)
  }, [])

  // Save whenever events change
  useEffect(() => {
    if (loaded) {
      saveTimeline(events)
    }
  }, [events, loaded])

  const deadlines = events.filter((e): e is Deadline => e.type === 'deadline')
  const tasks = events.filter((e): e is TaskBlock => e.type === 'task')

  const handleAddDeadline = useCallback((deadline: Deadline) => {
    setEvents((prev) => [...prev, deadline])
  }, [])

  const handleAddTask = useCallback((task: TaskBlock) => {
    setEvents((prev) => [...prev, task])
  }, [])

  const handleUpdateTask = useCallback((id: string, updates: Partial<TaskBlock>) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === id && e.type === 'task') {
          return { ...e, ...updates } as TaskBlock
        }
        return e
      })
    )
  }, [])

  const handleDelete = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }, [])

  if (!loaded) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        載入中...
      </div>
    )
  }

  return (
    <div className="h-screen flex">
      {/* Left sidebar: Add event panel */}
      <aside className="w-72 shrink-0 p-4 overflow-y-auto border-r border-gray-700/50">
        <h1 className="text-2xl font-bold text-white mb-6">
          📅 日時間軸
        </h1>
        <AddEventPanel
          onAddDeadline={handleAddDeadline}
          onAddTask={handleAddTask}
        />

        {/* Event list summary */}
        {events.length > 0 && (
          <div className="mt-6 space-y-2">
            <h3 className="text-sm text-gray-400 font-medium">今日事件 ({events.length})</h3>
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-2 text-sm text-gray-300"
              >
                <div
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{ backgroundColor: event.color }}
                />
                <span className="truncate">{event.label}</span>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Main timeline area */}
      <main className="flex-1 overflow-y-auto timeline-scroll p-4">
        <div
          className="relative"
          style={{ height: TIMELINE_HEIGHT + 40 }}
        >
          {/* Time grid (background) */}
          <TimeGrid />

          {/* Deadline markers */}
          {deadlines.map((d) => (
            <DeadlineMarker
              key={d.id}
              deadline={d}
              onDelete={handleDelete}
            />
          ))}

          {/* Task blocks */}
          {tasks.map((t) => (
            <TaskBlockItem
              key={t.id}
              task={t}
              onUpdate={handleUpdateTask}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
