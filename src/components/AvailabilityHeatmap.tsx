import { AVAILABILITY_SLOTS } from '../lib/availability'

interface AvailabilityHeatmapProps {
  availabilityCounts: Record<string, number>
  availabilityDayCounts: Record<string, Record<string, number>>
  totalResponses: number
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
const ROWS = [
  { label: 'Morning',   weekdaySlot: 'weekday_morning',  satSlot: 'saturday_morning' },
  { label: 'Afternoon', weekdaySlot: null,                satSlot: 'saturday_afternoon' },
  { label: 'Evening',   weekdaySlot: 'weekday_evening',  satSlot: 'saturday_evening' },
] as const

function cellColor(count: number, max: number): string {
  if (max === 0) return `rgba(0, 125, 165, 0.08)`
  const intensity = count / max
  return `rgba(0, 125, 165, ${(0.08 + intensity * 0.72).toFixed(2)})`
}

function cellTextColor(count: number, max: number): string {
  if (max === 0) return '#878A8C'
  const intensity = count / max
  return intensity > 0.5 ? 'white' : '#212225'
}

export default function AvailabilityHeatmap({
  availabilityCounts,
  availabilityDayCounts,
  totalResponses,
}: AvailabilityHeatmapProps) {
  if (totalResponses === 0) {
    return <p className="text-sm text-text-muted italic text-center py-4">No responses yet.</p>
  }

  // Collect all valid cell counts to find max
  const allCounts: number[] = []
  for (const row of ROWS) {
    for (const day of DAYS) {
      if (day === 'Sat') {
        if (row.satSlot) allCounts.push(availabilityCounts[row.satSlot] || 0)
      } else {
        if (row.weekdaySlot) {
          allCounts.push(availabilityDayCounts?.[row.weekdaySlot]?.[day] || 0)
        }
      }
    }
  }
  const max = Math.max(...allCounts, 0)

  return (
    <div className="flex flex-col gap-4">
      {/* Grid */}
      <div className="grid gap-1" style={{ gridTemplateColumns: 'auto repeat(6, 1fr)' }}>
        {/* Column headers */}
        <div />
        {DAYS.map((day) => (
          <div key={day} className="text-[10px] text-text-muted text-center font-medium py-0.5">
            {day}
          </div>
        ))}

        {/* Data rows */}
        {ROWS.map((row) => (
          <>
            {/* Row label */}
            <div
              key={`${row.label}-label`}
              className="text-[10px] text-text-muted flex items-center justify-end pr-1.5 font-medium"
            >
              {row.label}
            </div>

            {/* Cells */}
            {DAYS.map((day) => {
              const isSat = day === 'Sat'
              const isNA = !isSat && row.weekdaySlot === null

              if (isNA) {
                return (
                  <div
                    key={`${row.label}-${day}`}
                    className="rounded-md"
                    style={{ backgroundColor: '#EFF0F0', minHeight: '2.25rem' }}
                  />
                )
              }

              const count = isSat
                ? (row.satSlot ? availabilityCounts[row.satSlot] || 0 : 0)
                : (row.weekdaySlot ? availabilityDayCounts?.[row.weekdaySlot]?.[day] || 0 : 0)

              return (
                <div
                  key={`${row.label}-${day}`}
                  className="rounded-md flex items-center justify-center text-xs font-semibold"
                  style={{
                    backgroundColor: cellColor(count, max),
                    color: cellTextColor(count, max),
                    minHeight: '2.25rem',
                  }}
                >
                  {count > 0 ? count : ''}
                </div>
              )
            })}
          </>
        ))}
      </div>

      {/* Slot summary pills */}
      <div className="flex flex-wrap gap-2 pt-1 border-t border-border-light">
        {AVAILABILITY_SLOTS.map((slot) => {
          const count = availabilityCounts[slot.id] || 0
          const pct = totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0
          return (
            <div
              key={slot.id}
              className="flex items-center gap-1 rounded-full bg-bg-alt px-2.5 py-1 text-[11px]"
            >
              <span className="text-text-secondary font-medium">{slot.label}</span>
              <span className="text-text font-semibold">{count}</span>
              <span className="text-text-muted">({pct}%)</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
