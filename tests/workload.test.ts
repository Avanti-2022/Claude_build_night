import assert from "node:assert/strict";
import test from "node:test";

import { checkWorkload } from "../src/intelligence/rules/workload";
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

test("detects an overloaded day", () => {
  const events: CalendarEvent[] = [
    {
      id: "event-1",
      title: "Busy workday",
      start: "2026-09-03T09:00:00",
      end: "2026-09-03T17:00:00",
    },
  ];

  const findings = checkWorkload(events, boundaries);

  assert.equal(findings.length, 1);
  assert.equal(findings[0].type, "OVERLOAD");
  assert.equal(findings[0].date, "2026-09-03");
});

test("allows a day with moderate scheduled time", () => {
  const events: CalendarEvent[] = [
    {
      id: "event-1",
      title: "Morning meeting",
      start: "2026-09-03T09:00:00",
      end: "2026-09-03T11:00:00",
    },
  ];

  const findings = checkWorkload(events, boundaries);

  assert.equal(findings.length, 0);
});

test("evaluates different dates separately", () => {
  const events: CalendarEvent[] = [
    {
      id: "event-1",
      title: "Busy Thursday",
      start: "2026-09-03T09:00:00",
      end: "2026-09-03T17:00:00",
    },
    {
      id: "event-2",
      title: "Quiet Friday",
      start: "2026-09-04T09:00:00",
      end: "2026-09-04T10:00:00",
    },
  ];

  const findings = checkWorkload(events, boundaries);

  assert.equal(findings.length, 1);
  assert.equal(findings[0].date, "2026-09-03");
});