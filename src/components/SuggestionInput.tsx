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
        <span className="text-sm text-secondary font-medium">
          {expanded ? '− Other idea?' : '+ Other idea?'}
        </span>
      </button>
      {expanded && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Suggest an activity..."
          rows={2}
          className="mt-1 w-full rounded-lg bg-white border border-border px-4 py-3 text-sm text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary resize-none transition-shadow"
        />
      )}
    </div>
  )
}
