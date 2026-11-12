# spec.md — 3 Months Wall Calendar

User stories with acceptance criteria (Given / When / Then).
Scope, glossary and constraints: see `brief.md` (same folder).

## F1 — Calendar view

### US-1.1 Three stacked months
As the owner, I see the current month and the next 2 stacked top to bottom,
so I know what is coming in the next 3 months.
- Given today is 12 Nov 2026, when I open the app,
  then I see November 2026, December 2026, January 2027, top to bottom.
- Each month has a bilingual header with the year: "ЛИСТОПАД • NOVEMBER 2026".
- Each month has a weekday row, Monday first: "ПН / MON" … "НД / SUN".

### US-1.2 Month grid
- A month shows 5 or 6 week rows, as many as it needs. No shared cells.
- Given November 2026, then the grid has 6 rows: 26 Oct – 6 Dec.
- Overflow days (other months) look outlined/faded. They are display-only:
  clicking them does nothing.

### US-1.3 Week numbers
- Each row starts with its ISO 8601 week number.
- Given December 2026, then the last row (28 Dec – 3 Jan) shows week 53.
- Given January 2027, then the first row also shows week 53.

### US-1.4 Today, past days, weekends
- Given today is 12 Nov 2026, then 12 Nov has a red frame,
  1–11 Nov are dimmed, and 13 Nov onwards look normal.
- Saturday and Sunday numbers are red (dimmed red when in the past).

### US-1.5 Events in a day cell
- Given 25 Dec has 2 events, then its cell has a highlighted border and shows "2".
- Given a day has no events, then its cell has no border and no counter.
- Given a past day has events, then its border and counter are dimmed.

### US-1.6 Fit to screen
- Given a 1080×1920 window, then all 3 months are visible with no scrollbars.
- When I resize the window, the layout scales and still has no scrollbars.

### US-1.7 Day change while the app is open
- Given the app is open at 23:59 on 12 Nov, when the clock passes midnight,
  then the red frame moves to 13 Nov and 12 Nov becomes dimmed, without a reload.
- Given the app is open and the view starts at the current month (November),
  when the date changes to 1 Dec, then the view shifts to December, January, February.
- Assumption (to confirm in F2): if I navigated to other months, the view does not
  jump at midnight; only the frame and dimming update.
