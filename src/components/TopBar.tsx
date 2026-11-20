import './TopBar.css'

type Props = {
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  /** true when the view already starts at the current month (US-2.2) */
  isAtToday: boolean
}

function TopBar({ onPrev, onNext, onToday, isAtToday }: Props) {
  return (
    <header className="topbar">
      <nav className="topbar__group" aria-label="Month navigation">
        <button type="button" className="topbar__btn" onClick={onPrev} aria-label="Previous month">
          ◀
        </button>
        <button
          type="button"
          className="topbar__btn topbar__btn--primary"
          onClick={onToday}
          disabled={isAtToday}
        >
          Today
        </button>
        <button type="button" className="topbar__btn" onClick={onNext} aria-label="Next month">
          ▶
        </button>
      </nav>

      <div className="topbar__title">Wall Calendar</div>

      <div className="topbar__group">
        {/* wired in T11 */}
        <button type="button" className="topbar__btn" disabled title="Coming soon">
          Export
        </button>
        <button type="button" className="topbar__btn" disabled title="Coming soon">
          Import
        </button>
      </div>
    </header>
  )
}

export default TopBar
