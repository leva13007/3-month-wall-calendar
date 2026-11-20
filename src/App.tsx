import { useState } from 'react'
import { addMonths, isSameYearMonth, toDateKey, yearMonthOf, type YearMonth } from './lib/dates'
import TopBar from './components/TopBar'
import CalendarView from './components/CalendarView'

// Today is read once on load; T5 (useToday) updates it at midnight.
const today = toDateKey(new Date())

function App() {
  const currentMonth = yearMonthOf(today)
  const [viewStart, setViewStart] = useState<YearMonth>(currentMonth)

  return (
    <div className="app">
      <TopBar
        onPrev={() => setViewStart((v) => addMonths(v, -1))}
        onNext={() => setViewStart((v) => addMonths(v, 1))}
        onToday={() => setViewStart(currentMonth)}
        isAtToday={isSameYearMonth(viewStart, currentMonth)}
      />
      <CalendarView viewStart={viewStart} today={today} />
    </div>
  )
}

export default App
