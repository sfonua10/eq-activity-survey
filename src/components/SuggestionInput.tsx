import { useState } from 'react'

interface SuggestionInputProps {
  value: string
  onChange: (v: string) => void
}

export default function SuggestionInput({ value, onChange }: SuggestionInputProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center gap-2 py-2 text-left"
      >
        <span className="text-sm text-text-muted">
          {expanded ? '− Other idea?' : '+ Other idea?'}
        </span>
      </button>
      {expanded && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Suggest an activity..."
          rows={2}
          className="mt-1 w-full rounded-xl bg-bg-card px-4 py-3 text-sm text-text placeholder-text-muted/50 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
        />
      )}
    </div>
  )
}
