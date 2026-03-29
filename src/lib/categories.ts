export const CATEGORY_CONFIG: Record<string, { label: string; color: string; emoji: string }> = {
  physical: { label: "Physical", color: "#0098C8", emoji: "💪" },
  social:   { label: "Social",   color: "#8B5CF6", emoji: "🎉" },
  outdoor:  { label: "Outdoor",  color: "#22C55E", emoji: "🌲" },
  service:  { label: "Service",  color: "#F59E0B", emoji: "🤝" },
}

export const CATEGORY_ORDER = ["physical", "social", "outdoor", "service"] as const
