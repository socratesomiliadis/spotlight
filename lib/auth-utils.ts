import { auth } from "@clerk/nextjs/server"

import { isUserPremium } from "./supabase/actions/subscriptions"

export async function requireAuth() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Authentication required")
  }

  return userId
}

export async function requirePremium() {
  const userId = await requireAuth()
  const isPremium = await isUserPremium(userId)

  if (!isPremium) {
    throw new Error("Premium subscription required")
  }

  return userId
}

export async function getCurrentUserPremiumStatus() {
  const { userId } = await auth()

  if (!userId) {
    return { isAuthenticated: false, isPremium: false }
  }

  const isPremium = await isUserPremium(userId)

  return { isAuthenticated: true, isPremium }
}
