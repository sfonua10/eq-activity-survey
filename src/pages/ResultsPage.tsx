import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import ResultsChart from '../components/ResultsChart'
import SuggestionsList from '../components/SuggestionsList'
import QRCodeDisplay from '../components/QRCodeDisplay'
import QuickInsights from '../components/QuickInsights'
import CategoryRing from '../components/CategoryRing'
import AvailabilityHeatmap from '../components/AvailabilityHeatmap'

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
      <div className="min-h-screen">
        <div className="h-1 bg-gradient-to-r from-primary via-primary-hover to-secondary" />
        <div className="mx-auto max-w-lg px-5 py-8">
          {/* Header */}
          <div className="flex items-baseline justify-between mb-8">
            <div className="flex items-baseline gap-3">
              <div className="h-7 w-28 animate-pulse rounded-sm bg-border-light" />
              <div className="h-5 w-10 animate-pulse rounded-full bg-border-light" />
            </div>
            <div className="h-4 w-16 animate-pulse rounded-sm bg-border-light" />
          </div>

          {/* QR Code */}
          <section className="mb-8 rounded-sm bg-white p-6 shadow-sm border border-border-light">
            <div className="flex flex-col items-center gap-3">
              <div className="h-[160px] w-[160px] animate-pulse rounded-sm bg-border-light" />
              <div className="h-3 w-16 animate-pulse rounded-sm bg-border-light" />
            </div>
          </section>

          {/* Quick Insights */}
          <section className="mb-6">
            <div className="flex gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-white p-4 shadow-sm border border-border-light flex-1 flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-border-light" />
                  <div className="h-3 w-16 animate-pulse rounded-sm bg-border-light" />
                  <div className="h-2 w-12 animate-pulse rounded-sm bg-border-light" />
                </div>
              ))}
            </div>
          </section>

          {/* Activity Interest */}
          <section className="mb-6 rounded-sm bg-white p-5 shadow-sm border border-border-light">
            <div className="h-5 w-36 animate-pulse rounded-sm bg-border-light mb-4" />
            <div className="flex flex-col gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 animate-pulse rounded-full bg-border-light flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <div className="h-3.5 w-20 animate-pulse rounded-sm bg-border-light" />
                      <div className="h-3 w-10 animate-pulse rounded-sm bg-border-light" />
                    </div>
                    <div className="h-2 rounded-full bg-border-light overflow-hidden">
                      <div
                        className="h-full rounded-full animate-pulse bg-border"
                        style={{ width: `${Math.max(20, 100 - i * 14)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Category Breakdown */}
          <section className="mb-6 rounded-sm bg-white p-5 shadow-sm border border-border-light">
            <div className="h-5 w-44 animate-pulse rounded-sm bg-border-light mb-4" />
            <div className="flex flex-col items-center gap-5">
              <div className="h-40 w-40 animate-pulse rounded-full bg-border-light" />
              <div className="flex gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-border-light" />
                    <div className="h-3 w-14 animate-pulse rounded-sm bg-border-light" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Suggestions */}
          <section className="mb-6 rounded-sm bg-white p-5 shadow-sm border border-border-light">
            <div className="h-5 w-28 animate-pulse rounded-sm bg-border-light mb-4" />
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-sm bg-bg-alt border-l-4 border-border-light px-4 py-3">
                  <div className="h-3.5 w-full animate-pulse rounded-sm bg-border-light mb-2" />
                  <div className="h-3 w-24 animate-pulse rounded-sm bg-border-light" />
                </div>
              ))}
            </div>
          </section>

          {/* Availability */}
          <section className="mb-6 rounded-sm bg-white p-5 shadow-sm border border-border-light">
            <div className="h-5 w-28 animate-pulse rounded-sm bg-border-light mb-4" />
            <div className="grid gap-1" style={{ gridTemplateColumns: 'auto repeat(6, 1fr)' }}>
              <div />
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={`h-${i}`} className="h-3 animate-pulse rounded-sm bg-border-light mx-1" />
              ))}
              {Array.from({ length: 3 }).map((_, row) => (
                <>
                  <div key={`r-${row}`} className="h-3 w-14 animate-pulse rounded-sm bg-border-light self-center" />
                  {Array.from({ length: 6 }).map((_, col) => (
                    <div key={`c-${row}-${col}`} className="animate-pulse rounded-md bg-border-light" style={{ minHeight: '2.25rem' }} />
                  ))}
                </>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 pt-3 mt-4 border-t border-border-light">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-6 w-32 animate-pulse rounded-full bg-border-light" />
              ))}
            </div>
          </section>
        </div>
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
        <section className="mb-8 rounded-sm bg-white p-6 shadow-sm border border-border-light text-center">
          <QRCodeDisplay url={SURVEY_URL} />
        </section>

        {/* Seed button */}
        {!hasActivities && (
          <div className="mb-8 rounded-sm border-2 border-dashed border-border p-6 text-center">
            <p className="text-sm text-text-muted mb-3">No activities yet.</p>
            <button
              type="button"
              onClick={() => seed()}
              className="rounded-sm bg-secondary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary-hover transition-colors"
            >
              Load Activities
            </button>
          </div>
        )}

        {/* Quick Insights */}
        {hasActivities && results.totalResponses > 0 && (
          <section className="mb-6">
            <QuickInsights
              activities={results.activities}
              activityCounts={results.activityCounts}
              availabilityCounts={results.availabilityCounts}
              totalResponses={results.totalResponses}
            />
          </section>
        )}

        {/* Activity Rankings */}
        {hasActivities && (
          <section className="mb-6 rounded-sm bg-white p-5 shadow-sm border border-border-light">
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

        {/* Category Breakdown */}
        {hasActivities && results.totalResponses > 0 && (
          <section className="mb-6 rounded-sm bg-white p-5 shadow-sm border border-border-light">
            <h2 className="font-serif text-lg font-semibold text-text mb-4">Category Breakdown</h2>
            <CategoryRing
              activities={results.activities}
              activityCounts={results.activityCounts}
            />
          </section>
        )}

        {/* Suggestions */}
        <section className="mb-6 rounded-sm bg-white p-5 shadow-sm border border-border-light">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-serif text-lg font-semibold text-text">Suggestions</h2>
            {results.suggestions.length > 0 && (
              <span className="text-sm text-text-muted">{results.suggestions.length}</span>
            )}
          </div>
          <SuggestionsList suggestions={results.suggestions} />
        </section>

        {/* Availability */}
        <section className="mb-6 rounded-sm bg-white p-5 shadow-sm border border-border-light">
          <h2 className="font-serif text-lg font-semibold text-text mb-4">Availability</h2>
          <AvailabilityHeatmap
            availabilityCounts={results.availabilityCounts}
            availabilityDayCounts={(results as any).availabilityDayCounts ?? {}}
            totalResponses={results.totalResponses}
          />
        </section>

        {/* Reset */}
        {results.totalResponses > 0 && (
          <section className="rounded-sm bg-white p-5 shadow-sm border border-border-light">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="rounded-sm border border-border px-4 py-2.5 text-sm text-text-muted hover:text-error hover:border-error/30 transition-colors w-full"
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
                    className="flex-1 rounded-sm border border-border px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-alt transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
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
