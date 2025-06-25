import { notFound, redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"

import { getProfileAndSocials } from "@/lib/supabase/actions/profile"
import { createClient } from "@/lib/supabase/server"

import EditProfileForm from "./components/EditProfileForm"

interface PageProps {
  params: Promise<{ username: string }>
}

export default async function EditPage({ params }: PageProps) {
  const { username } = await params
  const { userId } = await auth()

  if (!userId) {
    redirect("/")
  }

  // Get user by username with socials
  let user
  try {
    const data = await getProfileAndSocials(username)

    user = data
  } catch (error) {
    notFound()
  }

  if (!user) {
    notFound()
  }

  // Only allow users to edit their own profile
  if (userId !== user.user_id) {
    redirect(`/${username}`)
  }

  return (
    <main className="w-screen px-[22vw] py-28">
      <div className="w-full rounded-3xl border-[1px] border-[#EAEAEA] flex flex-col">
        <EditProfileForm userAndSocials={user} />
      </div>
    </main>
  )
}
