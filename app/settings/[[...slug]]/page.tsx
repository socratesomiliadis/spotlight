import { redirect } from "next/navigation"

import { api } from "@/convex/_generated/api"
import { fetchAuthQuery } from "@/lib/auth-server"

export default async function SettingsPage() {
  const user = await fetchAuthQuery(api.profiles.getCurrentSafe)
  if (!user) redirect("/?auth=sign-in")
  redirect(`/${user.username}/edit`)
}
