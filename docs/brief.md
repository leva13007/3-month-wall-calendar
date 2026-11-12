# brief.md — 3 Months Wall Calendar

Problem: The paper 3-month wall calendar can no longer be ordered from Ukraine. On paper, cells are too small for several sticky notes and notes fall off, so events get lost; few events are marked per month (exact number TBD), likely because of these limits.

Roles: Owner (single user) — keeps the calendar open full-screen on a vertical monitor; adds, edits and deletes events when needed.
Goal: The app replaces the paper calendar on the vertical monitor.
Metrics: at least 1 new event added per month, on average.

In scope (v1): 3 stacked months, ISO week numbers, today highlight, several events per day, prev/next month + "Today" button (instant replace), JSON export/import, PWA install.
Out of scope (v1): auth, multi-user, sync, recurring events, drag & drop, themes, Ukrainian holidays / professional days, smooth scrolling, clickable overflow days, pictures in a top frame.

Glossary:
  Event — short text note on one date; all-day (no time); a day can have many.
  View — 3 months on screen: start month + next 2. "Today" resets the start month to the current month.
  Today — current date in the machine's local time; highlighted.
  Week number — ISO 8601 week, weeks start on Monday (e.g. 28–31 Dec 2026 = week 53).
  Month grid — 5 or 6 week rows, as many as the month needs (no shared cells like "23/30").
  Overflow days — days from the previous/next month that fill the first and last rows; faded and display-only in v1.
  Day modal — opens on click of an in-month day. With events: list + "Add event"; click an event → details (edit / delete). No events: opens the add form directly.
  Backup — export of all events to a JSON file, and import from it.

Constraints: deadline 26 Nov 2026 (2-week timebox), React + TypeScript, no extra libraries unless clearly justified, localStorage behind a swappable storage module, runs locally, PWA in Chrome, portrait-first layout for Dell P2415Q (≈1080×1920 CSS px).
