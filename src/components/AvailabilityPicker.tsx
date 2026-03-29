import { AVAILABILITY_SLOTS, WEEKDAYS, isWeekdaySlot } from '../lib/availability'

interface AvailabilityPickerProps {
  selected: Map<string, Set<string>>
  onToggleSlot: (slotId: string) => void
  onToggleDay: (slotId: string, day: string) => void
}

export default function AvailabilityPicker({ selected, onToggleSlot, onToggleDay }: AvailabilityPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      {AVAILABILITY_SLOTS.map((slot) => {
        const isSelected = selected.has(slot.id)
        const excludedDays = selected.get(slot.id) ?? new Set<string>()
        const showDays = isSelected && isWeekdaySlot(slot.id)
        return (
          <div key={slot.id}>
            <button
              type="button"
              onClick={() => onToggleSlot(slot.id)}
              className={`w-full rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-95 text-left
                ${isSelected
                  ? 'bg-secondary text-white shadow-sm'
                  : 'bg-white border border-border text-text-secondary shadow-sm hover:border-secondary/40 hover:shadow-md'
                }`}
            >
              <span className="whitespace-nowrap">{slot.label}</span>
              <span className={`ml-1 text-xs ${isSelected ? 'text-white/70' : 'text-text-muted'}`}>
                {slot.sublabel}
              </span>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: showDays ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <div className="flex items-center gap-2 pt-2 pb-1 px-2">
                  <span className="text-xs text-text-muted shrink-0">Except</span>
                  {WEEKDAYS.map((day) => {
                    const isExcluded = excludedDays.has(day)
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => onToggleDay(slot.id, day)}
                        aria-pressed={!isExcluded}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-200 active:scale-95
                          ${isExcluded
                            ? 'bg-border-light text-text-muted line-through'
                            : 'bg-secondary-light text-secondary'
                          }`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
