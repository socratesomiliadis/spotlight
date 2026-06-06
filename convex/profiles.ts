import { v } from "convex/values"

import { internalMutation, mutation, query } from "./_generated/server"
import {
  authUserId,
  normalizeRole,
  nowIso,
  profileView,
  projectCardView,
  projectView,
  requireAuthUser,
  requireProfile,
} from "./lib"
import { ensureProfileForAuthUser } from "./profileHelpers"

async function claimProfile(ctx: any, profile: any) {
  if (!profile.isUnclaimed) return { success: true, claimed: false }

  await ctx.db.patch(profile._id, {
    isUnclaimed: false,
    publicMetadata: {
      ...(profile.publicMetadata || {}),
      is_unclaimed: false,
    },
    updatedAt: nowIso(),
  })
  return { success: true, claimed: true }
}

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await requireAuthUser(ctx)
    const userId = authUserId(authUser)
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_auth_user_id", (q) => q.eq("authUserId", userId))
      .first()
    if (!profile) return null
    return {
      ...(await profileView(ctx, profile)),
      role: normalizeRole((authUser as any).role),
    }
  },
})

export const getCurrentSafe = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await requireAuthUser(ctx).catch(() => null)
    if (!authUser) return null
    const userId = authUserId(authUser)
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_auth_user_id", (q) => q.eq("authUserId", userId))
      .first()
    if (!profile) return null
    return {
      ...(await profileView(ctx, profile)),
      role: normalizeRole((authUser as any).role),
    }
  },
})

export const ensureCurrent = mutation({
  args: {
    username: v.optional(v.string()),
    displayName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const authUser = await requireAuthUser(ctx)
    return await ensureProfileForAuthUser(ctx, authUser, args)
  },
})

export const getByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first()
    return profile ? profileView(ctx, profile) : null
  },
})

export const getFullByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first()
    if (!profile) return null
    const view = await profileView(ctx, profile)
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_owner", (q) => q.eq("ownerAuthUserId", profile.authUserId))
      .collect()
    return {
      ...view,
      project: await Promise.all(
        projects.map((project) => projectView(ctx, project))
      ),
    }
  },
})

export const getProfilePage = query({
  args: { username: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first()
    if (!profile) return null

    const authUser = await requireAuthUser(ctx).catch(() => null)
    const viewerAuthUserId = authUser ? authUserId(authUser) : null
    const isOwnProfile = viewerAuthUserId === profile.authUserId
    const follow = viewerAuthUserId
      ? await ctx.db
          .query("follows")
          .withIndex("by_follower_following", (q) =>
            q
              .eq("followerAuthUserId", viewerAuthUserId)
              .eq("followingAuthUserId", profile.authUserId)
          )
          .first()
      : null
    const limit = args.limit ?? 24
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_owner_created", (q) =>
        q.eq("ownerAuthUserId", profile.authUserId)
      )
      .order("desc")
      .take(limit + 1)
    const recommendedProjects =
      projects.length > 0
        ? []
        : await ctx.db
            .query("projects")
            .withIndex("by_created")
            .order("desc")
            .take(4)
    const projectPage = projects.slice(0, limit + 1)
    const hasMoreProjects = projectPage.length > limit
    const visibleProjects = hasMoreProjects
      ? projectPage.slice(0, limit)
      : projectPage

    return {
      user: {
        ...(await profileView(ctx, profile)),
        project: await Promise.all(
          visibleProjects.map((project) => projectCardView(ctx, project))
        ),
      },
      isOwnProfile,
      isFollowing: !isOwnProfile && !!follow,
      projectsPage: {
        hasMore: hasMoreProjects,
        nextCursor: hasMoreProjects
          ? visibleProjects[visibleProjects.length - 1]?.createdAt
          : null,
      },
      recommendedProjects: await Promise.all(
        recommendedProjects.map((project) => projectCardView(ctx, project))
      ),
    }
  },
})

export const listProjectCardsPage = query({
  args: {
    username: v.string(),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first()
    if (!profile) {
      return { projects: [], hasMore: false, nextCursor: null }
    }

    const limit = args.limit ?? 24
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_owner_created", (q) => {
        const ownerQuery = q.eq("ownerAuthUserId", profile.authUserId)
        return args.cursor
          ? ownerQuery.lt("createdAt", args.cursor)
          : ownerQuery
      })
      .order("desc")
      .take(limit + 1)

    const page = projects.slice(0, limit + 1)
    const hasMore = page.length > limit
    const visibleProjects = hasMore ? page.slice(0, limit) : page

    return {
      projects: await Promise.all(
        visibleProjects.map((project) => projectCardView(ctx, project))
      ),
      hasMore,
      nextCursor: hasMore
        ? visibleProjects[visibleProjects.length - 1]?.createdAt
        : null,
    }
  },
})

export const getUnclaimed = query({
  args: {},
  handler: async (ctx) => {
    const profiles = await ctx.db
      .query("profiles")
      .withIndex("by_unclaimed", (q) => q.eq("isUnclaimed", true))
      .collect()
    return Promise.all(profiles.map((profile) => profileView(ctx, profile)))
  },
})

export const updateCurrent = mutation({
  args: {
    displayName: v.string(),
    location: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    avatarStorageId: v.optional(v.union(v.id("_storage"), v.null())),
    bannerStorageId: v.optional(v.union(v.id("_storage"), v.null())),
    linkedIn: v.optional(v.string()),
    instagram: v.optional(v.string()),
    twitter: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { profile } = await requireProfile(ctx)
    const updates: any = {
      displayName: args.displayName,
      location: args.location,
      websiteUrl: args.websiteUrl,
      linkedIn: args.linkedIn,
      instagram: args.instagram,
      twitter: args.twitter,
      updatedAt: nowIso(),
    }

    if ("avatarStorageId" in args) {
      updates.avatarStorageId =
        args.avatarStorageId === null ? undefined : args.avatarStorageId
      if (args.avatarStorageId === null) updates.legacyAvatarUrl = undefined
    }

    if ("bannerStorageId" in args) {
      updates.bannerStorageId =
        args.bannerStorageId === null ? undefined : args.bannerStorageId
      if (args.bannerStorageId === null) updates.legacyBannerUrl = undefined
    }

    await ctx.db.patch(profile._id, updates)
    return profile._id
  },
})

export const claimCurrent = mutation({
  args: {},
  handler: async (ctx) => {
    const { profile } = await requireProfile(ctx)
    return claimProfile(ctx, profile)
  },
})

export const claimByAuthUserId = internalMutation({
  args: {
    authUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_auth_user_id", (q) => q.eq("authUserId", args.authUserId))
      .first()

    if (!profile) return { success: false, claimed: false }
    return claimProfile(ctx, profile)
  },
})
