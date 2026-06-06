import { redirect } from "next/navigation"
import { api } from "@/convex/_generated/api"

import { fetchAuthQuery } from "@/lib/auth-server"

import AccountSettingsClient from "../account-settings-client"

export default async function SettingsPage() {
  const user = await fetchAuthQuery(api.profiles.getCurrentSafe)
  if (!user) redirect("/?auth=sign-in")

  const isPremium = await fetchAuthQuery(api.subscriptions.isCurrentPremium)

  return <AccountSettingsClient user={user} isPremium={isPremium} />
}
