import { notFound, redirect } from "next/navigation"

import { api } from "@/convex/_generated/api"
import { fetchAuthQuery } from "@/lib/auth-server"
import PageWrapper from "@/components/page-wrapper"

import EditProfileForm from "./components/EditProfileForm"

interface PageProps {
  params: Promise<{ username: string }>
}

export default async function EditPage({ params }: PageProps) {
  const { username } = await params
  const viewer = await fetchAuthQuery(api.profiles.getCurrentSafe)

  if (!viewer) {
    redirect("/")
  }

  // Get user by username with socials
  const user = await fetchAuthQuery(api.profiles.getByUsername, { username })

  if (!user) {
    notFound()
  }

  // Only allow users to edit their own profile
  if (viewer.user_id !== user.user_id) {
    redirect(`/${username}`)
  }

  return (
    <PageWrapper className="w-full flex flex-col pb-0">
      <EditProfileForm userAndSocials={user} />
    </PageWrapper>
  )
}
