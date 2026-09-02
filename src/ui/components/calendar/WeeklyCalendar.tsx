import type { CalendarEvent } from '../../types'

type WeeklyCalendarProps = {
  events: CalendarEvent[]
  highlightIds: string[]
  ghostEvents: CalendarEvent[]
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const START_HOUR = 7
const END_HOUR = 22
const ROW_HEIGHT = 28
const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i)
const GRID_HEIGHT = (HOURS.length - 1) * ROW_HEIGHT

function formatHour(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  return `${displayHour} ${period}`
}

function eventStyle(event: CalendarEvent) {
  return {
    top: (event.start - START_HOUR) * ROW_HEIGHT + 1,
    height: (event.end - event.start) * ROW_HEIGHT - 2,
  }
}

export default function WeeklyCalendar({ events, highlightIds, ghostEvents }: WeeklyCalendarProps) {
  return (
    <section className="weekly-calendar">
      <h2>This Week</h2>
      <div className="calendar-header-row">
        <div className="calendar-header-spacer" />
        <div className="calendar-header-days">
          {DAYS.map((day) => (
            <div key={day} className="calendar-header-day">
              {day}
            </div>
          ))}
        </div>
      </div>
      <div className="calendar-body">
        <div className="time-gutter" style={{ height: GRID_HEIGHT }}>
          {HOURS.map((hour, i) => (
            <span key={hour} className="time-label" style={{ top: i * ROW_HEIGHT }}>
              {formatHour(hour)}
            </span>
          ))}
        </div>
        <div className="calendar-days">
          {DAYS.map((day, dayIndex) => (
            <div key={day} className="calendar-day-column" style={{ height: GRID_HEIGHT }}>
              {HOURS.map((hour, i) => (
                <div key={hour} className="hour-line" style={{ top: i * ROW_HEIGHT }} />
              ))}
              {events
                .filter((event) => event.day === dayIndex)
                .map((event) => (
                  <div
                    key={event.id}
                    className={`calendar-event${
                      highlightIds.includes(event.id) ? ' calendar-event--highlight' : ''
                    }`}
                    style={eventStyle(event)}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
              {ghostEvents
                .filter((event) => event.day === dayIndex)
                .map((event) => (
                  <div
                    key={event.id}
                    className="calendar-event calendar-event--ghost"
                    style={eventStyle(event)}
                    title={`${event.title} (preview)`}
                  >
                    {event.title}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
