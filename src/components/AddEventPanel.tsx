'use client'

import { useState } from 'react'
import { Deadline, TaskBlock } from '@/types/timeline'
import { generateId } from '@/lib/storage'
import { PRESET_COLORS } from '@/lib/constants'
import { parseTime } from '@/lib/timeUtils'

interface Props {
  onAddDeadline: (deadline: Deadline) => void
  onAddTask: (task: TaskBlock) => void
}

export default function AddEventPanel({ onAddDeadline, onAddTask }: Props) {
  const [mode, setMode] = useState<'deadline' | 'task'>('task')
  const [label, setLabel] = useState('')
  const [time, setTime] = useState('21:00')
  const [startTime, setStartTime] = useState('19:00')
  const [duration, setDuration] = useState('60')
  const [color, setColor] = useState(PRESET_COLORS[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!label.trim()) return

    if (mode === 'deadline') {
      onAddDeadline({
        id: generateId(),
        type: 'deadline',
        label: label.trim(),
        time: parseTime(time),
        color,
      })
    } else {
      onAddTask({
        id: generateId(),
        type: 'task',
        label: label.trim(),
        startTime: parseTime(startTime),
        duration: parseInt(duration) || 60,
        color,
      })
    }

    setLabel('')
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4 space-y-4">
      <h2 className="text-lg font-semibold text-white">新增事件</h2>

      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('task')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            mode === 'task'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          活動區塊
        </button>
        <button
          onClick={() => setMode('deadline')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
            mode === 'deadline'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          固定時間線
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Label */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">名稱</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={mode === 'task' ? '例如：英文、跑步' : '例如：圖書館關門'}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Time inputs */}
        {mode === 'deadline' ? (
          <div>
            <label className="block text-sm text-gray-400 mb-1">時間</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm text-gray-400 mb-1">開始時間</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">時長（分鐘）</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="10"
                max="480"
                step="5"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Color picker */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">顏色</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full transition-transform ${
                  color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-gray-800' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
                aria-label={`選擇顏色 ${c}`}
              />
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors"
        >
          新增{mode === 'task' ? '活動' : '時間線'}
        </button>
      </form>
    </div>
  )
}
