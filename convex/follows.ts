import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

import { authUserId, nowIso, requireAuthUser } from "./lib"

export const getStatus = query({
  args: { targetAuthUserId: v.string() },
  handler: async (ctx, args) => {
    const authUser = await requireAuthUser(ctx).catch(() => null)
    const userId = authUser ? authUserId(authUser) : null
    if (!userId || userId === args.targetAuthUserId) {
      return { isFollowing: false }
    }
    const follow = await ctx.db
      .query("follows")
      .withIndex("by_follower_following", (q) =>
        q.eq("followerAuthUserId", userId).eq("followingAuthUserId", args.targetAuthUserId)
      )
      .first()
    return { isFollowing: !!follow }
  },
})

export const toggle = mutation({
  args: { targetAuthUserId: v.string() },
  handler: async (ctx, args) => {
    const authUser = await requireAuthUser(ctx)
    const userId = authUserId(authUser)
    if (userId === args.targetAuthUserId) {
      throw new Error("Cannot follow yourself")
    }
    const existing = await ctx.db
      .query("follows")
      .withIndex("by_follower_following", (q) =>
        q.eq("followerAuthUserId", userId).eq("followingAuthUserId", args.targetAuthUserId)
      )
      .first()
    if (existing) {
      await ctx.db.delete(existing._id)
      return { success: true, isFollowing: false }
    }
    await ctx.db.insert("follows", {
      followerAuthUserId: userId,
      followingAuthUserId: args.targetAuthUserId,
      createdAt: nowIso(),
    })
    return { success: true, isFollowing: true }
  },
})
