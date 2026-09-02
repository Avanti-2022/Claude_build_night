export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO date-time
  end: string;
  priorityId?: string;
}

export interface Priority {
  id: string;
  title: string;
  importance: "low" | "medium" | "high";
}

export interface UserBoundaries {
  wakeTime: string;       // "07:30"
  sleepTime: string;      // "23:00"
  workStart?: string;
  workEnd?: string;
  minimumBreakMinutes: number;
}

export interface WeekInput {
  events: CalendarEvent[];
  priorities: Priority[];
  boundaries: UserBoundaries;
}

export type FindingType =
  | "OVERLOAD"
  | "MISSING_BREAK"
  | "BOUNDARY_VIOLATION"
  | "MISSING_PRIORITY"
  | "FRAGMENTATION";

export interface Finding {
  type: FindingType;
  severity: "low" | "medium" | "high";
  date?: string;
  message: string;
  evidence: Record<string, unknown>;
  relatedEventIds?: string[];
}

export interface Observation {
  title: string;
  message: string;
  findingTypes: FindingType[];
  actions: Array<"keep_plan" | "explore_suggestion">;
}