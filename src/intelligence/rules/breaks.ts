import type {
  CalendarEvent,
  Finding,
  UserBoundaries,
} from "../types";

export function checkMissingBreaks(
  events: CalendarEvent[],
  boundaries: UserBoundaries
): Finding[] {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  const findings: Finding[] = [];

  for (let index = 0; index < sortedEvents.length - 1; index++) {
    const currentEvent = sortedEvents[index];
    const nextEvent = sortedEvents[index + 1];

    const currentEnd = new Date(currentEvent.end).getTime();
    const nextStart = new Date(nextEvent.start).getTime();
    const gapMinutes = (nextStart - currentEnd) / 60_000;

    if (gapMinutes < boundaries.minimumBreakMinutes) {
      findings.push({
        type: "MISSING_BREAK",
        severity: "medium",
        message: `There is little recovery time between "${currentEvent.title}" and "${nextEvent.title}".`,
        evidence: {
          gapMinutes,
          minimumBreakMinutes: boundaries.minimumBreakMinutes,
        },
        relatedEventIds: [currentEvent.id, nextEvent.id],
      });
    }
  }

  return findings;
}