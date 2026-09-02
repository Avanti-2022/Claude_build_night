import type {
  CalendarEvent,
  Finding,
  Priority,
} from "../types";

export function checkPriorities(
  events: CalendarEvent[],
  priorities: Priority[]
): Finding[] {
  const scheduledPriorityIds = new Set(
    events
      .map((event) => event.priorityId)
      .filter((priorityId): priorityId is string => Boolean(priorityId))
  );

  return priorities
    .filter(
      (priority) =>
        priority.importance === "high" &&
        !scheduledPriorityIds.has(priority.id)
    )
    .map((priority) => ({
      type: "MISSING_PRIORITY",
      severity: "medium",
      message: `The high-priority item "${priority.title}" does not currently have scheduled time.`,
      evidence: {
        priorityId: priority.id,
        priorityTitle: priority.title,
        importance: priority.importance,
      },
    }));
}