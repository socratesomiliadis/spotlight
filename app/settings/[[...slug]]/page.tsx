import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { api } from "@/convex/_generated/api"

import { signInUrl } from "@/lib/auth-flow"
import { fetchAuthQuery } from "@/lib/auth-server"
import { privateRobots } from "@/lib/seo"

import AccountSettingsClient from "../account-settings-client"

export const metadata: Metadata = {
  title: "Settings",
  robots: privateRobots,
}

export default async function SettingsPage() {
  const user = await fetchAuthQuery(api.profiles.getCurrentSafe)
  if (!user) redirect(signInUrl("/settings"))

  const isPremium = await fetchAuthQuery(api.subscriptions.isCurrentPremium)

  return <AccountSettingsClient user={user} isPremium={isPremium} />
}
