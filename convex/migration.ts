import { v } from "convex/values"

import { components } from "./_generated/api"
import { action, mutation, query } from "./_generated/server"
import { nowIso } from "./lib"
import { awardValidator, categoryValidator } from "./schema"

function requireMigrationSecret(secret: string) {
  const expected = process.env.CONVEX_MIGRATION_SECRET
  if (!expected || secret !== expected) {
    throw new Error("Unauthorized")
  }
}

export const importProfile = mutation({
  args: {
    secret: v.string(),
    authUserId: v.string(),
    email: v.string(),
    username: v.string(),
    displayName: v.optional(v.string()),
    businessType: v.optional(v.string()),
    location: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
    bannerStorageId: v.optional(v.id("_storage")),
    legacyAvatarUrl: v.optional(v.string()),
    legacyBannerUrl: v.optional(v.string()),
    role: v.optional(v.string()),
    isUnclaimed: v.optional(v.boolean()),
    publicMetadata: v.optional(v.any()),
    instagram: v.optional(v.string()),
    linkedIn: v.optional(v.string()),
    twitter: v.optional(v.string()),
    createdAt: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireMigrationSecret(args.secret)
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_auth_user_id", (q) => q.eq("authUserId", args.authUserId))
      .first()
    const now = nowIso()
    const doc = {
      authUserId: args.authUserId,
      email: args.email,
      username: args.username,
      displayName: args.displayName,
      businessType: args.businessType || "",
      location: args.location,
      websiteUrl: args.websiteUrl,
      avatarStorageId: args.avatarStorageId,
      bannerStorageId: args.bannerStorageId,
      legacyAvatarUrl: args.legacyAvatarUrl,
      legacyBannerUrl: args.legacyBannerUrl,
      role: args.role || "user",
      isUnclaimed: args.isUnclaimed || false,
      publicMetadata: args.publicMetadata,
      instagram: args.instagram,
      linkedIn: args.linkedIn,
      twitter: args.twitter,
      createdAt: args.createdAt || now,
      updatedAt: args.updatedAt || now,
    }
    if (existing) {
      await ctx.db.patch(existing._id, doc)
      return existing._id
    }
    return await ctx.db.insert("profiles", doc)
  },
})

export const importProject = mutation({
  args: {
    secret: v.string(),
    ownerAuthUserId: v.string(),
    title: v.string(),
    slug: v.string(),
    category: categoryValidator,
    tags: v.array(v.string()),
    liveUrl: v.optional(v.string()),
    mainImageStorageId: v.optional(v.id("_storage")),
    bannerStorageId: v.optional(v.id("_storage")),
    previewStorageId: v.optional(v.id("_storage")),
    elementStorageIds: v.optional(v.array(v.id("_storage"))),
    legacySupabaseId: v.optional(v.string()),
    legacyMainImgUrl: v.optional(v.string()),
    legacyBannerUrl: v.optional(v.string()),
    legacyPreviewUrl: v.optional(v.string()),
    legacyElementsUrl: v.optional(v.array(v.string())),
    createdAt: v.optional(v.string()),
    updatedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireMigrationSecret(args.secret)
    const now = nowIso()
    const { secret: _secret, ...project } = args
    const existing = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first()
    if (existing) {
      await ctx.db.patch(existing._id, {
        ...project,
        elementStorageIds: args.elementStorageIds || [],
        createdAt: args.createdAt || existing.createdAt,
        updatedAt: args.updatedAt || now,
      })
      return existing._id
    }
    return await ctx.db.insert("projects", {
      ...project,
      elementStorageIds: args.elementStorageIds || [],
      createdAt: args.createdAt || now,
      updatedAt: args.updatedAt || now,
    })
  },
})

export const importAward = mutation({
  args: {
    secret: v.string(),
    projectId: v.id("projects"),
    awardType: awardValidator,
    awardedAt: v.string(),
    createdAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireMigrationSecret(args.secret)
    const existing = await ctx.db
      .query("awards")
      .withIndex("by_project_type", (q) =>
        q.eq("projectId", args.projectId).eq("awardType", args.awardType)
      )
      .collect()
    const matchingAward = existing.find(
      (award) => award.awardedAt === args.awardedAt
    )
    if (matchingAward) return matchingAward._id
    return await ctx.db.insert("awards", {
      projectId: args.projectId,
      awardType: args.awardType,
      awardedAt: args.awardedAt,
      createdAt: args.createdAt || nowIso(),
    })
  },
})

