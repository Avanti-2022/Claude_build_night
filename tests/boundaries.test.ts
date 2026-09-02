import assert from "node:assert/strict";
import test from "node:test";

import { checkBoundaries } from "../src/intelligence/rules/boundaries";
import type {
  CalendarEvent,
  UserBoundaries,
} from "../src/intelligence/types";

const boundaries: UserBoundaries = {
  wakeTime: "07:00",
  sleepTime: "23:00",
  workStart: "09:00",
  workEnd: "18:00",
  minimumBreakMinutes: 15,
};

test("detects an event after the preferred work boundary", () => {
  const events: CalendarEvent[] = [
    {
      id: "event-1",
      title: "Late meeting",
      start: "2026-09-03T18:30:00",
      end: "2026-09-03T19:30:00",
    },
  ];

  const findings = checkBoundaries(events, boundaries);

  assert.equal(findings.length, 1);
  assert.equal(findings[0].type, "BOUNDARY_VIOLATION");
  assert.deepEqual(findings[0].relatedEventIds, ["event-1"]);
});

test("allows an event within the preferred work boundary", () => {
  const events: CalendarEvent[] = [
    {
      id: "event-2",
      title: "Normal meeting",
      start: "2026-09-03T10:00:00",
      end: "2026-09-03T11:00:00",
    },
  ];

  const findings = checkBoundaries(events, boundaries);

  assert.equal(findings.length, 0);
});