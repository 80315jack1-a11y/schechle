'use client'

import { useRef, useCallback } from 'react'
import { TaskBlock } from '@/types/timeline'
import { minutesToPixels, formatTime, snapToGrid, pixelsToMinutes } from '@/lib/timeUtils'
import { MINUTE_HEIGHT, START_HOUR, END_HOUR } from '@/lib/constants'

interface Props {
  task: TaskBlock
  isSelected?: boolean
  onSelect?: (id: string) => void
  onUpdate: (id: string, updates: Partial<TaskBlock>) => void
  onDelete: (id: string) => void
}

/** A draggable, resizable colored block within a day column */
export default function TaskBlockItem({ task, isSelected, onSelect, onUpdate, onDelete }: Props) {
  const blockRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const isResizing = useRef(false)

  const top = minutesToPixels(task.startTime)
  const height = task.duration * MINUTE_HEIGHT

  const minMinutes = START_HOUR * 60
  const maxMinutes = END_HOUR * 60

  // Drag to move
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isResizing.current) return
    e.preventDefault()
    e.stopPropagation()

    // Select this task on click
    if (onSelect) onSelect(task.id)

    isDragging.current = true

    const startY = e.clientY
    const startTop = top

    const handleMouseMove = (ev: MouseEvent) => {
      if (!isDragging.current) return
      const deltaY = ev.clientY - startY
      const newPixelTop = startTop + deltaY
      let newStartMinutes = snapToGrid(pixelsToMinutes(newPixelTop))

      newStartMinutes = Math.max(minMinutes, newStartMinutes)
      newStartMinutes = Math.min(maxMinutes - task.duration, newStartMinutes)

      onUpdate(task.id, { startTime: newStartMinutes })
    }

    const handleMouseUp = () => {
      isDragging.current = false
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [top, task.id, task.duration, onUpdate, onSelect, minMinutes, maxMinutes])

  // Drag bottom edge to resize
  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    isResizing.current = true

    const startY = e.clientY
    const startDuration = task.duration

    const handleMouseMove = (ev: MouseEvent) => {
      if (!isResizing.current) return
      const deltaY = ev.clientY - startY
      const deltaMinutes = deltaY / MINUTE_HEIGHT
      let newDuration = snapToGrid(startDuration + deltaMinutes)

      newDuration = Math.max(10, newDuration)
      newDuration = Math.min(maxMinutes - task.startTime, newDuration)

      onUpdate(task.id, { duration: newDuration })
    }

    const handleMouseUp = () => {
      isResizing.current = false
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [task.id, task.duration, task.startTime, onUpdate, maxMinutes])

  return (
    <div
      ref={blockRef}
      className={`absolute left-1 right-1 rounded-md shadow-lg cursor-grab active:cursor-grabbing group select-none overflow-hidden z-10 ${
        isSelected ? 'ring-2 ring-white ring-offset-1 ring-offset-transparent' : ''
      }`}
      style={{
        top,
        height: Math.max(height, 18),
        backgroundColor: task.color,
        opacity: 0.9,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Content */}
      <div className="px-2 py-0.5 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between gap-1">
          <span className="text-white font-medium text-xs truncate">
            {task.label}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(task.id) }}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-white/80 hover:text-white text-sm leading-none shrink-0"
            aria-label="刪除"
          >
            ×
          </button>
        </div>
        {height > 28 && (
          <span className="text-white/70 text-[10px]">
            {formatTime(task.startTime)} – {formatTime(task.startTime + task.duration)}
          </span>
        )}
      </div>

      {/* Resize handle at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
        onMouseDown={handleResizeMouseDown}
      />
    </div>
  )
}
