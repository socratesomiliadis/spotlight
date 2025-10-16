import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"

import { createClient } from "@/lib/supabase/server"

import AuthDrawer from "../auth-drawer"
import CustomButton from "../custom-button"
import SpotlightLogo from "../SVGs/spotlight-logo"
import UserBtn from "./user-button"

async function getAvatarUrl(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profile")
    .select("avatar_url")
    .eq("user_id", userId)
    .single()

  if (error) {
    console.log(error)
    return null
  }

  return data?.avatar_url
}

export default async function Header() {
  const { userId } = await auth()

  let avatarUrl

  if (userId) {
    avatarUrl = await getAvatarUrl(userId)
  }

  return (
    <header className="w-screen absolute top-4 lg:top-6 px-3 lg:px-[22vw] flex flex-row items-center justify-between z-50">
      <Link
        href="/"
        className="w-28 lg:w-38 header-logo flex items-center text-black"
      >
        <SpotlightLogo />
      </Link>
      <div className="flex flex-row items-center gap-2">
        {userId && (
          <>
            <UserBtn avatarUrl={avatarUrl || ""} />
            {/* <UserButton /> */}
            <CustomButton
              text="Premium"
              href="/premium"
              className="hidden lg:flex"
            />
          </>
        )}
        {!userId ? <AuthDrawer userExists={!!userId} /> : null}
        <CustomButton
          text="Submit"
          href="/projects/new"
          inverted
          className="hidden lg:flex"
        />
      </div>
    </header>
  )
}
