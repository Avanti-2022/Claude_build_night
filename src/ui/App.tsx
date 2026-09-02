import { useState } from 'react'
import WeeklyCalendar from './components/calendar/WeeklyCalendar'
import CompassSidebar from './components/sidebar/CompassSidebar'
import { INITIAL_EVENTS } from './mockData'
import { buildWeekInput, toUiObservations } from './intelligenceAdapter'
import type { CalendarEvent, ReviewResult } from './types'
import type { Observation as IntelligenceObservation } from '../intelligence/types'

type Preview = {
  highlightIds: string[]
  ghostEvents: CalendarEvent[]
}

const emptyPreview: Preview = { highlightIds: [], ghostEvents: [] }

const DEFAULT_PRIORITIES = ['Ship Compass MVP', 'Exercise 3x this week', 'Finish client proposal']

export default function App() {
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS)
  const [preview, setPreview] = useState<Preview>(emptyPreview)
  const [priorities, setPriorities] = useState<string[]>(DEFAULT_PRIORITIES)
  const [wakeTime, setWakeTime] = useState('07:00')
  const [sleepTime, setSleepTime] = useState('23:00')
  const [review, setReview] = useState<ReviewResult>({ phase: 'idle', observations: [] })

  const handleRunCompass = async () => {
    setReview({ phase: 'loading', observations: [] })

    try {
      const input = buildWeekInput({ events, priorities, wakeTime, sleepTime })

      const response = await fetch('/api/review-week', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        throw new Error(`review-week request failed with status ${response.status}`)
      }

      const data = (await response.json()) as { observations: IntelligenceObservation[] }
      setReview({ phase: 'done', observations: toUiObservations(data.observations) })
    } catch {
      setReview({ phase: 'error', observations: [] })
    }
  }

  return (
    <div className="app-layout">
      <main className="main-content">
        <WeeklyCalendar events={events} highlightIds={preview.highlightIds} ghostEvents={preview.ghostEvents} />
      </main>
      <CompassSidebar
        priorities={priorities}
        onPrioritiesChange={setPriorities}
        wakeTime={wakeTime}
        sleepTime={sleepTime}
        onWakeTimeChange={setWakeTime}
        onSleepTimeChange={setSleepTime}
        review={review}
        onRunCompass={handleRunCompass}
        onPreview={(highlightIds, ghostEvents) => setPreview({ highlightIds, ghostEvents })}
        onCancelPreview={() => setPreview(emptyPreview)}
        onApply={(apply) => {
          setEvents((current) => apply(current))
          setPreview(emptyPreview)
        }}
      />
    </div>
  )
}
