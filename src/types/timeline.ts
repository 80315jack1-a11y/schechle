export interface Deadline {
  id: string
  type: 'deadline'
  label: string
  time: number // minutes from midnight, e.g. 21*60 = 1260 for 21:00
  color: string
}

export interface TaskBlock {
  id: string
  type: 'task'
  label: string
  startTime: number // minutes from midnight
  duration: number  // duration in minutes
  color: string
}

export type TimelineEvent = Deadline | TaskBlock

export interface TimelineData {
  date: string // YYYY-MM-DD
  events: TimelineEvent[]
}
