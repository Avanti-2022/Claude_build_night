import type { CalendarEvent } from './types'

export const INITIAL_EVENTS: CalendarEvent[] = [
  // Monday
  { id: 'mon-standup', day: 0, start: 9, end: 10, title: 'Team standup' },
  { id: 'mon-design-review', day: 0, start: 10.5, end: 12, title: 'Design review' },
  { id: 'mon-deep-work', day: 0, start: 14, end: 15.5, title: 'Deep work: Compass MVP' },
  { id: 'mon-1-1', day: 0, start: 16, end: 17, title: '1:1 with manager' },

  // Tuesday - back-to-back, little breathing room
  { id: 'tue-workshop', day: 1, start: 8, end: 10, title: 'Client workshop' },
  { id: 'tue-refactor', day: 1, start: 10, end: 12, title: 'Backend refactor sprint' },
  { id: 'tue-study-1', day: 1, start: 13, end: 15, title: 'Study: systems design' },
  { id: 'tue-study-2', day: 1, start: 15, end: 17, title: 'Study: systems design (cont.)' },
  { id: 'tue-proposal', day: 1, start: 17.5, end: 19, title: 'Proposal writing' },

  // Wednesday
  { id: 'wed-standup', day: 2, start: 9, end: 9.5, title: 'Standup' },
  { id: 'wed-deep-work', day: 2, start: 10, end: 12, title: 'Deep work block' },
  { id: 'wed-lunch-learn', day: 2, start: 13.5, end: 14.5, title: 'Lunch & learn' },
  { id: 'wed-code-review', day: 2, start: 15, end: 16, title: 'Code review' },

  // Thursday - runs close to sleep time
  { id: 'thu-standup', day: 3, start: 9, end: 10, title: 'Standup' },
  { id: 'thu-client-call', day: 3, start: 11, end: 12.5, title: 'Client call' },
  { id: 'thu-study', day: 3, start: 14, end: 16, title: 'Study block' },
  { id: 'thu-demo-prep', day: 3, start: 20, end: 22, title: 'Evening demo prep' },

  // Friday
  { id: 'fri-standup', day: 4, start: 9, end: 10, title: 'Standup' },
  { id: 'fri-wrap-up', day: 4, start: 10.5, end: 12, title: 'Weekly wrap-up' },
  { id: 'fri-retro', day: 4, start: 13, end: 14, title: 'Retro' },
  { id: 'fri-plan-next', day: 4, start: 15, end: 16, title: 'Plan next week' },

  // Saturday - mostly open
  { id: 'sat-groceries', day: 5, start: 10, end: 11, title: 'Grocery run' },

  // Sunday - mostly open
  { id: 'sun-meal-prep', day: 6, start: 18, end: 19, title: 'Meal prep' },
]
