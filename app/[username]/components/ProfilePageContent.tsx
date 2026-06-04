"use client"

import { notFound } from "next/navigation"
import { api } from "@/convex/_generated/api"
import { Preloaded, usePreloadedQuery } from "convex/react"

import { cn } from "@/lib/utils"
import PreviewCursor from "@/components/Home/preview-cursor"
import ProfileHeader from "@/app/[username]/components/ProfileHeader"
import ProfileNavigation from "@/app/[username]/components/ProfileNavigation"
import ProjectsGrid from "@/app/[username]/components/ProjectsGrid"

export default function ProfilePageContent({
  preloadedProfile,
  username,
}: {
  preloadedProfile: Preloaded<typeof api.profiles.getProfilePage>
  username: string
}) {
  const profilePage = usePreloadedQuery(preloadedProfile)

  if (!profilePage) {
    notFound()
  }

  const { user, isOwnProfile, isFollowing, recommendedProjects } = profilePage

  return (
    <>
      <ProfileHeader
        user={user}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        profileUsername={username}
      />

      <div className={cn("w-full", "mt-4 lg:mt-0")}>
        <ProfileNavigation
          socialLinks={user.socials || undefined}
          websiteUrl={user.website_url || undefined}
        />
        <ProjectsGrid
          projects={user.project || undefined}
          recommendedProjects={recommendedProjects}
        />
      </div>
      <PreviewCursor />
    </>
  )
}
