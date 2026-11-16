# plan.md — 3 Months Wall Calendar

Technical plan for the v1 spec. Inputs: [brief](brief.md), [spec](spec.md),
[design mockup](design/mockup.html).

## Tooling

- **Vite** + React + TypeScript (`npm create vite`, `react-ts` template).
- **Vitest** (dev-only) for pure logic and the storage module. Spec examples become test cases.
- **PWA by hand:** `manifest.webmanifest` + a small service worker. No `vite-plugin-pwa`.
- No other runtime libraries. No state library, no date library, no UI kit.
- Hosting: **GitHub Pages**, deployed by a GitHub Actions workflow on every push to `main`
  (`.github/workflows/deploy.yml`: install → test → build → deploy `dist/`).
- Dev: `npm run dev`. Tests: `npm test`. Local production check: `npm run build && npm run preview`.

## Project structure

```
src/
  main.tsx              app entry, registers the service worker
  App.tsx               all state lives here
  types.ts              CalendarEvent, ViewStart, ModalState
  components/
    TopBar.tsx          ◀ Today ▶ · Export · Import
    CalendarView.tsx    renders 3 × MonthGrid
    MonthGrid.tsx       header, weekday row, week numbers, day cells
    DayCell.tsx         number, today frame, past dimming, event border + counter
    Modal.tsx           backdrop + close button; renders one of:
    EventList.tsx
    EventDetails.tsx
    EventForm.tsx       add / edit / clone
    ImportConfirm.tsx
  lib/
    dates.ts            toDateKey, parseDateKey, isoWeek, monthGrid, addMonths
    validation.ts       validateEventInput, parseBackupFile
    backup.ts           exportEvents (download), readImportFile
    names.ts            English + Ukrainian month / weekday names
  storage/
    eventStorage.ts     loadEvents, saveEvents (localStorage)
  hooks/
    useToday.ts         current date key, updates at midnight
  styles/
    tokens.css          colors, sizes (from the mockup)
public/
  manifest.webmanifest
  sw.js
  icons/                app icons (192, 512)
  fonts/                Barlow Condensed, Inter (woff2, self-hosted for offline)
```

## Data model

```ts
type CalendarEvent = {
  id: string;          // crypto.randomUUID()
  date: string;        // "YYYY-MM-DD", local calendar day, no time, no timezone
  title: string;       // 1–60 chars, trimmed, not whitespace-only
  description: string; // 0–500 chars, "" when empty
  createdAt: number;   // ms timestamp; list order = oldest first
};
```

- Dates are `"YYYY-MM-DD"` strings, never `Date` objects in state or storage.
  They don't shift with timezones/DST and compare correctly as strings
  (`"2026-11-14" < "2026-11-15"`).
- Events are a **flat array**. A day's events = `events.filter(e => e.date === key)`,
  sorted by `createdAt`. The UI may build a `Map<date, CalendarEvent[]>` per render.

## Storage and file format

Same format in localStorage (key `wall-calendar`) and in the export file:

```json
{ "version": 1, "events": [ ... ] }
```

`version` lets a future version (e.g. with event times) migrate old data instead of breaking.

```ts
loadEvents(): CalendarEvent[]
saveEvents(update: (current: CalendarEvent[]) => CalendarEvent[]): CalendarEvent[]
```

- `loadEvents`: no data → `[]` (US-4.1, first run). Unreadable data → `[]`, no crash.
- `saveEvents` **re-reads localStorage first**, applies `update`, writes, returns the new list.
  So a change in this window never deletes events added in another window (US-4.2).
- If writing fails, `saveEvents` throws; the form stays open and shows
  "Couldn't save. Your changes are not stored." (US-4.3).
- Only this module touches `localStorage`. Swapping storage later = rewriting one file.

## State (all in `App`, plain `useState`)

```ts
events: CalendarEvent[]      // from loadEvents()
viewStart: { year: number; month: number } // first of the 3 visible months (month 0–11)
today: string                // from useToday()
modal: ModalState
```

```ts
type ModalState =
  | { kind: "closed" }
  | { kind: "list"; date: string }
  | { kind: "details"; date: string; eventId: string }
  | { kind: "form"; date: string; mode: "add" | "edit" | "clone"; eventId?: string }
  | { kind: "confirmImport"; events: CalendarEvent[] };
```

