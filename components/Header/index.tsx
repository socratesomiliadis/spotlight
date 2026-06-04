import Link from "next/link"

import { api } from "@/convex/_generated/api"
import { fetchAuthQuery } from "@/lib/auth-server"

import AuthDrawer from "../auth-drawer"
import CustomButton from "../custom-button"
import SpotlightLogo from "../SVGs/spotlight-logo"
import UserBtn from "./user-button"

export default async function Header() {
  const user = await fetchAuthQuery(api.profiles.getCurrentSafe)

  return (
    <header className="w-screen absolute top-4 lg:top-6 px-3 lg:px-[22vw] flex flex-row items-center justify-between z-50">
      <Link
        href="/"
        className="w-28 lg:w-38 header-logo flex items-center text-black"
      >
        <SpotlightLogo />
      </Link>
      <div className="flex flex-row items-center gap-2">
        {user && (
          <>
            <UserBtn user={user} />
            <CustomButton
              text="Premium"
              href="/premium"
              className="hidden lg:flex"
            />
          </>
        )}
        {!user ? <AuthDrawer userExists={!!user} /> : null}
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
