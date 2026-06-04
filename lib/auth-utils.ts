import { api } from "@/convex/_generated/api"

import { fetchAuthQuery } from "./auth-server"

export async function requireAuth() {
  const user = await fetchAuthQuery(api.profiles.getCurrentSafe)

  if (!user) {
    throw new Error("Authentication required")
  }

  return user.user_id
}

export async function requirePremium() {
  const userId = await requireAuth()
  const isPremium = await fetchAuthQuery(api.subscriptions.isCurrentPremium)

  if (!isPremium) {
    throw new Error("Premium subscription required")
  }

  return userId
}

export async function getCurrentUserPremiumStatus() {
  const user = await fetchAuthQuery(api.profiles.getCurrentSafe)

  if (!user) {
    return { isAuthenticated: false, isPremium: false }
  }

  const isPremium = await fetchAuthQuery(api.subscriptions.isCurrentPremium)

  return { isAuthenticated: true, isPremium }
}
