import { describe, expect, it } from 'vitest'
import {
  addMonths,
  isoWeek,
  isSameYearMonth,
  isValidDateKey,
  monthGrid,
  parseDateKey,
  toDateKey,
  yearMonthOf,
} from './dates'

const NOV_2026 = { year: 2026, month: 10 }
const DEC_2026 = { year: 2026, month: 11 }
const JAN_2027 = { year: 2027, month: 0 }
const FEB_2027 = { year: 2027, month: 1 }

describe('toDateKey / parseDateKey', () => {
  it('pads month and day', () => {
    expect(toDateKey(new Date(2027, 0, 5))).toBe('2027-01-05')
  })

  it('round-trips', () => {
    expect(toDateKey(parseDateKey('2026-11-12'))).toBe('2026-11-12')
  })

  it('throws on an invalid key', () => {
    expect(() => parseDateKey('2026-02-30')).toThrow()
  })
})

describe('isValidDateKey', () => {
  it.each([
    ['2026-11-12', true],
    ['2028-02-29', true], // leap year
    ['2027-02-29', false],
    ['2026-02-30', false],
    ['2026-13-01', false],
    ['2026-1-05', false],
    ['20261105', false],
    ['', false],
  ])('%s → %s', (key, expected) => {
    expect(isValidDateKey(key)).toBe(expected)
  })
})

describe('addMonths', () => {
  it('moves forward across a year boundary', () => {
    expect(addMonths(DEC_2026, 1)).toEqual(JAN_2027)
  })

  it('moves back across a year boundary', () => {
    expect(addMonths(JAN_2027, -1)).toEqual(DEC_2026)
  })

  it('moves by more than a year', () => {
    expect(addMonths(NOV_2026, 14)).toEqual({ year: 2028, month: 0 })
    expect(addMonths(NOV_2026, -23)).toEqual({ year: 2024, month: 11 })
  })
})

describe('yearMonthOf / isSameYearMonth', () => {
  it('extracts year and month', () => {
    expect(yearMonthOf('2026-11-15')).toEqual(NOV_2026)
  })

  it('compares', () => {
    expect(isSameYearMonth(NOV_2026, { year: 2026, month: 10 })).toBe(true)
    expect(isSameYearMonth(NOV_2026, DEC_2026)).toBe(false)
  })
})

describe('isoWeek (US-1.3)', () => {
  it.each([
    ['2026-11-01', 44], // paper calendar: first November row
    ['2026-11-12', 46], // paper calendar: the "today" row in the photo
    ['2026-12-28', 53], // last row of December 2026
    ['2027-01-01', 53], // first row of January 2027 is still week 53
    ['2027-01-03', 53],
    ['2027-01-04', 1],
    ['2025-12-29', 1], // the opposite case: late December in week 1
  ])('%s → week %i', (key, week) => {
    expect(isoWeek(key)).toBe(week)
  })
})

describe('monthGrid (US-1.2)', () => {
  const keys = (rows: ReturnType<typeof monthGrid>) => rows.flatMap((r) => r.days.map((d) => d.key))

  it('November 2026: 6 rows, 26 Oct – 6 Dec', () => {
    const rows = monthGrid(NOV_2026)
    expect(rows).toHaveLength(6)
    expect(rows[0].days[0].key).toBe('2026-10-26')
    expect(rows[5].days[6].key).toBe('2026-12-06')
    expect(rows.map((r) => r.week)).toEqual([44, 45, 46, 47, 48, 49])
  })

  it('marks overflow days', () => {
    const rows = monthGrid(NOV_2026)
    expect(rows[0].days.map((d) => d.inMonth)).toEqual([false, false, false, false, false, false, true])
    expect(rows[5].days[0]).toEqual({ key: '2026-11-30', day: 30, inMonth: true })
    expect(rows[5].days[1]).toEqual({ key: '2026-12-01', day: 1, inMonth: false })
  })

  it('December 2026: last row is week 53', () => {
    const rows = monthGrid(DEC_2026)
    expect(rows).toHaveLength(5)
    expect(rows[4].week).toBe(53)
    expect(rows[4].days[0].key).toBe('2026-12-28')
  })

  it('January 2027: 5 rows, starts with week 53', () => {
    const rows = monthGrid(JAN_2027)
    expect(rows).toHaveLength(5)
    expect(rows[0].days[0].key).toBe('2026-12-28')
    expect(rows.map((r) => r.week)).toEqual([53, 1, 2, 3, 4])
  })

  it('February 2027: only 4 rows (starts on Monday, 28 days)', () => {
    const rows = monthGrid(FEB_2027)
    expect(rows).toHaveLength(4)
    expect(rows.every((r) => r.days.every((d) => d.inMonth))).toBe(true)
  })

  it('every row has 7 days, Monday first', () => {
    for (const ym of [NOV_2026, DEC_2026, JAN_2027, FEB_2027]) {
      for (const row of monthGrid(ym)) {
        expect(row.days).toHaveLength(7)
        expect(parseDateKey(row.days[0].key).getDay()).toBe(1)
      }
    }
  })

  it('has no gaps or duplicates across DST changes (Mar and Oct 2027)', () => {
    for (const ym of [{ year: 2027, month: 2 }, { year: 2027, month: 9 }]) {
      const all = keys(monthGrid(ym))
      for (let i = 1; i < all.length; i++) {
        const prev = parseDateKey(all[i - 1])
        const next = new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1)
        expect(all[i]).toBe(toDateKey(next))
      }
    }
  })
})
