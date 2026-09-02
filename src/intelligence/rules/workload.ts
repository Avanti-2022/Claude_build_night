import type {
  CalendarEvent,
  Finding,
  UserBoundaries,
} from "../types";

export function checkWorkload(
  _events: CalendarEvent[],
  _boundaries: UserBoundaries
): Finding[] {
  return [];
}