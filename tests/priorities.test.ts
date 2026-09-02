import assert from "node:assert/strict";
import test from "node:test";

import { checkPriorities } from "../src/intelligence/rules/priorities";
import type {
  CalendarEvent,
  Priority,
} from "../src/intelligence/types";

test("detects a high priority without scheduled time", () => {
  const priorities: Priority[] = [
    {
      id: "priority-1",
      title: "Finish project proposal",
      importance: "high",
    },
  ];

  const findings = checkPriorities([], priorities);

  assert.equal(findings.length, 1);
  assert.equal(findings[0].type, "MISSING_PRIORITY");
  assert.equal(findings[0].evidence.priorityId, "priority-1");
});

test("allows a high priority linked to a calendar event", () => {
  const priorities: Priority[] = [
    {
      id: "priority-1",
      title: "Finish project proposal",
      importance: "high",
    },
  ];

  const events: CalendarEvent[] = [
    {
      id: "event-1",
      title: "Work on project proposal",
      start: "2026-09-03T10:00:00",
      end: "2026-09-03T12:00:00",
      priorityId: "priority-1",
    },
  ];

  const findings = checkPriorities(events, priorities);

  assert.equal(findings.length, 0);
});

test("does not flag an unscheduled low priority", () => {
  const priorities: Priority[] = [
    {
      id: "priority-2",
      title: "Organize notes",
      importance: "low",
    },
  ];

  const findings = checkPriorities([], priorities);

  assert.equal(findings.length, 0);
});

test("detects only the unscheduled high priorities", () => {
  const priorities: Priority[] = [
    {
      id: "priority-1",
      title: "Finish proposal",
      importance: "high",
    },
    {
      id: "priority-2",
      title: "Prepare presentation",
      importance: "high",
    },
  ];

  const events: CalendarEvent[] = [
    {
      id: "event-1",
      title: "Proposal work",
      start: "2026-09-03T10:00:00",
      end: "2026-09-03T12:00:00",
      priorityId: "priority-1",
    },
  ];

  const findings = checkPriorities(events, priorities);

  assert.equal(findings.length, 1);
  assert.equal(findings[0].evidence.priorityId, "priority-2");
});