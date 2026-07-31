'use client'

import { useRef } from 'react'
import { TimelineEvent } from '@/types/timeline'
import { getWeekKey } from '@/lib/storage'

interface Props {
  days: TimelineEvent[][]
  onImport: (days: TimelineEvent[][]) => void
}

export default function DataSync({ days, onImport }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const exportData = {
      version: 1,
      weekKey: getWeekKey(),
      exportedAt: new Date().toISOString(),
      days,
    }
    const json = JSON.stringify(exportData, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `timeline-${getWeekKey()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        if (data.days && Array.isArray(data.days)) {
          // Ensure 6 days
          while (data.days.length < 6) data.days.push([])
          onImport(data.days.slice(0, 6))
        } else {
          alert('檔案格式錯誤：找不到 days 資料')
        }
      } catch {
        alert('無法讀取檔案，請確認是 JSON 格式')
      }
    }
    reader.readAsText(file)

    // Reset input so same file can be selected again
    e.target.value = ''
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          onClick={handleExport}
          className="flex-1 py-1.5 px-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          匯出
        </button>
        <button
          onClick={handleImport}
          className="flex-1 py-1.5 px-2 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m4-8l-4-4m0 0l-4 4m4-4v12" />
          </svg>
          匯入
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
