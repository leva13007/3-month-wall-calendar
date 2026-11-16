# tasks.md — 3 Months Wall Calendar

Small steps from [plan](plan.md) to working v1. One task = one branch = one PR.
Each task is done when its "Done when" checks pass and the linked stories in
[spec](spec.md) are met. Deadline: 26 Nov 2026.

Status: `todo` · `doing` · `done`

| # | Task | Branch | Stories | Status |
|---|---|---|---|---|
| T1 | Scaffold | `chore/scaffold` | — | done |
| T1b | Deploy to GitHub Pages | `chore/deploy` | 6.4 | done |
| T2 | Date logic | `feat/dates` | 1.2, 1.3 | doing |
| T3 | Static calendar view | `feat/calendar-view` | 1.1–1.4, 1.6 | todo |
| T4 | Navigation | `feat/navigation` | 2.1–2.3 | todo |
| T5 | Day change at midnight | `feat/use-today` | 1.7 | todo |
| T6 | Storage module | `feat/storage` | 4.1–4.3 | todo |
| T7 | Validation | `feat/validation` | 3.2, 3.6, 5.3 | todo |
| T8 | Day modal: list + add | `feat/add-event` | 1.5, 3.1, 3.2, 4.3 | todo |
| T9 | Details, edit, delete | `feat/edit-delete` | 3.3–3.5 | todo |
| T10 | Clone | `feat/clone` | 3.6 | todo |
| T11 | Export / import | `feat/backup` | 5.1–5.3 | todo |
| T12 | PWA | `feat/pwa` | 6.1–6.3 | todo |
| T13 | Final check | `chore/v1-check` | all | todo |

---

### T1 — Scaffold
- Vite `react-ts` template in the repo root; remove template demo code and assets.
- Add Vitest (`npm test`); one trivial test so the setup is proven.
- `src/styles/tokens.css` with colors and sizes from the mockup.
- Self-hosted fonts in `public/fonts/` (Barlow Condensed 500/700/800, Inter 400/500/600).
- `.gitignore`: keep `english_log/`, `.DS_Store`; add `node_modules/`, `dist/`.

**Done when:** `npm run dev` shows an empty page with the fonts loaded;
`npm test` and `npm run build` pass.

### T1b — Deploy to GitHub Pages
- `vite.config.ts`: `base: "/3-month-wall-calendar/"`.
- `.github/workflows/deploy.yml`: on push to `main` → `npm ci` → `npm test` → `npm run build`
  → deploy `dist/` with the official Pages actions.
- Repo settings: Pages source = "GitHub Actions" (you do this in the GitHub UI).
- Done early on purpose: every later PR goes live after merge, so each task is checked
  in the real environment.

**Done when:** merging into `main` deploys the scaffold page to the public URL,
and a failing test stops the deploy.

### T2 — Date logic (`lib/dates.ts`)
- `toDateKey`, `parseDateKey`, `addMonths`, `isoWeek`, `monthGrid`.
- Unit tests from the spec:
  - Nov 2026 → 6 rows, 26 Oct – 6 Dec; Jan 2027 → 5 rows; Feb 2027 → 4 rows.
  - 28 Dec 2026 → week 53; 1 Jan 2027 → week 53; 4 Jan 2027 → week 1.
  - `addMonths` across a year boundary (Dec 2026 + 1 → Jan 2027).

**Done when:** all date tests pass. No UI in this task.

### T3 — Static calendar view
- `lib/names.ts` (English first, Ukrainian second).
- `CalendarView`, `MonthGrid`, `DayCell` with hard-coded `today` and no events.
- Week numbers, overflow days (outlined, not clickable), red weekends,
  red frame on today, past days dimmed.
- Fit-to-screen layout (flex-grow per row count, `vh` + `clamp()`).

**Done when:** at 1080×1920 the page matches the mockup with no scrollbars;
resizing the window keeps it scrollbar-free.

### T4 — Navigation
- `TopBar` with ◀ / Today / ▶ (Export / Import buttons present but not wired).
- `viewStart` state in `App`; 1 month per click, no limit, instant replace.
- "Today" disabled when the view starts at the current month.

**Done when:** US-2.1–2.3 pass by hand (Nov–Jan → next → Dec–Feb, etc.).

### T5 — Day change at midnight
- `hooks/useToday.ts`: timer to next local midnight + re-check on `visibilitychange` / `focus`.
- In `App`: when the day changes and `viewStart` was the previous current month,
  move it to the new current month; otherwise keep it.

**Done when:** tested by hand with a temporarily faked clock: the frame moves at midnight;
on the 1st the view shifts only if it was on the current month.

### T6 — Storage module (`storage/eventStorage.ts`)
- `loadEvents`, `saveEvents(update)` with the `{ version: 1, events }` format.
- Re-read before write; throw on write failure; `[]` for missing or unreadable data.
- Unit tests with a fake `localStorage`: first run, round trip,
  second-window case (US-4.2), write failure (US-4.3).

**Done when:** storage tests pass. No UI in this task.

### T7 — Validation (`lib/validation.ts`)
- `validateEventInput` (title 1–60 trimmed, not whitespace-only; description ≤ 500;
  clone date ≥ today).
- `parseBackupFile` (valid JSON, `version: 1`, every event valid; else an error).
- Unit tests for each rule, including a 70-character title and a broken file.

**Done when:** validation tests pass.

### T8 — Day modal: list + add
- Load events in `App`; `DayCell` shows the pink border + counter (dimmed when past).
- `Modal` shell (backdrop, close button, closing discards changes).
- Click rules: editable day with events → `EventList` + "Add event";
  editable empty day → `EventForm` (add); past day with events → list only;
  past empty day → nothing.
- `EventForm` add mode with counters, Save disabled for an invalid title,
  save error message (US-4.3).

**Done when:** US-1.5, 3.1, 3.2, 4.3 pass by hand; a new event survives a reload.

### T9 — Details, edit, delete
- `EventDetails`: title + description; Edit / Delete / Clone on editable days,
  only Clone on past days (Clone button can be disabled until T10).
- `EventForm` edit mode; delete without confirmation.

**Done when:** US-3.3–3.5 pass by hand; deleting the last event removes the border and counter.

### T10 — Clone
- `EventForm` clone mode: pre-filled title + description, date field with `min = today`.
- Saves a new event; the original stays unchanged.

**Done when:** US-3.6 passes by hand, including cloning a past event to a future date.

### T11 — Export / import
- `lib/backup.ts`: export download with `wall-calendar-backup-YYYY-MM-DD.json`.
- Import: file picker → `parseBackupFile` → `ImportConfirm`
  ("This will replace all N events with M events from the file. Continue?") → replace.
- Invalid file → error message, nothing changes.

**Done when:** US-5.1–5.3 pass by hand; export → clear storage → import restores all events.

### T12 — PWA
- `public/manifest.webmanifest`, icons 192/512, theme color.
- `public/sw.js`: cache-first with background refresh; registered only in production.

**Done when:** on the GitHub Pages URL, Chrome offers "Install app";
the installed app opens offline with saved events; a new deploy shows up on the next launch.

### T13 — Final check
- Walk through every Given/When/Then in the spec at 1080×1920 and on the real monitor.
- Fix small issues found; anything bigger goes to a v2 list.
- README: add the live link, "Getting started", and a note that events live only
  in the browser — export regularly (you write it).

**Done when:** all spec stories pass; v1 is installed on the vertical monitor.
