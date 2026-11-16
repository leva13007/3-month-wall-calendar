// Bilingual labels: English first, Ukrainian second (US-1.1).

export const MONTHS_EN = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
] as const

export const MONTHS_UA = [
  'СІЧЕНЬ', 'ЛЮТИЙ', 'БЕРЕЗЕНЬ', 'КВІТЕНЬ', 'ТРАВЕНЬ', 'ЧЕРВЕНЬ',
  'ЛИПЕНЬ', 'СЕРПЕНЬ', 'ВЕРЕСЕНЬ', 'ЖОВТЕНЬ', 'ЛИСТОПАД', 'ГРУДЕНЬ',
] as const

/** Monday first */
export const WEEKDAYS_EN = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const
export const WEEKDAYS_UA = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'НД'] as const

export const WEEK_LABEL_EN = 'WEEK'
export const WEEK_LABEL_UA = 'ТИЖ'

/** Column index (Monday = 0) → Saturday or Sunday */
export const isWeekendColumn = (col: number) => col >= 5
