import { useState } from 'react'
import WeeklyCalendar from './components/calendar/WeeklyCalendar'
import CompassSidebar from './components/sidebar/CompassSidebar'
import { INITIAL_EVENTS } from './mockData'
import type { CalendarEvent } from './types'

type Preview = {
  highlightIds: string[]
  ghostEvents: CalendarEvent[]
}

const emptyPreview: Preview = { highlightIds: [], ghostEvents: [] }

export default function App() {
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS)
  const [preview, setPreview] = useState<Preview>(emptyPreview)

  return (
    <div className="app-layout">
      <CompassSidebar
        onPreview={(highlightIds, ghostEvents) => setPreview({ highlightIds, ghostEvents })}
        onCancelPreview={() => setPreview(emptyPreview)}
        onApply={(apply) => {
          setEvents((current) => apply(current))
          setPreview(emptyPreview)
        }}
      />
      <main className="main-content">
        <WeeklyCalendar events={events} highlightIds={preview.highlightIds} ghostEvents={preview.ghostEvents} />
      </main>
    </div>
  )
}
