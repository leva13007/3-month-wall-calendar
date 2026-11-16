// Pure date helpers. Calendar days are "YYYY-MM-DD" strings (local time, no timezone).
// `Date` objects are only used inside this module, always at local midnight.

export type DateKey = string

export type YearMonth = {
  year: number
  /** 0–11, like Date#getMonth() */
  month: number
}

export type GridDay = {
  key: DateKey
  /** day of month, 1–31 */
  day: number
  /** false for overflow days from the previous / next month */
  inMonth: boolean
}

export type GridRow = {
  /** ISO 8601 week number */
  week: number
  /** always 7 days, Monday first */
  days: GridDay[]
}

const DATE_KEY_RE = /^(\d{4})-(\d{2})-(\d{2})$/

const pad2 = (n: number) => String(n).padStart(2, '0')

/** Local calendar day of a Date → "YYYY-MM-DD". */
export function toDateKey(date: Date): DateKey {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

/** True for a well-formed key of a real day ("2026-02-30" is false). */
export function isValidDateKey(key: string): boolean {
  const m = DATE_KEY_RE.exec(key)
  if (!m) return false
  const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const d = new Date(year, month - 1, day)
  return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day
}

/** "YYYY-MM-DD" → Date at local midnight. Throws on an invalid key. */
export function parseDateKey(key: DateKey): Date {
  if (!isValidDateKey(key)) throw new Error(`Invalid date key: ${key}`)
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/** Year/month of a date key. */
export function yearMonthOf(key: DateKey): YearMonth {
  const d = parseDateKey(key)
  return { year: d.getFullYear(), month: d.getMonth() }
}

/** Move by whole months; handles year boundaries in both directions. */
export function addMonths({ year, month }: YearMonth, delta: number): YearMonth {
  const total = year * 12 + month + delta
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 }
}

export function isSameYearMonth(a: YearMonth, b: YearMonth): boolean {
  return a.year === b.year && a.month === b.month
}

/** ISO 8601 week number: weeks start on Monday; week 1 contains the year's first Thursday. */
export function isoWeek(key: DateKey): number {
  const d = parseDateKey(key)
  // Work in UTC so DST changes can't shift the day count.
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const weekday = t.getUTCDay() || 7 // Mon=1 … Sun=7
  t.setUTCDate(t.getUTCDate() + 4 - weekday) // Thursday of this week
  const yearStart = Date.UTC(t.getUTCFullYear(), 0, 1)
  return Math.ceil(((t.getTime() - yearStart) / 86_400_000 + 1) / 7)
}

/**
 * Weeks of a month, Monday first. As many rows as the month needs (4–6),
 * padded with overflow days from the neighbouring months.
 */
export function monthGrid({ year, month }: YearMonth): GridRow[] {
  const first = new Date(year, month, 1)
  const offset = (first.getDay() + 6) % 7 // days before the 1st, Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const rowCount = Math.ceil((offset + daysInMonth) / 7)

  const rows: GridRow[] = []
  for (let r = 0; r < rowCount; r++) {
    const days: GridDay[] = []
    for (let c = 0; c < 7; c++) {
      // new Date(y, m, d) normalises overflow (e.g. day 0 or 32) and is DST-safe.
      const d = new Date(year, month, 1 - offset + r * 7 + c)
      days.push({ key: toDateKey(d), day: d.getDate(), inMonth: d.getMonth() === month })
    }
    rows.push({ week: isoWeek(days[0].key), days })
  }
  return rows
}
