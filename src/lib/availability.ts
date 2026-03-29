export const AVAILABILITY_SLOTS = [
  { id: "weekday_morning", label: "Weekday Morning", sublabel: "6–9 AM" },
  { id: "weekday_evening", label: "Weekday Evening", sublabel: "6–9 PM" },
  { id: "saturday_morning", label: "Saturday Morning", sublabel: "8–11 AM" },
  { id: "saturday_afternoon", label: "Saturday Afternoon", sublabel: "12–3 PM" },
  { id: "saturday_evening", label: "Saturday Evening", sublabel: "5–8 PM" },
] as const;

export type AvailabilitySlotId = (typeof AVAILABILITY_SLOTS)[number]["id"];

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
export type Weekday = (typeof WEEKDAYS)[number];

export function isWeekdaySlot(slotId: string): boolean {
  return slotId.startsWith("weekday_");
}
