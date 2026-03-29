import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import ResultsChart from '../components/ResultsChart'
import SuggestionsList from '../components/SuggestionsList'
import QRCodeDisplay from '../components/QRCodeDisplay'
import { AVAILABILITY_SLOTS } from '../lib/availability'

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
      <div className="mx-auto max-w-lg px-5 py-8">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-8">
          <div className="flex items-baseline gap-3">
            <h1 className="font-serif text-2xl text-text">Results</h1>
            <span className="rounded-full bg-accent/10 text-accent text-sm font-medium px-2.5 py-0.5">
              {results.totalResponses}
            </span>
          </div>
          <Link to="/" className="text-sm text-text-muted hover:text-accent transition-colors">
            ← Survey
          </Link>
        </div>

        {/* QR Code */}
        <section className="mb-8 rounded-2xl bg-bg-card p-6 shadow-sm text-center">
          <QRCodeDisplay url={SURVEY_URL} />
        </section>

        {/* Seed button */}
        {!hasActivities && (
          <div className="mb-8 rounded-2xl border-2 border-dashed border-border p-6 text-center">
            <p className="text-sm text-text-muted mb-3">No activities yet.</p>
            <button
              type="button"
              onClick={() => seed()}
              className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
            >
              Load Activities
            </button>
          </div>
        )}

        {/* Activity Rankings */}
        {hasActivities && (
          <section className="mb-6 rounded-2xl bg-bg-card p-5 shadow-sm">
            <h2 className="font-serif text-lg text-text mb-4">Activity Interest</h2>
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
        <section className="mb-6 rounded-2xl bg-bg-card p-5 shadow-sm">
          <h2 className="font-serif text-lg text-text mb-4">Availability</h2>
          {results.totalResponses === 0 ? (
            <p className="text-sm text-text-muted italic text-center py-4">No responses yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {AVAILABILITY_SLOTS.map((slot) => {
                const count = results.availabilityCounts[slot.id] || 0
                const pct = results.totalResponses > 0 ? Math.round((count / results.totalResponses) * 100) : 0
                return (
                  <div key={slot.id} className="rounded-xl bg-bg p-3 text-center">
                    <div className="text-2xl font-bold text-text">{count}</div>
                    <div className="text-xs font-medium text-text-muted mt-1">{slot.label}</div>
                    <div className="text-xs text-text-muted/60">{slot.sublabel}</div>
                    <div className="mt-1 text-xs font-medium text-success">{pct}%</div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Suggestions */}
        <section className="mb-6 rounded-2xl bg-bg-card p-5 shadow-sm">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="font-serif text-lg text-text">Suggestions</h2>
            {results.suggestions.length > 0 && (
              <span className="text-sm text-text-muted">{results.suggestions.length}</span>
            )}
          </div>
          <SuggestionsList suggestions={results.suggestions} />
        </section>

        {/* Reset */}
        {results.totalResponses > 0 && (
          <section className="rounded-2xl bg-bg-card p-5 shadow-sm">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="rounded-xl border border-border px-4 py-2.5 text-sm text-text-muted hover:text-accent hover:border-accent/30 transition-colors w-full"
              >
                Reset All
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-accent text-center">
                  Delete all {results.totalResponses} response{results.totalResponses !== 1 ? 's' : ''}?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm text-text-muted hover:bg-bg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
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
