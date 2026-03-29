import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const activities = await ctx.db.query("activities").collect();
    return activities.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("activities").first();
    if (existing) return;

    const activities = [
      // High confidence
      { name: "Pickleball", emoji: "\u{1F3D3}", category: "physical", sortOrder: 1 },
      { name: "Golf", emoji: "\u26F3", category: "physical", sortOrder: 2 },
      { name: "Hiking", emoji: "\u{1F97E}", category: "outdoor", sortOrder: 3 },
      { name: "BBQ / Cookout", emoji: "\u{1F356}", category: "social", sortOrder: 4 },
      { name: "Bowling", emoji: "\u{1F3B3}", category: "social", sortOrder: 5 },
      { name: "Board Game Night", emoji: "\u{1F3B2}", category: "social", sortOrder: 6 },
      // Strong options
      { name: "Fishing", emoji: "\u{1F3A3}", category: "outdoor", sortOrder: 7 },
      { name: "Camping", emoji: "\u{1F3D5}\uFE0F", category: "outdoor", sortOrder: 8 },
      { name: "Basketball", emoji: "\u{1F3C0}", category: "physical", sortOrder: 9 },
      { name: "Disc Golf", emoji: "\u{1F94F}", category: "physical", sortOrder: 10 },
      { name: "Mountain Biking", emoji: "\u{1F6B5}", category: "outdoor", sortOrder: 11 },
      { name: "Shooting Range", emoji: "\u{1F3AF}", category: "physical", sortOrder: 12 },
      // Worth including
      { name: "Softball", emoji: "\u{1F94E}", category: "physical", sortOrder: 13 },
      { name: "Volleyball", emoji: "\u{1F3D0}", category: "physical", sortOrder: 14 },
      { name: "Video Game Night", emoji: "\u{1F3AE}", category: "social", sortOrder: 15 },
      { name: "Service Project", emoji: "\u{1F91D}", category: "service", sortOrder: 16 },
    ];

    for (const activity of activities) {
      await ctx.db.insert("activities", activity);
    }
  },
});

export const reseed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("activities").collect();
    for (const a of existing) {
      await ctx.db.delete(a._id);
    }
  },
});
