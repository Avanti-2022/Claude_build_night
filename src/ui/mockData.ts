import type { CalendarEvent, Observation } from './types'

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

export const OBSERVATIONS: Observation[] = [
  {
    id: 'tuesday-overloaded',
    title: 'Tuesday looks overloaded',
    message: 'You have several long work/study blocks with little breathing room.',
    alternatives: [
      {
        id: 'move-study-to-friday',
        title: 'Move study block to Friday',
        tradeoff: 'Frees up Tuesday afternoon, but adds a second study block to Friday.',
        highlightEventIds: ['tue-study-2'],
        previewEvents: [
          { id: 'preview-study-friday', day: 4, start: 16.5, end: 18.5, title: 'Study: systems design (cont.)' },
        ],
        apply: (events) =>
          events.map((event) =>
            event.id === 'tue-study-2' ? { ...event, day: 4, start: 16.5, end: 18.5 } : event,
          ),
      },
      {
        id: 'shorten-work-block',
        title: 'Shorten one work block',
        tradeoff: 'Trims the backend refactor sprint by an hour to add breathing room.',
        highlightEventIds: ['tue-refactor'],
        previewEvents: [],
        apply: (events) =>
          events.map((event) => (event.id === 'tue-refactor' ? { ...event, end: event.end - 1 } : event)),
      },
      {
        id: 'keep-tuesday-unchanged',
        title: 'Keep Tuesday unchanged',
        tradeoff: 'No changes made — Tuesday stays as tightly packed as it is today.',
        highlightEventIds: ['tue-workshop', 'tue-refactor', 'tue-study-1', 'tue-study-2', 'tue-proposal'],
        previewEvents: [],
        apply: (events) => events,
      },
    ],
  },
  {
    id: 'health-underrepresented',
    title: 'Health is underrepresented',
    message: 'Exercise is one of your priorities, but there is no dedicated time for it this week.',
    alternatives: [
      {
        id: 'add-morning-walks',
        title: 'Add 30-min walks Wed & Fri mornings',
        tradeoff: 'Builds consistent movement without touching existing meetings.',
        highlightEventIds: [],
        previewEvents: [
          { id: 'preview-walk-wed', day: 2, start: 7.5, end: 8, title: 'Morning walk' },
          { id: 'preview-walk-fri', day: 4, start: 7.5, end: 8, title: 'Morning walk' },
        ],
        apply: (events) => [
          ...events,
          { id: 'walk-wed', day: 2, start: 7.5, end: 8, title: 'Morning walk' },
          { id: 'walk-fri', day: 4, start: 7.5, end: 8, title: 'Morning walk' },
        ],
      },
      {
        id: 'add-saturday-workout',
        title: 'Block Saturday for a workout',
        tradeoff: 'Uses open weekend time, but skips exercise on weekdays.',
        highlightEventIds: [],
        previewEvents: [{ id: 'preview-workout-sat', day: 5, start: 9, end: 10, title: 'Workout' }],
        apply: (events) => [...events, { id: 'workout-sat', day: 5, start: 9, end: 10, title: 'Workout' }],
      },
      {
        id: 'leave-exercise-unscheduled',
        title: 'Leave exercise unscheduled this week',
        tradeoff: "No dedicated time added — you'll need to fit movement in ad hoc.",
        highlightEventIds: [],
        previewEvents: [],
        apply: (events) => events,
      },
    ],
  },
  {
    id: 'thursday-runs-late',
    title: 'Thursday runs late',
    message: 'Your final commitment ends close to your preferred sleep time.',
    alternatives: [
      {
        id: 'move-demo-prep-earlier',
        title: 'Move demo prep to 4–6pm',
        tradeoff: 'Ends well before sleep time, but competes with your afternoon study block.',
        highlightEventIds: ['thu-demo-prep'],
        previewEvents: [{ id: 'preview-demo-prep-early', day: 3, start: 16, end: 18, title: 'Evening demo prep' }],
        apply: (events) =>
          events.map((event) => (event.id === 'thu-demo-prep' ? { ...event, start: 16, end: 18 } : event)),
      },
      {
        id: 'shorten-evening-block',
        title: 'Shorten evening block by 30 min',
        tradeoff: 'Ends closer to your sleep buffer, though prep time is tighter.',
        highlightEventIds: ['thu-demo-prep'],
        previewEvents: [],
        apply: (events) =>
          events.map((event) => (event.id === 'thu-demo-prep' ? { ...event, end: event.end - 0.5 } : event)),
      },
      {
        id: 'keep-thursday-unchanged',
        title: 'Keep Thursday unchanged',
        tradeoff: 'No changes made — Thursday still runs close to your sleep time.',
        highlightEventIds: ['thu-demo-prep'],
        previewEvents: [],
        apply: (events) => events,
      },
    ],
  },
]
