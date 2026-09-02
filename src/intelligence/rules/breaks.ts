import { CalendarEvent, Finding, UserBoundaries } from "../types";

export function checkMissingBreaks(
  events: CalendarEvent[],
  boundaries: UserBoundaries
): Finding[] {
  const sorted = [...events].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  const findings: Finding[] = [];

  for (let index = 0; index < sorted.length - 1; index++) {
    const currentEnd = new Date(sorted[index].end).getTime();
    const nextStart = new Date(sorted[index + 1].start).getTime();
    const gapMinutes = (nextStart - currentEnd) / 60_000;

    if (gapMinutes < boundaries.minimumBreakMinutes) {
      findings.push({
        type: "MISSING_BREAK",
        severity: "medium",
        message: "Several commitments leave little recovery time.",
        evidence: {
          gapMinutes,
          minimumBreakMinutes: boundaries.minimumBreakMinutes,
        },
        relatedEventIds: [sorted[index].id, sorted[index + 1].id],
      });
    }
  }

  return findings;
}