import type { DateKey, GridDay } from '../lib/dates'

type Props = {
  day: GridDay
  today: DateKey
  weekend: boolean
}

function DayCell({ day, today, weekend }: Props) {
  const classes = ['day']
  if (weekend) classes.push('day--weekend')
  if (!day.inMonth) classes.push('day--overflow')
  else if (day.key < today) classes.push('day--past')
  else if (day.key === today) classes.push('day--today')

  return (
    <div className={classes.join(' ')} data-date={day.key}>
      <span className="day__number">{day.day}</span>
    </div>
  )
}

export default DayCell
