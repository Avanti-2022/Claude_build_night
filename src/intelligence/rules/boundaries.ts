import type {
  CalendarEvent,
  Finding,
  UserBoundaries,
} from "../types";

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function dateToMinutes(dateTime: string): number {
  const date = new Date(dateTime);
  return date.getHours() * 60 + date.getMinutes();
}

export function checkBoundaries(
  events: CalendarEvent[],
  boundaries: UserBoundaries
): Finding[] {
  const allowedStart = timeToMinutes(
    boundaries.workStart ?? boundaries.wakeTime
  );

  const allowedEnd = timeToMinutes(
    boundaries.workEnd ?? boundaries.sleepTime
  );

  return events
    .filter((event) => {
      const eventStart = dateToMinutes(event.start);
      const eventEnd = dateToMinutes(event.end);

      return eventStart < allowedStart || eventEnd > allowedEnd;
    })
    .map((event) => ({
      type: "BOUNDARY_VIOLATION",
      severity: "medium",
      message: `"${event.title}" falls outside the user's preferred boundaries.`,
      evidence: {
        eventStart: event.start,
        eventEnd: event.end,
        allowedStart,
        allowedEnd,
      },
      relatedEventIds: [event.id],
    }));
}