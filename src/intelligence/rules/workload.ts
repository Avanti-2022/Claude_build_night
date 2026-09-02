import type {
  CalendarEvent,
  Finding,
  UserBoundaries,
} from "../types";

const OVERLOAD_THRESHOLD = 0.8;

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function eventDurationMinutes(event: CalendarEvent): number {
  return (
    new Date(event.end).getTime() - new Date(event.start).getTime()
  ) / 60_000;
}

export function checkWorkload(
  events: CalendarEvent[],
  boundaries: UserBoundaries
): Finding[] {
  const startTime = boundaries.workStart ?? boundaries.wakeTime;
  const endTime = boundaries.workEnd ?? boundaries.sleepTime;

  const availableMinutes =
    timeToMinutes(endTime) - timeToMinutes(startTime);

  if (availableMinutes <= 0) {
    return [];
  }

  const eventsByDate = new Map<string, CalendarEvent[]>();

  for (const event of events) {
    const date = event.start.slice(0, 10);
    const dailyEvents = eventsByDate.get(date) ?? [];

    dailyEvents.push(event);
    eventsByDate.set(date, dailyEvents);
  }

  const findings: Finding[] = [];

  for (const [date, dailyEvents] of eventsByDate) {
    const scheduledMinutes = dailyEvents.reduce(
      (total, event) => total + eventDurationMinutes(event),
      0
    );

    const workloadRatio = scheduledMinutes / availableMinutes;

    if (workloadRatio >= OVERLOAD_THRESHOLD) {
      findings.push({
        type: "OVERLOAD",
        severity: workloadRatio >= 1 ? "high" : "medium",
        date,
        message: `A large part of ${date} is already scheduled.`,
        evidence: {
          scheduledMinutes,
          availableMinutes,
          workloadRatio,
          threshold: OVERLOAD_THRESHOLD,
        },
        relatedEventIds: dailyEvents.map((event) => event.id),
      });
    }
  }

  return findings;
}