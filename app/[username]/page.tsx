import { notFound } from "next/navigation"

import { api } from "@/convex/_generated/api"
import { fetchAuthQuery } from "@/lib/auth-server"
import { cn } from "@/lib/utils"
import PreviewCursor from "@/components/Home/preview-cursor"
import PageWrapper from "@/components/page-wrapper"
import ProfileHeader from "@/app/[username]/components/ProfileHeader"
import ProfileNavigation from "@/app/[username]/components/ProfileNavigation"
import ProjectsGrid from "@/app/[username]/components/ProjectsGrid"

interface PageProps {
  params: Promise<{ username: string }>
}

export default async function UsernamePage({ params }: PageProps) {
  const { username } = await params

  // Get user by username
  const user = await fetchAuthQuery(api.profiles.getFullByUsername, {
    username,
  })

  if (!user) {
    notFound()
  }

  const viewer = await fetchAuthQuery(api.profiles.getCurrentSafe)
  const isOwnProfile = viewer?.user_id === user.user_id

  // Get initial follow status
  const { isFollowing } = await fetchAuthQuery(api.follows.getStatus, {
    targetAuthUserId: user.user_id,
  })

  return (
    <PageWrapper className="w-full pb-3 lg:pb-11 flex flex-col">
      <ProfileHeader
        user={user}
        isOwnProfile={isOwnProfile}
        initialFollowStatus={isFollowing}
      />

      {/* Content Section */}
      <div className={cn("w-full", "mt-4 lg:mt-0")}>
        <ProfileNavigation
          socialLinks={user.socials || undefined}
          websiteUrl={user.website_url || undefined}
        />
        <ProjectsGrid projects={user.project || undefined} />
      </div>
      <PreviewCursor />
    </PageWrapper>
  )
}
