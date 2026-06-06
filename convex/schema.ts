import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export const categoryValidator = v.union(
  v.literal("websites"),
  v.literal("design"),
  v.literal("films"),
  v.literal("crypto"),
  v.literal("startups"),
  v.literal("ai")
)

export const awardValidator = v.union(
  v.literal("otd"),
  v.literal("otm"),
  v.literal("oty"),
  v.literal("honorable")
)

export default defineSchema({
  profiles: defineTable({
    authUserId: v.string(),
    email: v.string(),
    username: v.string(),
    displayName: v.optional(v.string()),
    businessType: v.optional(v.string()),
    location: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
    bannerStorageId: v.optional(v.id("_storage")),
    isUnclaimed: v.boolean(),
    publicMetadata: v.optional(v.any()),
    instagram: v.optional(v.string()),
    linkedIn: v.optional(v.string()),
    twitter: v.optional(v.string()),
    legacyAvatarUrl: v.optional(v.string()),
    legacyBannerUrl: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_auth_user_id", ["authUserId"])
    .index("by_username", ["username"])
    .index("by_unclaimed", ["isUnclaimed"]),
  projects: defineTable({
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
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_owner", ["ownerAuthUserId"])
    .index("by_owner_created", ["ownerAuthUserId", "createdAt"])
    .index("by_category_created", ["category", "createdAt"])
    .index("by_created", ["createdAt"]),
  awards: defineTable({
    projectId: v.id("projects"),
    awardType: awardValidator,
    awardedAt: v.string(),
    createdAt: v.string(),
  })
    .index("by_project", ["projectId"])
    .index("by_project_type", ["projectId", "awardType"])
    .index("by_type_date", ["awardType", "awardedAt"]),
  follows: defineTable({
    followerAuthUserId: v.string(),
    followingAuthUserId: v.string(),
    createdAt: v.string(),
  })
    .index("by_follower_following", [
      "followerAuthUserId",
      "followingAuthUserId",
    ])
    .index("by_follower", ["followerAuthUserId"])
    .index("by_following", ["followingAuthUserId"]),
  subscriptions: defineTable({
    userAuthUserId: v.optional(v.string()),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.optional(v.string()),
    stripePriceId: v.string(),
    status: v.string(),
    currentPeriodStart: v.optional(v.string()),
    currentPeriodEnd: v.optional(v.string()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_user_status", ["userAuthUserId", "status"])
    .index("by_stripe_customer", ["stripeCustomerId"])
    .index("by_stripe_subscription", ["stripeSubscriptionId"]),
  roleAuditEvents: defineTable({
    actorAuthUserId: v.string(),
    targetAuthUserId: v.string(),
    targetBetterAuthUserId: v.string(),
    previousRole: v.string(),
    newRole: v.string(),
    createdAt: v.string(),
  })
    .index("by_actor_created", ["actorAuthUserId", "createdAt"])
    .index("by_target_created", ["targetAuthUserId", "createdAt"]),
})
