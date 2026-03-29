import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import ActivityCard from '../components/ActivityCard'
import AvailabilityPicker from '../components/AvailabilityPicker'
import SuggestionInput from '../components/SuggestionInput'

export default function SurveyPage() {
  const navigate = useNavigate()
  const activities = useQuery(api.activities.list)
  const submitResponse = useMutation(api.responses.submit)

  const [name, setName] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [availability, setAvailability] = useState<Map<string, Set<string>>>(new Map())
  const [suggestion, setSuggestion] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<{ activities?: string }>({})

  const toggleActivity = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
    setErrors((e) => ({ ...e, activities: undefined }))
  }

  const toggleAvailability = (slotId: string) => {
    setAvailability((prev) => {
      const next = new Map(prev)
      next.has(slotId) ? next.delete(slotId) : next.set(slotId, new Set())
      return next
    })
  }

  const toggleDay = (slotId: string, day: string) => {
    setAvailability((prev) => {
      const next = new Map(prev)
      const excluded = new Set(next.get(slotId) ?? [])
      if (excluded.has(day)) {
        excluded.delete(day)
      } else {
        if (excluded.size >= 4) {
          // All days would be excluded — deselect the slot entirely
          next.delete(slotId)
          return next
        }
        excluded.add(day)
      }
      next.set(slotId, excluded)
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: typeof errors = {}
    if (selectedIds.size === 0 && !suggestion.trim()) {
      newErrors.activities = 'Pick at least one'
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)
    try {
      await submitResponse({
        memberName: name.trim() || undefined,
        selectedActivityIds: Array.from(selectedIds) as any,
        availability: Array.from(availability.entries()).map(([slotId, excluded]) => ({
          slotId,
          excludedDays: excluded.size > 0 ? Array.from(excluded) : undefined,
        })),
        suggestedActivity: suggestion.trim() || undefined,
      })
      setSubmitted(true)
      setTimeout(() => navigate('/results'), 2000)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-gradient-to-b from-primary-light to-white">
        <div className="text-center">
          <div className="mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-primary/10">
            <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-bold text-primary">
            {name.trim() ? `Thanks, ${name.trim().split(' ')[0]}!` : 'Thanks!'}
          </h2>
          <p className="mt-2 text-sm text-text-secondary">Redirecting to results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Branded accent bar */}
      <div className="h-1 bg-gradient-to-r from-primary via-primary-hover to-secondary" />

      <div className="mx-auto max-w-lg px-5 py-8">
        {/* Header */}
        <div className="mb-8 flex items-baseline justify-between">
          <h1 className="font-serif text-2xl font-bold text-text">EQ Activities</h1>
          <Link to="/results" className="text-sm text-secondary hover:text-secondary-hover transition-colors">
            Results →
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Activities */}
          <section>
            {errors.activities && (
              <p className="mb-2 text-xs text-error">{errors.activities}</p>
            )}
            {activities === undefined ? (
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-[100px] animate-pulse rounded-sm bg-border-light" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {activities.map((activity) => (
                  <ActivityCard
                    key={activity._id}
                    name={activity.name}
                    emoji={activity.emoji}
                    selected={selectedIds.has(activity._id)}
                    onToggle={() => toggleActivity(activity._id)}
                  />
                ))}
              </div>
            )}
            <SuggestionInput value={suggestion} onChange={setSuggestion} />
          </section>

          {/* Availability */}
          <section>
            <h2 className="font-serif text-lg font-semibold text-text mb-3">When works?</h2>
            <AvailabilityPicker
              selected={availability}
              onToggleSlot={toggleAvailability}
              onToggleDay={toggleDay}
            />
          </section>

          {/* Name */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            autoComplete="name"
            className="w-full rounded-sm bg-white border border-border px-4 py-3 text-sm text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-shadow"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || (selectedIds.size === 0 && !suggestion.trim())}
            className="w-full rounded-sm bg-secondary py-4 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition-all duration-200 hover:bg-secondary-hover active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed min-h-[56px]"
          >
            {submitting ? 'Sending...' : 'Done'}
          </button>
        </form>
      </div>
    </div>
  )
}
