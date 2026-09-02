export type CalendarEvent = {
  id: string
  day: number
  start: number
  end: number
  title: string
}

export type Alternative = {
  id: string
  title: string
  tradeoff: string
  highlightEventIds: string[]
  previewEvents: CalendarEvent[]
  apply: (events: CalendarEvent[]) => CalendarEvent[]
}

export type Observation = {
  id: string
  category: string
  title: string
  message: string
  alternatives: Alternative[]
}

export type ReviewStatus = 'idle' | 'kept' | 'exploring' | 'resolved'

export type ReviewPhase = 'idle' | 'loading' | 'done' | 'error'

export type ReviewResult = {
  phase: ReviewPhase
  observations: Observation[]
}
