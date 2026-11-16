import { toDateKey, yearMonthOf } from './lib/dates'
import CalendarView from './components/CalendarView'

// T3: today is read once on load; T5 (useToday) updates it at midnight.
// T4 adds the top bar and navigation.
const today = toDateKey(new Date())

function App() {
  return (
    <div className="app">
      <CalendarView viewStart={yearMonthOf(today)} today={today} />
    </div>
  )
}

export default App
