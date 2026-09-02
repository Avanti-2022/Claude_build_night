import type {
  Finding,
  FindingType,
  Observation,
  WeekInput,
} from "../types";
import { buildObservationsPrompt, SYSTEM_PROMPT } from "./prompt";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";
const DEFAULT_MODEL = "claude-sonnet-5";
const MAX_OBSERVATIONS = 3;

const KNOWN_FINDING_TYPES = new Set<FindingType>([
  "OVERLOAD",
  "MISSING_BREAK",
  "BOUNDARY_VIOLATION",
  "MISSING_PRIORITY",
  "FRAGMENTATION",
]);

type ObservationAction = Observation["actions"][number];

function isValidAction(value: unknown): value is ObservationAction {
  return value === "keep_plan" || value === "explore_suggestion";
}

function isKnownFindingType(value: unknown): value is FindingType {
  return typeof value === "string" && KNOWN_FINDING_TYPES.has(value as FindingType);
}

function sanitizeObservation(raw: unknown): Observation | null {
  if (typeof raw !== "object" || raw === null) {
    return null;
  }

  const candidate = raw as Record<string, unknown>;

  if (
    typeof candidate.title !== "string" ||
    typeof candidate.message !== "string" ||
    !candidate.title.trim() ||
    !candidate.message.trim()
  ) {
    return null;
  }

  const findingTypes = Array.isArray(candidate.findingTypes)
    ? candidate.findingTypes.filter(isKnownFindingType)
    : [];

  const actions = Array.isArray(candidate.actions)
    ? candidate.actions.filter(isValidAction)
    : [];

  if (!actions.includes("keep_plan")) {
    actions.push("keep_plan");
  }

  return {
    title: candidate.title.trim(),
    message: candidate.message.trim(),
    findingTypes,
    actions,
  };
}

function readEnv(name: string): string | undefined {
  // Guarded rather than a bare `process.env` access: this module can end up
  // bundled into the browser via the UI's call path, and `process` doesn't
  // exist there - a direct reference would throw ReferenceError at runtime.
  return typeof process !== "undefined" ? process.env[name] : undefined;
}

function extractJsonArray(text: string): unknown[] {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");

  if (start === -1 || end === -1 || end < start) {
    return [];
  }

  const parsed = JSON.parse(text.slice(start, end + 1)) as unknown;
  return Array.isArray(parsed) ? parsed : [];
}

export async function generateObservations(
  input: WeekInput,
  findings: Finding[]
): Promise<Observation[]> {
  const apiKey = readEnv("ANTHROPIC_API_KEY");

  if (!apiKey) {
    return [];
  }

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: readEnv("ANTHROPIC_MODEL") ?? DEFAULT_MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: buildObservationsPrompt(input, findings),
          },
        ],
      }),
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };

    const text = data.content?.find((block) => block.type === "text")?.text;

    if (!text) {
      return [];
    }

    const rawObservations = extractJsonArray(text);

    const observations = rawObservations
      .map(sanitizeObservation)
      .filter((observation): observation is Observation => observation !== null);

    return observations.slice(0, MAX_OBSERVATIONS);
  } catch {
    return [];
  }
}
