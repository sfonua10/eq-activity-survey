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
  const [availability, setAvailability] = useState<Set<string>>(new Set())
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

  const toggleAvailability = (id: string) => {
    setAvailability((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
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
        availability: Array.from(availability),
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
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-4 flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-success/10">
            <svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl text-text">
            {name.trim() ? `Thanks, ${name.trim().split(' ')[0]}!` : 'Thanks!'}
          </h2>
          <p className="mt-2 text-sm text-text-muted">Redirecting to results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-lg px-5 py-8">
        {/* Header */}
        <div className="mb-8 flex items-baseline justify-between">
          <h1 className="font-serif text-2xl text-text">EQ Activities</h1>
          <Link to="/results" className="text-sm text-text-muted hover:text-accent transition-colors">
            Results →
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Activities */}
          <section>
            {errors.activities && (
              <p className="mb-2 text-xs text-accent">{errors.activities}</p>
            )}
            {activities === undefined ? (
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-[100px] animate-pulse rounded-2xl bg-border/50" />
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
          </section>

          {/* Availability */}
          <section>
            <h2 className="font-serif text-lg text-text mb-3">When works?</h2>
            <AvailabilityPicker selected={availability} onToggle={toggleAvailability} />
          </section>

          {/* Name + Suggestion */}
          <section className="flex flex-col gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              autoComplete="name"
              className="w-full rounded-xl bg-bg-card px-4 py-3 text-sm text-text placeholder-text-muted/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-shadow"
            />
            <SuggestionInput value={suggestion} onChange={setSuggestion} />
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || (selectedIds.size === 0 && !suggestion.trim())}
            className="w-full rounded-2xl bg-accent py-4 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-accent-hover active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed min-h-[56px]"
          >
            {submitting ? 'Sending...' : 'Done'}
          </button>
        </form>
      </div>
    </div>
  )
}
