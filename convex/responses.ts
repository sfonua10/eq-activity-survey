import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const availabilityEntryValidator = v.union(
  v.string(),
  v.object({
    slotId: v.string(),
    excludedDays: v.optional(v.array(v.string())),
  })
);

export const submit = mutation({
  args: {
    memberName: v.optional(v.string()),
    selectedActivityIds: v.array(v.id("activities")),
    availability: v.array(availabilityEntryValidator),
    suggestedActivity: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("responses", {
      ...args,
      submittedAt: Date.now(),
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("responses")
      .withIndex("by_submittedAt")
      .order("desc")
      .collect();
  },
});

export const aggregatedResults = query({
  args: {},
  handler: async (ctx) => {
    const responses = await ctx.db.query("responses").collect();
    const activities = await ctx.db.query("activities").collect();

    const activityCounts: Record<string, number> = {};
    for (const r of responses) {
      for (const id of r.selectedActivityIds) {
        activityCounts[id] = (activityCounts[id] || 0) + 1;
      }
    }

    const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const availabilityCounts: Record<string, number> = {};
    const availabilityDayCounts: Record<string, Record<string, number>> = {};

    for (const r of responses) {
      for (const entry of r.availability) {
        const slotId = typeof entry === "string" ? entry : entry.slotId;
        const excludedDays =
          typeof entry === "string" ? [] : (entry.excludedDays ?? []);

        availabilityCounts[slotId] = (availabilityCounts[slotId] || 0) + 1;

        if (slotId.startsWith("weekday_")) {
          if (!availabilityDayCounts[slotId]) availabilityDayCounts[slotId] = {};
          for (const day of WEEKDAYS) {
            if (!excludedDays.includes(day)) {
              availabilityDayCounts[slotId][day] =
                (availabilityDayCounts[slotId][day] || 0) + 1;
            }
          }
        }
      }
    }

    const suggestions = responses
      .filter((r) => r.suggestedActivity)
      .map((r) => ({
        name: r.memberName || "Anonymous",
        suggestion: r.suggestedActivity!,
        submittedAt: r.submittedAt,
      }));

    const sortedActivities = activities.sort((a, b) => a.sortOrder - b.sortOrder);

    return {
      totalResponses: responses.length,
      activityCounts,
      availabilityCounts,
      availabilityDayCounts,
      suggestions,
      activities: sortedActivities,
    };
  },
});

export const resetAll = mutation({
  args: {},
  handler: async (ctx) => {
    const responses = await ctx.db.query("responses").collect();
    for (const r of responses) {
      await ctx.db.delete(r._id);
    }
  },
});
