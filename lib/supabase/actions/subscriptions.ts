"use server"

import { createAdminClient } from "../server"

interface SubscriptionData {
  user_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  stripe_price_id: string
  status: string
  current_period_start?: string
  current_period_end?: string
  cancel_at_period_end?: boolean
}

export async function upsertSubscription(data: SubscriptionData) {
  const supabase = await createAdminClient()

  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: data.user_id,
      stripe_customer_id: data.stripe_customer_id,
      stripe_subscription_id: data.stripe_subscription_id,
      stripe_price_id: data.stripe_price_id,
      status: data.status,
      current_period_start: data.current_period_start,
      current_period_end: data.current_period_end,
      cancel_at_period_end: data.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "stripe_subscription_id",
    }
  )

  if (error) {
    console.error("Error upserting subscription:", error)
    throw error
  }
}

export async function deleteSubscription(stripe_subscription_id: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from("subscriptions")
    .delete()
    .eq("stripe_subscription_id", stripe_subscription_id)

  if (error) {
    console.error("Error deleting subscription:", error)
    throw error
  }
}

export async function getUserSubscription(user_id: string) {
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user_id)
    .eq("status", "active")
    .single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching user subscription:", error)
    throw error
  }

  return data
}

export async function isUserPremium(user_id: string): Promise<boolean> {
  const supabase = await createAdminClient()

  // Since the RPC function might not exist yet, we'll check directly
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user_id)
    .eq("status", "active")
    .gte("current_period_end", new Date().toISOString())
    .limit(1)

  if (error) {
    console.error("Error checking premium status:", error)
    return false
  }

  return data && data.length > 0
}

export async function getSubscriptionByStripeId(
  stripe_subscription_id: string
) {
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("stripe_subscription_id", stripe_subscription_id)
    .single()

  if (error) {
    console.error("Error fetching subscription by Stripe ID:", error)
    throw error
  }

  return data
}
