import type {
  CalendarEvent as IntelligenceCalendarEvent,
  Observation as IntelligenceObservation,
  Priority,
  UserBoundaries,
  WeekInput,
} from '../intelligence/types'
import type { Alternative, CalendarEvent, Observation } from './types'

const DEFAULT_MINIMUM_BREAK_MINUTES = 15

function startOfCurrentWeek(): Date {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysSinceMonday)
  monday.setHours(0, 0, 0, 0)
  return monday
}

function toIsoDateTime(weekStart: Date, dayIndex: number, decimalHour: number): string {
  const hours = Math.floor(decimalHour)
  const minutes = Math.round((decimalHour - hours) * 60)
  const date = new Date(weekStart)
  date.setDate(weekStart.getDate() + dayIndex)
  date.setHours(hours, minutes, 0, 0)
  return date.toISOString()
}

function toIntelligenceEvent(event: CalendarEvent, weekStart: Date): IntelligenceCalendarEvent {
  return {
    id: event.id,
    title: event.title,
    start: toIsoDateTime(weekStart, event.day, event.start),
    end: toIsoDateTime(weekStart, event.day, event.end),
  }
}

function toIntelligencePriorities(priorities: string[]): Priority[] {
  return priorities
    .map((title, index) => ({ id: `priority-${index}`, title: title.trim(), importance: 'high' as const }))
    .filter((priority) => priority.title.length > 0)
}

function toIntelligenceBoundaries(wakeTime: string, sleepTime: string): UserBoundaries {
  return {
    wakeTime,
    sleepTime,
    minimumBreakMinutes: DEFAULT_MINIMUM_BREAK_MINUTES,
  }
}

export type BuildWeekInputParams = {
  events: CalendarEvent[]
  priorities: string[]
  wakeTime: string
  sleepTime: string
}

export function buildWeekInput({ events, priorities, wakeTime, sleepTime }: BuildWeekInputParams): WeekInput {
  const weekStart = startOfCurrentWeek()

  return {
    events: events.map((event) => toIntelligenceEvent(event, weekStart)),
    priorities: toIntelligencePriorities(priorities),
    boundaries: toIntelligenceBoundaries(wakeTime, sleepTime),
  }
}

const CATEGORY_BY_FINDING_TYPE: Record<string, string> = {
  OVERLOAD: 'Workload',
  MISSING_BREAK: 'Breaks',
  BOUNDARY_VIOLATION: 'Sleep',
  MISSING_PRIORITY: 'Priorities',
  FRAGMENTATION: 'Focus',
}

function categoryFor(observation: IntelligenceObservation): string {
  const primaryType = observation.findingTypes[0]
  return (primaryType && CATEGORY_BY_FINDING_TYPE[primaryType]) || 'Reflection'
}

function alternativesFor(observation: IntelligenceObservation, id: string): Alternative[] {
  if (!observation.actions.includes('explore_suggestion')) {
    return []
  }

  return [
    {
      id: `${id}-suggestion`,
      title: 'Explore this suggestion',
      tradeoff: 'Compass flagged this as worth a closer look, based on your current plan.',
      highlightEventIds: [],
      previewEvents: [],
      apply: (events) => events,
    },
  ]
}

export function toUiObservations(observations: IntelligenceObservation[]): Observation[] {
  return observations.map((observation, index) => {
    const id = `observation-${index}`
    return {
      id,
      category: categoryFor(observation),
      title: observation.title,
      message: observation.message,
      alternatives: alternativesFor(observation, id),
    }
  })
}
