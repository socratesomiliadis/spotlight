import { v } from "convex/values"

import { mutation, query } from "./_generated/server"
import {
  authUserId,
  nowIso,
  profileView,
  projectCardView,
  projectView,
  requireAuthUser,
  requireProfile,
} from "./lib"

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await requireAuthUser(ctx)
    const userId = authUserId(authUser)
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_auth_user_id", (q) => q.eq("authUserId", userId))
      .first()
    return profile ? profileView(ctx, profile) : null
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
    return profile ? profileView(ctx, profile) : null
  },
})

export const ensureCurrent = mutation({
  args: {
    username: v.optional(v.string()),
    displayName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const authUser = await requireAuthUser(ctx)
    const userId = authUserId(authUser)
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_auth_user_id", (q) => q.eq("authUserId", userId))
      .first()
    const now = nowIso()
    const email =
      typeof authUser.email === "string" && authUser.email
        ? authUser.email
        : existing?.email || `${userId}@users.spotlight.local`
    const username =
      args.username ||
      (authUser as any).username ||
      email.split("@")[0].replace(/[^a-zA-Z0-9_.]/g, "") ||
      `user-${userId.slice(-8)}`
    const displayName = args.displayName || authUser.name || username
    const image =
      typeof authUser.image === "string" && authUser.image
        ? authUser.image
        : undefined

    if (existing) {
      await ctx.db.patch(existing._id, {
        email,
        username,
        displayName,
        role: (authUser as any).role || existing.role || "user",
        updatedAt: now,
      })
      return existing._id
    }

    return await ctx.db.insert("profiles", {
      authUserId: userId,
      email,
      username,
      displayName,
      businessType: "",
      role: (authUser as any).role || "user",
      isUnclaimed: false,
      legacyAvatarUrl: image,
      createdAt: now,
      updatedAt: now,
    })
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
    await ctx.db.patch(profile._id, {
      isUnclaimed: false,
      publicMetadata: {
        ...(profile.publicMetadata || {}),
        is_unclaimed: false,
      },
      updatedAt: nowIso(),
    })
    return { success: true }
  },
})
