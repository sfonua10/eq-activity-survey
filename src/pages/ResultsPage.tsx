import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import ResultsChart from '../components/ResultsChart'
import SuggestionsList from '../components/SuggestionsList'
import QRCodeDisplay from '../components/QRCodeDisplay'
import { AVAILABILITY_SLOTS, WEEKDAYS, isWeekdaySlot } from '../lib/availability'

const SURVEY_URL = typeof window !== 'undefined'
  ? `${window.location.origin}${import.meta.env.BASE_URL}`
  : ''

export default function ResultsPage() {
  const results = useQuery(api.responses.aggregatedResults)
  const seed = useMutation(api.activities.seed)
  const resetAll = useMutation(api.responses.resetAll)
  const [confirmReset, setConfirmReset] = useState(false)

  if (results === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-text-muted text-sm">Loading...</div>
      </div>
    )
  }

  const hasActivities = results.activities.length > 0

  const handleReset = async () => {
    await resetAll()
    setConfirmReset(false)
  }

  return (
    <div className="min-h-screen">
      {/* Branded accent bar */}
      <div className="h-1 bg-gradient-to-r from-primary via-primary-hover to-secondary" />

      <div className="mx-auto max-w-lg px-5 py-8">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-8">
          <div className="flex items-baseline gap-3">
            <h1 className="font-serif text-2xl font-bold text-text">Results</h1>
            <span className="rounded-full bg-primary-light text-primary text-sm font-semibold px-2.5 py-0.5">
              {results.totalResponses}
            </span>
          </div>
          <Link to="/" className="text-sm text-secondary hover:text-secondary-hover transition-colors">
            ← Survey
          </Link>
        </div>

        {/* QR Code */}
        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm border border-border-light text-center">
          <QRCodeDisplay url={SURVEY_URL} />
        </section>

        {/* Seed button */}
        {!hasActivities && (
          <div className="mb-8 rounded-xl border-2 border-dashed border-border p-6 text-center">
            <p className="text-sm text-text-muted mb-3">No activities yet.</p>
            <button
              type="button"
              onClick={() => seed()}
              className="rounded-lg bg-secondary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary-hover transition-colors"
            >
              Load Activities
            </button>
          </div>
        )}

        {/* Activity Rankings */}
        {hasActivities && (
          <section className="mb-6 rounded-xl bg-white p-5 shadow-sm border border-border-light">
            <h2 className="font-serif text-lg font-semibold text-text mb-4">Activity Interest</h2>
            {results.totalResponses === 0 ? (
              <p className="text-sm text-text-muted italic text-center py-4">
                No responses yet.
              </p>
            ) : (
              <ResultsChart
                activities={results.activities}
                activityCounts={results.activityCounts}
                totalResponses={results.totalResponses}
              />
            )}
          </section>
        )}

        {/* Availability */}
        <section className="mb-6 rounded-xl bg-white p-5 shadow-sm border border-border-light">
          <h2 className="font-serif text-lg font-semibold text-text mb-4">Availability</h2>
          {results.totalResponses === 0 ? (
            <p className="text-sm text-text-muted italic text-center py-4">No responses yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {AVAILABILITY_SLOTS.map((slot) => {
                const count = results.availabilityCounts[slot.id] || 0
                const pct = results.totalResponses > 0 ? Math.round((count / results.totalResponses) * 100) : 0
                const dayCounts = (results as any).availabilityDayCounts?.[slot.id] as Record<string, number> | undefined
                return (
                  <div key={slot.id} className="rounded-lg bg-bg-alt p-3 text-center">
                    <div className="text-2xl font-bold text-text">{count}</div>
                    <div className="text-xs font-medium text-text-secondary mt-1">{slot.label}</div>
                    <div className="text-xs text-text-muted">{slot.sublabel}</div>
                    <div className="mt-1 text-xs font-semibold text-primary">{pct}%</div>
                    {isWeekdaySlot(slot.id) && dayCounts && count > 0 && (
                      <div className="flex gap-0.5 mt-2 justify-center">
                        {WEEKDAYS.map((day) => {
                          const dayCount = dayCounts[day] ?? 0
                          const intensity = count > 0 ? dayCount / count : 0
                          return (
                            <div
                              key={day}
                              className="flex flex-col items-center rounded px-1 py-0.5"
                              style={{ backgroundColor: `rgba(89, 37, 105, ${(0.08 + intensity * 0.38).toFixed(2)})` }}
                            >
                              <span className="text-[9px] text-text-muted leading-none">{day}</span>
                              <span className="text-[11px] font-semibold text-text leading-tight">{dayCount}</span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Suggestions */}
        <section className="mb-6 rounded-xl bg-white p-5 shadow-sm border border-border-light">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-serif text-lg font-semibold text-text">Suggestions</h2>
            {results.suggestions.length > 0 && (
              <span className="text-sm text-text-muted">{results.suggestions.length}</span>
            )}
          </div>
          <SuggestionsList suggestions={results.suggestions} />
        </section>

        {/* Reset */}
        {results.totalResponses > 0 && (
          <section className="rounded-xl bg-white p-5 shadow-sm border border-border-light">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="rounded-lg border border-border px-4 py-2.5 text-sm text-text-muted hover:text-error hover:border-error/30 transition-colors w-full"
              >
                Reset All
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-error text-center">
                  Delete all {results.totalResponses} response{results.totalResponses !== 1 ? 's' : ''}?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-alt transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
                  >
                    Yes, Reset
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
