interface ActivityCardProps {
  name: string
  emoji: string
  selected: boolean
  onToggle: () => void
}

export default function ActivityCard({ name, emoji, selected, onToggle }: ActivityCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative flex flex-col items-center justify-center gap-1.5 rounded-sm p-4 text-center transition-all duration-200 min-h-[100px] w-full active:scale-95
        ${selected
          ? 'bg-primary-light border-2 border-primary/30 shadow-md'
          : 'bg-white border border-border-light shadow-sm hover:shadow-md hover:border-border'
        }`}
    >
      <span className={`text-4xl leading-none transition-transform duration-200 ${selected ? 'scale-110' : ''}`}>
        {emoji}
      </span>
      <span className={`text-xs font-semibold leading-tight ${selected ? 'text-primary' : 'text-text-secondary'}`}>
        {name}
      </span>
    </button>
  )
}
