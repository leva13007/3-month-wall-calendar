import { addMonths, type DateKey, type YearMonth } from '../lib/dates'
import MonthGrid from './MonthGrid'

type Props = {
  viewStart: YearMonth
  today: DateKey
}

/** Three months stacked top to bottom: viewStart + next 2 (US-1.1). */
function CalendarView({ viewStart, today }: Props) {
  const months = [0, 1, 2].map((i) => addMonths(viewStart, i))

  return (
    <main className="calendar">
      {months.map((m) => (
        <MonthGrid key={`${m.year}-${m.month}`} month={m} today={today} />
      ))}
    </main>
  )
}

export default CalendarView
