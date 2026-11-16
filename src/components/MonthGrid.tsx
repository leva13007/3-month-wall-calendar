import { monthGrid, type DateKey, type YearMonth } from '../lib/dates'
import {
  MONTHS_EN, MONTHS_UA, WEEKDAYS_EN, WEEKDAYS_UA,
  WEEK_LABEL_EN, WEEK_LABEL_UA, isWeekendColumn,
} from '../lib/names'
import DayCell from './DayCell'
import './MonthGrid.css'

type Props = {
  month: YearMonth
  today: DateKey
}

function MonthGrid({ month, today }: Props) {
  const rows = monthGrid(month)

  return (
    <section
      className="month"
      aria-label={`${MONTHS_EN[month.month]} ${month.year}`}
      style={{
        // 4–6 rows share the screen height fairly: header + weekday row ≈ 1.6 rows
        flexGrow: rows.length + 1.6,
        gridTemplateRows: `auto auto repeat(${rows.length}, 1fr)`,
      }}
    >
      <header className="month__head">
        <h2 className="month__name">
          {MONTHS_EN[month.month]}
          <small lang="uk">{MONTHS_UA[month.month]}</small>
        </h2>
        <span className="month__year">{month.year}</span>
      </header>

      <div className="month__label month__label--week">
        <b>{WEEK_LABEL_EN}</b>
        <span lang="uk">{WEEK_LABEL_UA}</span>
      </div>
      {WEEKDAYS_EN.map((name, col) => (
        <div
          key={name}
          className={`month__label${isWeekendColumn(col) ? ' month__label--weekend' : ''}`}
        >
          <b>{name}</b>
          <span lang="uk">{WEEKDAYS_UA[col]}</span>
        </div>
      ))}

      {rows.map((row) => (
        <div key={row.days[0].key} className="month__row">
          <div className="month__week">{row.week}</div>
          {row.days.map((day, col) => (
            <DayCell key={day.key} day={day} today={today} weekend={isWeekendColumn(col)} />
          ))}
        </div>
      ))}
    </section>
  )
}

export default MonthGrid
