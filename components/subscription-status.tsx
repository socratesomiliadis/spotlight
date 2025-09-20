import Link from "next/link"

import { getCurrentUserPremiumStatus } from "@/lib/auth-utils"

export async function SubscriptionStatus() {
  const { isAuthenticated, isPremium } = await getCurrentUserPremiumStatus()

  if (!isAuthenticated) {
    return null
  }

  if (isPremium) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-green-600 font-medium">Premium</span>
      </div>
    )
  }

  return (
    <Link
      href="/premium"
      className="flex items-center gap-2 text-sm hover:opacity-75 transition-opacity"
    >
      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
      <span className="text-gray-600">Upgrade to Premium</span>
    </Link>
  )
}
