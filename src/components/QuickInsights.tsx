import { AVAILABILITY_SLOTS } from '../lib/availability'
import { CATEGORY_CONFIG, CATEGORY_ORDER } from '../lib/categories'

interface Activity {
  _id: string
  name: string
  emoji: string
  category: string
}

interface QuickInsightsProps {
  activities: Activity[]
  activityCounts: Record<string, number>
  availabilityCounts: Record<string, number>
  totalResponses: number
}

export default function QuickInsights({ activities, activityCounts, availabilityCounts }: QuickInsightsProps) {
  // Top activity
  const topActivity = [...activities]
    .map((a) => ({ ...a, count: activityCounts[a._id] || 0 }))
    .sort((a, b) => b.count - a.count)[0]

  // Best time slot
  const bestSlotId = Object.entries(availabilityCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
  const bestSlot = AVAILABILITY_SLOTS.find((s) => s.id === bestSlotId)

  // Group vibe — category with highest total votes
  const categoryTotals: Record<string, number> = {}
  for (const activity of activities) {
    const count = activityCounts[activity._id] || 0
    categoryTotals[activity.category] = (categoryTotals[activity.category] || 0) + count
  }
  const topCategory = CATEGORY_ORDER.slice().sort(
    (a, b) => (categoryTotals[b] || 0) - (categoryTotals[a] || 0)
  )[0]
  const topCategoryConfig = CATEGORY_CONFIG[topCategory]

  return (
    <div className="flex gap-3">
      {/* Top Activity */}
      <div className="rounded-xl bg-white p-4 shadow-sm border border-border-light flex-1 text-center min-w-0">
        <div className="text-2xl mb-1">{topActivity?.emoji ?? '—'}</div>
        <div className="text-xs font-semibold text-text leading-tight truncate">
          {topActivity?.name ?? '—'}
        </div>
        <div className="text-[10px] text-text-muted mt-0.5">top pick</div>
      </div>

      {/* Best Time */}
      <div className="rounded-xl bg-white p-4 shadow-sm border border-border-light flex-1 text-center min-w-0">
        <div className="text-2xl mb-1">🗓️</div>
        <div className="text-xs font-semibold text-text leading-tight">
          {bestSlot ? bestSlot.label.replace('Weekday ', '').replace('Saturday ', 'Sat ') : '—'}
        </div>
        <div className="text-[10px] text-text-muted mt-0.5">best time</div>
      </div>

      {/* Group Vibe */}
      <div className="rounded-xl bg-white p-4 shadow-sm border border-border-light flex-1 text-center min-w-0">
        <div className="text-2xl mb-1">{topCategoryConfig?.emoji ?? '—'}</div>
        <div className="text-xs font-semibold text-text leading-tight">
          {topCategoryConfig?.label ?? '—'}
        </div>
        <div className="text-[10px] text-text-muted mt-0.5">group vibe</div>
      </div>
    </div>
  )
}
