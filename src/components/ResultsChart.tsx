import { CATEGORY_CONFIG } from '../lib/categories'

interface Activity {
  _id: string
  name: string
  emoji: string
  category: string
}

interface ResultsChartProps {
  activities: Activity[]
  activityCounts: Record<string, number>
  totalResponses: number
}

const MEDALS = ['🥇', '🥈', '🥉']

export default function ResultsChart({ activities, activityCounts, totalResponses }: ResultsChartProps) {
  const sorted = [...activities]
    .map((a) => ({ ...a, count: activityCounts[a._id] || 0 }))
    .sort((a, b) => b.count - a.count)

  const max = sorted[0]?.count || 1

  // Determine how many medal positions to award (only for activities with votes)
  let medalCutoff = 0
  for (let i = 0; i < sorted.length && i < 3; i++) {
    if (sorted[i].count > 0) medalCutoff = i + 1
  }

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((activity, index) => {
        const pct = totalResponses > 0 ? Math.round((activity.count / totalResponses) * 100) : 0
        const barColor = CATEGORY_CONFIG[activity.category]?.color ?? '#007DA5'
        const medal = index < medalCutoff ? MEDALS[index] : null
        return (
          <div key={activity._id} className="flex items-center gap-3">
            <span className="text-2xl w-8 text-center flex-shrink-0">{activity.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-sm font-semibold text-text truncate">{activity.name}</span>
                <span className="text-xs text-text-muted ml-2 flex-shrink-0 flex items-center gap-1">
                  {medal && <span>{medal}</span>}
                  {activity.count} <span className="text-text-muted/60">({pct}%)</span>
                </span>
              </div>
              <div className="h-2 rounded-full bg-border-light overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${max > 0 ? (activity.count / max) * 100 : 0}%`,
                    backgroundColor: barColor,
                  }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
