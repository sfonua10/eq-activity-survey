import { CATEGORY_CONFIG, CATEGORY_ORDER } from '../lib/categories'

interface Activity {
  _id: string
  category: string
}

interface CategoryRingProps {
  activities: Activity[]
  activityCounts: Record<string, number>
}

export default function CategoryRing({ activities, activityCounts }: CategoryRingProps) {
  // Sum votes by category
  const categoryTotals: Record<string, number> = {}
  for (const activity of activities) {
    const count = activityCounts[activity._id] || 0
    categoryTotals[activity.category] = (categoryTotals[activity.category] || 0) + count
  }

  const grandTotal = CATEGORY_ORDER.reduce((sum, cat) => sum + (categoryTotals[cat] || 0), 0)

  if (grandTotal === 0) {
    return <p className="text-sm text-text-muted italic text-center py-4">No responses yet.</p>
  }

  // Build conic-gradient stops
  let cumulativeDeg = 0
  const stops: string[] = []
  for (const cat of CATEGORY_ORDER) {
    const total = categoryTotals[cat] || 0
    if (total === 0) continue
    const deg = (total / grandTotal) * 360
    const config = CATEGORY_CONFIG[cat]
    stops.push(`${config.color} ${cumulativeDeg.toFixed(1)}deg ${(cumulativeDeg + deg).toFixed(1)}deg`)
    cumulativeDeg += deg
  }
  const gradient = `conic-gradient(${stops.join(', ')})`

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Donut ring */}
      <div
        className="relative flex-shrink-0"
        style={{
          width: '10rem',
          height: '10rem',
          borderRadius: '50%',
          background: gradient,
        }}
      >
        {/* Donut hole */}
        <div
          className="absolute rounded-full bg-white flex flex-col items-center justify-center"
          style={{ inset: '1.5rem' }}
        >
          <span className="text-xl font-bold text-text">{grandTotal}</span>
          <span className="text-[10px] text-text-muted leading-none">votes</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
        {CATEGORY_ORDER.map((cat) => {
          const config = CATEGORY_CONFIG[cat]
          const total = categoryTotals[cat] || 0
          const pct = Math.round((total / grandTotal) * 100)
          return (
            <div key={cat} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: config.color }}
              />
              <span className="text-xs text-text-secondary">
                {config.label}
              </span>
              <span className="text-xs font-semibold text-text">{total}</span>
              <span className="text-xs text-text-muted">({pct}%)</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
