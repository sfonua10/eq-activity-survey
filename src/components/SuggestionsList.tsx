interface Suggestion {
  name: string
  suggestion: string
  submittedAt: number
}

interface SuggestionsListProps {
  suggestions: Suggestion[]
}

export default function SuggestionsList({ suggestions }: SuggestionsListProps) {
  if (suggestions.length === 0) {
    return <p className="text-sm text-text-muted italic">No suggestions yet.</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {suggestions.map((s, i) => (
        <li key={i} className="rounded-xl bg-accent-light/50 px-4 py-3">
          <p className="text-sm text-text">{s.suggestion}</p>
          <p className="text-xs text-text-muted mt-1">— {s.name}</p>
        </li>
      ))}
    </ul>
  )
}
