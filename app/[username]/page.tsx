import { notFound } from "next/navigation"
import { auth } from "@clerk/nextjs/server"

import { getProfileFull } from "@/lib/supabase/actions/profile"
import { getFollowStatusAction } from "@/lib/supabase/follow-actions"
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
  const { userId } = await auth()

  // Get user by username
  let user
  try {
    const data = await getProfileFull(username)

    user = data
  } catch (error) {
    notFound()
  }

  if (!user) {
    notFound()
  }

  const isOwnProfile = userId === user.user_id

  // Get initial follow status
  const { isFollowing } = await getFollowStatusAction(user.user_id)

  return (
    <PageWrapper className="w-full pb-3 lg:pb-11 flex flex-col">
      <ProfileHeader
        user={user}
        isOwnProfile={isOwnProfile}
        initialFollowStatus={isFollowing}
      />

      {/* Content Section */}
      <div className={cn("w-full")}>
        <ProfileNavigation socialLinks={user.socials || undefined} />
        <ProjectsGrid projects={user.project || undefined} />
      </div>
      <PreviewCursor />
    </PageWrapper>
  )
}
