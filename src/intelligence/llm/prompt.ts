import type { Finding, WeekInput } from "../types";

export const SYSTEM_PROMPT = `You are Compass, a calm weekly-planning reflection tool.

You are not a coach and not a chat assistant. You look back at a week someone has
already planned and offer a small number of gentle observations about it - the way
a second look catches things a first pass misses.

Rules for every observation you write:
- Language is reflective, not prescriptive. Describe what the week looks like
  (for example "Tuesday is fully booked from morning to evening") rather than
  instructing (for example "You should clear your Tuesday"). Never use
  imperative language like "you must", "you should", or "you need to".
- Ground every observation strictly in the findings and week data you are given.
  Do not invent events, priorities, or times that are not present in the input.
- Return at most 3 observations, ordered by how much they matter.
- Every observation must include "keep_plan" in its "actions" array, since
  keeping the week exactly as planned is always a valid choice. Only add
  "explore_suggestion" alongside it when there is a genuinely useful
  alternative worth looking at.
- "findingTypes" must only contain values from the finding types you were
  given as evidence for that observation.

Respond with ONLY a JSON array (no prose, no markdown fences) of objects
shaped exactly like:
[
  {
    "title": string,
    "message": string,
    "findingTypes": string[],
    "actions": ("keep_plan" | "explore_suggestion")[]
  }
]`;

function summarizeEvent(event: WeekInput["events"][number]): string {
  const priorityNote = event.priorityId ? ` [priority: ${event.priorityId}]` : "";
  return `- "${event.title}" (${event.start} to ${event.end})${priorityNote}`;
}

function summarizeFinding(finding: Finding): string {
  const dateNote = finding.date ? `, date: ${finding.date}` : "";
  return `- type: ${finding.type}, severity: ${finding.severity}${dateNote} - ${finding.message}`;
}

export function buildObservationsPrompt(input: WeekInput, findings: Finding[]): string {
  const workHoursNote =
    input.boundaries.workStart && input.boundaries.workEnd
      ? `, preferred work hours: ${input.boundaries.workStart}-${input.boundaries.workEnd}`
      : "";

  const boundariesSummary =
    `Wake time: ${input.boundaries.wakeTime}, sleep time: ${input.boundaries.sleepTime}` +
    workHoursNote +
    `, minimum break: ${input.boundaries.minimumBreakMinutes} minutes.`;

  const prioritiesSummary = input.priorities.length
    ? input.priorities.map((priority) => `- ${priority.title} (${priority.importance})`).join("\n")
    : "No priorities were provided.";

  const eventsSummary = input.events.length
    ? input.events.map(summarizeEvent).join("\n")
    : "No events were provided.";

  const findingsSummary = findings.map(summarizeFinding).join("\n");

  return `Here is the week to reflect on.

Boundaries:
${boundariesSummary}

Priorities:
${prioritiesSummary}

Calendar events:
${eventsSummary}

Findings already detected by rule-based checks:
${findingsSummary}

Write up to 3 reflective observations about this week, following the system rules.`;
}
