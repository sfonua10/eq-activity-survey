import { AVAILABILITY_SLOTS } from '../lib/availability'

interface AvailabilityPickerProps {
  selected: Set<string>
  onToggle: (id: string) => void
}

export default function AvailabilityPicker({ selected, onToggle }: AvailabilityPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {AVAILABILITY_SLOTS.map((slot) => {
        const isSelected = selected.has(slot.id)
        return (
          <button
            key={slot.id}
            type="button"
            onClick={() => onToggle(slot.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-95
              ${isSelected
                ? 'bg-accent text-white shadow-sm'
                : 'bg-bg-card text-text-muted shadow-sm hover:shadow-md'
              }`}
          >
            <span className="whitespace-nowrap">{slot.label}</span>
            <span className={`ml-1 text-xs ${isSelected ? 'text-white/70' : 'text-text-muted/60'}`}>
              {slot.sublabel}
            </span>
          </button>
        )
      })}
    </div>
  )
}
