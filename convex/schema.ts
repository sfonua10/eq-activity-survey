import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  activities: defineTable({
    name: v.string(),
    emoji: v.string(),
    category: v.string(), // "physical" | "social" | "service" | "outdoor"
    sortOrder: v.number(),
  }),

  responses: defineTable({
    memberName: v.optional(v.string()),
    selectedActivityIds: v.array(v.id("activities")),
    availability: v.array(
      v.union(
        v.string(),
        v.object({
          slotId: v.string(),
          excludedDays: v.optional(v.array(v.string())),
        })
      )
    ),
    suggestedActivity: v.optional(v.string()),
    submittedAt: v.number(),
  }).index("by_submittedAt", ["submittedAt"]),
});
