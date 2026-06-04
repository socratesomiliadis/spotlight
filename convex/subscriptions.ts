import { v } from "convex/values"

import { mutation, query } from "./_generated/server"
import { authUserId, nowIso, requireAuthUser } from "./lib"

function requireStripeWebhookSecret(secret: string) {
  const expected =
    process.env.CONVEX_STRIPE_WEBHOOK_SECRET ||
    process.env.STRIPE_WEBHOOK_SECRET
  if (!expected || secret !== expected) {
    throw new Error("Unauthorized")
  }
}

export const getCurrentForCheckout = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await requireAuthUser(ctx)
    const userId = authUserId(authUser)
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_auth_user_id", (q) => q.eq("authUserId", userId))
      .first()
    const active = await ctx.db
      .query("subscriptions")
      .withIndex("by_user_status", (q) =>
        q.eq("userAuthUserId", userId).eq("status", "active")
      )
      .first()
    const existingCustomer = await ctx.db
      .query("subscriptions")
      .withIndex("by_user_status", (q) => q.eq("userAuthUserId", userId))
      .first()

    return {
      userId,
      email: profile?.email || authUser.email,
      username:
        profile?.username || (authUser as any).username || authUser.email,
      activeSubscription: active,
      stripeCustomerId: existingCustomer?.stripeCustomerId || null,
    }
  },
})

export const upsert = mutation({
  args: {
    webhookSecret: v.string(),
    userAuthUserId: v.string(),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.optional(v.string()),
    stripePriceId: v.string(),
    status: v.string(),
    currentPeriodStart: v.optional(v.string()),
    currentPeriodEnd: v.optional(v.string()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    requireStripeWebhookSecret(args.webhookSecret)
    const now = nowIso()
    const { webhookSecret: _webhookSecret, ...subscription } = args
    const existing = args.stripeSubscriptionId
      ? await ctx.db
          .query("subscriptions")
          .withIndex("by_stripe_subscription", (q) =>
            q.eq("stripeSubscriptionId", args.stripeSubscriptionId)
          )
          .first()
      : null
    if (existing) {
      await ctx.db.patch(existing._id, { ...subscription, updatedAt: now })
      return existing._id
    }
    return await ctx.db.insert("subscriptions", {
      ...subscription,
      createdAt: now,
      updatedAt: now,
    })
  },
})

export const deleteByStripeSubscriptionId = mutation({
  args: { webhookSecret: v.string(), stripeSubscriptionId: v.string() },
  handler: async (ctx, args) => {
    requireStripeWebhookSecret(args.webhookSecret)
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_stripe_subscription", (q) =>
        q.eq("stripeSubscriptionId", args.stripeSubscriptionId)
      )
      .first()
    if (existing) await ctx.db.delete(existing._id)
    return { success: true }
  },
})

export const isCurrentPremium = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await requireAuthUser(ctx)
    const userId = authUserId(authUser)
    const active = await ctx.db
      .query("subscriptions")
      .withIndex("by_user_status", (q) =>
        q.eq("userAuthUserId", userId).eq("status", "active")
      )
      .collect()
    const now = nowIso()
    return active.some(
      (subscription) =>
        !subscription.currentPeriodEnd || subscription.currentPeriodEnd >= now
    )
  },
})