The union makes invalid states impossible (e.g. "details" without an event).

Derived values (not stored):
- `isPast(date) = date < today`; `isEditable(date) = date >= today`.
- "Today" button disabled when `viewStart` is the current month (US-2.2).

### Day change (US-1.7)

`useToday` returns today's key and schedules a timer to the next local midnight.
It also re-checks on `visibilitychange` / `focus`, because a sleeping computer can
miss the timer. When the day changes:
- `today` updates → the frame and dimming move.
- If `viewStart` was the **previous** current month, it moves to the new current month.
  Otherwise the view stays where the user navigated.

## Components → spec

| Component | Stories |
|---|---|
| `CalendarView`, `MonthGrid` | US-1.1, 1.2, 1.3, 1.6 |
| `DayCell` | US-1.4, 1.5, 3.1 (click rules) |
| `TopBar` | US-2.1, 2.2, 5.1, 5.2 |
| `EventList` | US-3.1 |
| `EventForm` | US-3.2, 3.4, 3.6, 4.3 |
| `EventDetails` | US-3.3, 3.5 |
| `ImportConfirm` | US-5.2 |
| `useToday` + `App` | US-1.7 |
| `eventStorage` | US-4.1, 4.2, 4.3 |
| `backup`, `validation` | US-5.1, 5.2, 5.3 |
| `sw.js`, manifest | US-6.1, 6.2, 6.3 |
| `deploy.yml`, `base` | US-6.4 |

## Key logic

- `monthGrid(year, month)` → rows of 7 date keys starting on Monday; 5 or 6 rows;
  each cell knows if it is in the month (overflow = display-only, not clickable).
- `isoWeek(dateKey)` → ISO 8601 week number (Thursday rule).
- Validation (shared by add / edit / clone / import): title trimmed, 1–60 chars;
  description ≤ 500; clone date ≥ today; date matches `YYYY-MM-DD` and is a real day.
- Import: parse JSON → check `version` and every event → all valid → `confirmImport`;
  anything invalid → error message, nothing changes (US-5.3). Replace via `saveEvents(() => imported)`.
- Export: file name `wall-calendar-backup-YYYY-MM-DD.json` (today's date).

## Layout and styling

- Plain CSS with variables in `tokens.css`, values taken from the mockup
  (pink `#ff3d8b`, red `#d62828`, 1.5px event border, 4px month radius).
- Page = flex column: top bar + 3 months; each month's `flex-grow` = its row count + header,
  so 5- and 6-row months share the height fairly. Sizes in `vh` with `clamp()`.
  `height: 100vh; overflow: hidden` → no scrollbars at any window size (US-1.6).
- English first, Ukrainian second (US-1.1).
- Fonts self-hosted in `public/fonts/` — the mockup's Google Fonts link would break offline.

## GitHub Pages base path

The app is served from `https://<user>.github.io/3-month-wall-calendar/`, not from `/`.
- `vite.config.ts`: `base: "/3-month-wall-calendar/"`.
- Manifest `start_url` and `scope`, service worker registration and its cache keys
  use relative paths or `import.meta.env.BASE_URL` — never a hard-coded `/`.

## PWA

- `manifest.webmanifest`: name "Wall Calendar", `display: standalone`, icons 192/512,
  theme color matches the top bar.
- `sw.js` (registered only in production builds):
  - Cache-first with background refresh for same-origin GET requests:
    serve from cache, then fetch and update the cache.
  - First visit fills the cache → the app opens offline afterwards (US-6.2).
  - A new build is fetched in the background and used on the next launch (US-6.3).
    No update prompt.

## Testing

- **Vitest, unit:** `dates.ts` (spec examples: Nov 2026 = 6 rows 26 Oct – 6 Dec;
  28 Dec 2026 = week 53; 4 Jan 2027 = week 1), `validation.ts`, `eventStorage.ts`
  (fake `localStorage`; second-window case; write failure).
- **Manual check** against the spec's Given/When/Then for UI stories, in Chrome at
  1080×1920 (DevTools device size) and on the real monitor.
- No component/E2E test library in v1.

## Risks

- **Service worker caching** can show stale code during development → register it only
  in production builds; use DevTools "Update on reload" when testing it.
- **Midnight timer** may not fire after sleep → the visibility/focus re-check covers it.
- **localStorage loss** (browser data cleared) → export backup (F5) is the safety net.
