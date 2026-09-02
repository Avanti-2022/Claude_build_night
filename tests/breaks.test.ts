import assert from "node:assert/strict";
import test from "node:test";

import { checkMissingBreaks } from "../src/intelligence/rules/breaks";
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

test("detects back-to-back events", () => {
  const events: CalendarEvent[] = [
    {
      id: "event-1",
      title: "Team meeting",
      start: "2026-09-03T10:00:00",
      end: "2026-09-03T11:00:00",
    },
    {
      id: "event-2",
      title: "Project review",
      start: "2026-09-03T11:00:00",
      end: "2026-09-03T12:00:00",
    },
  ];

  const findings = checkMissingBreaks(events, boundaries);

  assert.equal(findings.length, 1);
  assert.equal(findings[0].type, "MISSING_BREAK");
  assert.equal(findings[0].evidence.gapMinutes, 0);
});

test("detects a gap shorter than the preferred break", () => {
  const events: CalendarEvent[] = [
    {
      id: "event-1",
      title: "Lecture",
      start: "2026-09-03T10:00:00",
      end: "2026-09-03T11:00:00",
    },
    {
      id: "event-2",
      title: "Study session",
      start: "2026-09-03T11:10:00",
      end: "2026-09-03T12:00:00",
    },
  ];

  const findings = checkMissingBreaks(events, boundaries);

  assert.equal(findings.length, 1);
  assert.equal(findings[0].evidence.gapMinutes, 10);
});

test("allows a sufficiently long break", () => {
  const events: CalendarEvent[] = [
    {
      id: "event-1",
      title: "Lecture",
      start: "2026-09-03T10:00:00",
      end: "2026-09-03T11:00:00",
    },
    {
      id: "event-2",
      title: "Study session",
      start: "2026-09-03T11:30:00",
      end: "2026-09-03T12:30:00",
    },
  ];

  const findings = checkMissingBreaks(events, boundaries);

  assert.equal(findings.length, 0);
});