export const importFollow = mutation({
  args: {
    secret: v.string(),
    followerAuthUserId: v.string(),
    followingAuthUserId: v.string(),
    createdAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireMigrationSecret(args.secret)
    const existing = await ctx.db
      .query("follows")
      .withIndex("by_follower_following", (q) =>
        q
          .eq("followerAuthUserId", args.followerAuthUserId)
          .eq("followingAuthUserId", args.followingAuthUserId)
      )
      .first()
    if (existing) return existing._id
    return await ctx.db.insert("follows", {
      followerAuthUserId: args.followerAuthUserId,
      followingAuthUserId: args.followingAuthUserId,
      createdAt: args.createdAt || nowIso(),
    })
  },
})

export const importClerkUser = mutation({
  args: {
    secret: v.string(),
    clerkUserId: v.string(),
    email: v.string(),
    emailVerified: v.boolean(),
    name: v.string(),
    image: v.optional(v.string()),
    username: v.optional(v.string()),
    role: v.optional(v.string()),
    passwordDigest: v.optional(v.string()),
    passwordHasher: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    requireMigrationSecret(args.secret)

    if (
      args.passwordDigest &&
      args.passwordHasher &&
      args.passwordHasher !== "bcrypt"
    ) {
      throw new Error(
        `Unsupported password hasher for ${args.clerkUserId}: ${args.passwordHasher}`
      )
    }

    const existingByClerkId = await ctx.runQuery(
      components.betterAuth.adapter.findOne,
      {
        model: "user",
        where: [
          {
            field: "clerkUserId",
            operator: "eq",
            value: args.clerkUserId,
          },
        ],
      }
    )
    const existingByEmail = existingByClerkId
      ? null
      : await ctx.runQuery(components.betterAuth.adapter.findOne, {
          model: "user",
          where: [
            {
              field: "email",
              operator: "eq",
              value: args.email,
            },
          ],
        })

    let userId: string
    if (existingByClerkId) {
      userId = String(existingByClerkId._id)
    } else if (existingByEmail) {
      userId = String(existingByEmail._id)
    } else {
      const createdUser = await ctx.runMutation(
        components.betterAuth.adapter.create,
        {
          input: {
            model: "user",
            data: {
              name: args.name,
              email: args.email,
              emailVerified: args.emailVerified,
              image: args.image,
              createdAt: args.createdAt,
              updatedAt: args.updatedAt,
              role: args.role || "user",
              username: args.username,
              displayUsername: args.username,
              clerkUserId: args.clerkUserId,
            },
          },
        }
      )
      userId = String(createdUser._id)
    }

    if (existingByEmail && !existingByEmail.clerkUserId) {
      await ctx.runMutation(components.betterAuth.adapter.updateOne, {
        input: {
          model: "user",
          where: [
            {
              field: "_id",
              operator: "eq",
              value: userId,
            },
          ],
          update: {
            name: args.name,
            emailVerified: args.emailVerified,
            image: args.image,
            updatedAt: args.updatedAt,
            role: args.role || existingByEmail.role || "user",
            username: args.username || existingByEmail.username,
            displayUsername: args.username || existingByEmail.displayUsername,
            clerkUserId: args.clerkUserId,
          },
        },
      } as any)
    }

    if (!args.passwordDigest) {
      return { userId, credentialAccountId: null }
    }

    const existingAccount = await ctx.runQuery(
      components.betterAuth.adapter.findOne,
      {
        model: "account",
        where: [
          {
            field: "providerId",
            operator: "eq",
            value: "credential",
          },
          {
            field: "userId",
            operator: "eq",
            value: userId,
          },
        ],
      }
    )

    if (existingAccount) {
      return { userId, credentialAccountId: existingAccount._id }
    }

    const credentialAccount = await ctx.runMutation(
      components.betterAuth.adapter.create,
      {
        input: {
          model: "account",
          data: {
            accountId: userId,
            providerId: "credential",
            userId,
            password: args.passwordDigest,
            createdAt: args.createdAt,
            updatedAt: args.updatedAt,
          },
        },
      }
    )
    const credentialAccountId =
      typeof credentialAccount === "string"
        ? credentialAccount
        : credentialAccount._id

    return { userId, credentialAccountId }
  },
})

export const storeRemoteAsset = action({
  args: { secret: v.string(), url: v.string() },
  handler: async (ctx, args) => {
    requireMigrationSecret(args.secret)
    const response = await fetch(args.url)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${args.url}: ${response.status}`)
    }
    const blob = await response.blob()
    return await ctx.storage.store(blob)
  },
})

export const validateCounts = query({
  args: {},
  handler: async (ctx) => {
    const [profiles, projects, awards, follows, subscriptions] =
      await Promise.all([
        ctx.db.query("profiles").collect(),
        ctx.db.query("projects").collect(),
        ctx.db.query("awards").collect(),
        ctx.db.query("follows").collect(),
        ctx.db.query("subscriptions").collect(),
      ])
    return {
      profiles: profiles.length,
      projects: projects.length,
      awards: awards.length,
      follows: follows.length,
      subscriptions: subscriptions.length,
    }
  },
})
