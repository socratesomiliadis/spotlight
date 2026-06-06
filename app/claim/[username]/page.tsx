import { notFound } from "next/navigation"

import { api } from "@/convex/_generated/api"
import { fetchAuthQuery } from "@/lib/auth-server"
import { privateRobots } from "@/lib/seo"
import PageWrapper from "@/components/page-wrapper"

import ClaimAccountForm from "./components/ClaimAccountForm"

interface ClaimPageProps {
  params: Promise<{ username: string }>
}

export default async function ClaimPage({ params }: ClaimPageProps) {
  const { username } = await params

  // Get the unclaimed user profile
  const user = await fetchAuthQuery(api.profiles.getByUsername, { username })

  if (!user || !user.is_unclaimed) {
    notFound()
  }

  return (
    <PageWrapper className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ClaimAccountForm user={user} />
      </div>
    </PageWrapper>
  )
}

export async function generateMetadata({ params }: ClaimPageProps) {
  const { username } = await params

  return {
    title: `Claim @${username} | Spotlight`,
    description: `Claim the unclaimed account @${username} on Spotlight`,
    robots: privateRobots,
  }
}
