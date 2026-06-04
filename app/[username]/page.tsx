import { notFound } from "next/navigation"
import { api } from "@/convex/_generated/api"
import { preloadedQueryResult } from "convex/nextjs"

import { preloadAuthQuery } from "@/lib/auth-server"
import PageWrapper from "@/components/page-wrapper"

import ProfilePageContent from "./components/ProfilePageContent"

interface PageProps {
  params: Promise<{ username: string }>
}

export default async function UsernamePage({ params }: PageProps) {
  const { username } = await params

  const preloadedProfile = await preloadAuthQuery(api.profiles.getProfilePage, {
    username,
  })

  if (!preloadedQueryResult(preloadedProfile)) {
    notFound()
  }

  return (
    <PageWrapper className="w-full pb-3 lg:pb-11 flex flex-col">
      <ProfilePageContent
        preloadedProfile={preloadedProfile}
        username={username}
      />
    </PageWrapper>
  )
}
