import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { api } from "@/convex/_generated/api"
import { fetchAuthQuery } from "@/lib/auth-server"
import { privateRobots } from "@/lib/seo"
import Lanyard from "@/components/Lanyard/Lanyard"

export const metadata: Metadata = {
  title: "Welcome",
  robots: privateRobots,
}

export default async function Welcome() {
  const user = await fetchAuthQuery(api.profiles.getCurrentSafe)

  if (!user) {
    redirect("/")
  }

  return (
    <div className="h-screen w-full lanyard-page relative bg-white">
      <Lanyard />
    </div>
  )
}
