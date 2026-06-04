import { mutation } from "./_generated/server"
import { v } from "convex/values"

import { awardValidator } from "./schema"
import { nowIso, requireStaff } from "./lib"

export const give = mutation({
  args: {
    projectId: v.id("projects"),
    awardType: awardValidator,
    awardedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireStaff(ctx)
    const existing = await ctx.db
      .query("awards")
      .withIndex("by_project_type", (q) =>
        q.eq("projectId", args.projectId).eq("awardType", args.awardType)
      )
      .first()
    const awardedAt = args.awardedAt || nowIso()
    if (existing) {
      await ctx.db.patch(existing._id, { awardedAt })
      return existing._id
    }
    return await ctx.db.insert("awards", {
      projectId: args.projectId,
      awardType: args.awardType,
      awardedAt,
      createdAt: nowIso(),
    })
  },
})

export const remove = mutation({
  args: {
    projectId: v.id("projects"),
    awardType: awardValidator,
  },
  handler: async (ctx, args) => {
    await requireStaff(ctx)
    const existing = await ctx.db
      .query("awards")
      .withIndex("by_project_type", (q) =>
        q.eq("projectId", args.projectId).eq("awardType", args.awardType)
      )
      .first()
    if (existing) {
      await ctx.db.delete(existing._id)
    }
    return { success: true }
  },
})
