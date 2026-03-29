import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submit = mutation({
  args: {
    memberName: v.optional(v.string()),
    selectedActivityIds: v.array(v.id("activities")),
    availability: v.array(v.string()),
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

    const availabilityCounts: Record<string, number> = {};
    for (const r of responses) {
      for (const slot of r.availability) {
        availabilityCounts[slot] = (availabilityCounts[slot] || 0) + 1;
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
