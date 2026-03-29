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
      className={`relative flex flex-col items-center justify-center gap-1.5 rounded-2xl p-4 text-center transition-all duration-200 min-h-[100px] w-full active:scale-95
        ${selected
          ? 'bg-accent-light shadow-md ring-2 ring-accent/30'
          : 'bg-bg-card shadow-sm hover:shadow-md'
        }`}
    >
      <span className={`text-4xl leading-none transition-transform duration-200 ${selected ? 'scale-110' : ''}`}>
        {emoji}
      </span>
      <span className={`text-xs font-medium leading-tight ${selected ? 'text-accent' : 'text-text-muted'}`}>
        {name}
      </span>
    </button>
  )
}
