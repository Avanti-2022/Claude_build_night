import { WeekInput, Finding, Observation } from "./types";
import { checkMissingBreaks } from "./rules/breaks";
import { checkBoundaries } from "./rules/boundaries";
import { checkWorkload } from "./rules/workload";
import { checkPriorities } from "./rules/priorities";
import { generateObservations } from "./llm/claude";

export async function reviewWeek(
  input: WeekInput
): Promise<Observation[]> {
  const findings: Finding[] = [
    ...checkBoundaries(input.events, input.boundaries),
    ...checkMissingBreaks(input.events, input.boundaries),
    ...checkWorkload(input.events, input.boundaries),
    ...checkPriorities(input.events, input.priorities),
  ];

  if (findings.length === 0) {
    return [];
  }

  const observations = await generateObservations(input, findings);

  // Enforce this in code—do not depend only on the prompt.
  return observations.slice(0, 3);
}