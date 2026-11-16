# spec.md — 3 Months Wall Calendar

User stories with acceptance criteria (Given / When / Then).
Scope, glossary and constraints: see `brief.md` (same folder).

## F1 — Calendar view

### US-1.1 Three stacked months
As the owner, I see the current month and the next 2 stacked top to bottom,
so I know what is coming in the next 3 months.
- Given today is 12 Nov 2026, when I open the app,
  then I see November 2026, December 2026, January 2027, top to bottom.
- Each month has a bilingual header with the year, English first: "NOVEMBER • ЛИСТОПАД 2026".
- Each month has a weekday row, Monday first, English first: "MON / ПН" … "SUN / НД".

### US-1.2 Month grid
- A month shows 4 to 6 week rows, as many as it needs. No shared cells.
- Given November 2026, then the grid has 6 rows: 26 Oct – 6 Dec.
- Given February 2027 (starts on Monday, 28 days), then the grid has 4 rows.
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
- Given I navigated to other months (e.g. March – May), when the date changes,
  then the view does not jump; only the red frame and dimming update.

## F2 — Navigation

### US-2.1 Previous / next month
As the owner, I move the view one month at a time,
so that I can look further ahead or back like turning a page.
- Given the view shows Nov 2026 – Jan 2027, when I press "next",
  then it shows Dec 2026 – Feb 2027.
- Given the view shows Nov 2026 – Jan 2027, when I press "previous",
  then it shows Oct 2026 – Dec 2026.
- There is no limit in either direction.
- The months are replaced instantly (no animation in v1).

### US-2.2 Today button
As the owner, I return to the current view with one click.
- Given the view shows Mar – May 2027 and today is 14 Nov 2026,
  when I press "Today", then it shows Nov 2026 – Jan 2027.
- Given the view already starts at the current month,
  then the "Today" button is visible but disabled.

### US-2.3 Input method
- Navigation works with on-screen buttons only. No keyboard shortcuts in v1.

## F3 — Events

An event has a **title** (required) and a **description** (optional).
"Editable day" = today or a future day. "Past day" = before today; it is read-only.

### US-3.1 Open a day
- Given an editable day with events, when I click it,
  then the day modal shows the list of events and an "Add event" button.
- Given an editable day with no events, when I click it,
  then the add form opens directly.
- Given a past day with events, when I click it,
  then the modal shows the list, with no "Add event" button.
- Given a past day with no events, when I click it, then nothing happens.
- The list shows titles in the order they were added (oldest first).

### US-3.2 Add an event
- Given the add form on 20 Nov 2026, when I enter a title and press Save,
  then the event is added to 20 Nov and the cell counter increases by 1.
- The title is 1–60 characters; a title of only spaces cannot be saved.
- The description is optional, max 500 characters.
- The modal has a close button; closing it discards unsaved changes.

### US-3.3 View an event
- Given the day list, when I click an event,
  then I see its title and full description.
- Given an editable day, the details show Edit, Delete and Clone.
- Given a past day, the details show only Clone.

### US-3.4 Edit an event
- Given an event on an editable day, when I press Edit, change the title and press Save,
  then the event shows the new title. The same validation as US-3.2 applies.

### US-3.5 Delete an event
- Given an event on an editable day, when I press Delete,
  then it is removed immediately (no confirmation) and the cell counter decreases by 1.
- Given the last event of a day is deleted, then the cell has no border and no counter.

### US-3.6 Clone an event
As the owner, I copy any event (past or future) to a new date.
- Given an event on 5 Nov 2026, when I press Clone,
  then the add form opens with its title and description filled in, plus a date field.
- I can change the date, title and description before saving.
- The date must be today or later; earlier dates cannot be picked.
- When I press Save, then a new event is created on the chosen date;
  the original event does not change.

## F4 — Persistence

Events are stored in localStorage, behind a small storage module (swappable later).

### US-4.1 Events survive a reload
- Given I added an event on 20 Nov 2026, when I reload the page or restart the PWA,
  then the event is still there.
- Given there is no saved data (first run), then the calendar shows no events and no error.

### US-4.2 Two windows open at once
- There is no live sync between windows in v1: a window shows changes from
  another window only after a reload.
- Given an event was added in another window, when I save a change in this window,
  then the other event is not lost (it appears after a reload).

### US-4.3 Save fails
- Given saving fails (storage full or blocked), when I press Save,
  then the modal stays open with my text and shows:
  "Couldn't save. Your changes are not stored."

## F5 — Backup

### US-5.1 Export
As the owner, I download all my events as a file, so I have a backup.
- When I press Export, then a JSON file with all events is downloaded.
- The file name includes the date: `wall-calendar-backup-2026-11-14.json`.
- Given there are no events, then Export still works and the file has an empty list.

### US-5.2 Import (replace)
As the owner, I restore my events from a backup file.
- Given I have 12 events and pick a valid file with 30 events, when I press Import,
  then I see: "This will replace all 12 events with 30 events from the file. Continue?"
  with Yes / Cancel (inside the app, not a browser dialog).
- When I press Yes, then all current events are replaced by the file's events.
- When I press Cancel, then nothing changes.

### US-5.3 Invalid import file
- Given the file is not JSON, has the wrong format, or any event breaks the rules
  (e.g. a 70-character title), when I import it,
  then nothing changes and a short error message is shown. No partial imports.

## F6 — PWA

### US-6.1 Install
As the owner, I install the calendar as an app in Chrome,
so it opens in its own window on the vertical monitor.
- Given the app is open in Chrome, then Chrome offers "Install app".
- When installed, then it opens in its own window without the address bar,
  named "Wall Calendar", with its own icon.

### US-6.2 Works offline
- Given the app was installed once, when there is no network,
  then the app still opens and works with saved events.

### US-6.3 Updates
- Given a new version is built and served, then the app uses it on the next launch.
- No "update available" message in v1; the old version may show once after a change.

### US-6.4 Public hosting
As the owner, I share one public link, and anyone can use the calendar.
- When a PR is merged into `main`, then the new version is deployed to GitHub Pages automatically.
- Given two people use the same link, then each sees only the events in their own browser.
- The README says that events live only in the browser and recommends regular export.
