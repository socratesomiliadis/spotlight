"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { authClient } from "@/lib/auth-client"
import type { ProfileView } from "@/lib/spotlight-types"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function UserBtn({ user }: { user: ProfileView }) {
  const [isOpen, setIsOpen] = useState(false)

  const isStaff = user.role === "staff" || user.role === "admin"
  const displayName = user.display_name || user.username
  const initials = displayName
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "rounded-lg text-sm size-10 lg:size-[2.7rem] bg-[#1E1E1E] text-[#989898] flex items-center justify-center leading-none font-bold",
            !!user.avatar_url && "bg-transparent"
          )}
        >
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              width={128}
              height={128}
              alt="User Avatar"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span>{initials}</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-fit bg-[#1E1E1E] text-white border-0 flex flex-col p-0 text-base"
      >
        <Link
          onClick={() => setIsOpen(false)}
          href="/premium"
          className="py-3 hover:bg-[#72727280]/10 pl-4 pr-12 w-full"
        >
          Upgrade to{" "}
          <span className="bg-white ml-1 px-3 py-1 text-black rounded-lg">
            Premium
          </span>
        </Link>
        <span className="w-full h-px bg-[#72727280]/50"></span>
        <Link
          onClick={() => setIsOpen(false)}
          className="py-2 pl-4 hover:bg-[#72727280]/10"
          href={`/${user.username}`}
        >
          Profile
        </Link>
        <Link
          onClick={() => setIsOpen(false)}
          className="py-2 pl-4 hover:bg-[#72727280]/10"
          href={`/${user.username}/projects`}
        >
          Projects
        </Link>

        <Link
          onClick={() => setIsOpen(false)}
          className="py-2 pl-4 hover:bg-[#72727280]/10"
          href="/settings"
        >
          Settings
        </Link>
        {isStaff && <span className="w-full h-px bg-[#72727280]/50"></span>}
        {isStaff && (
          <Link
            onClick={() => setIsOpen(false)}
            className="py-2 pl-4 text-[#FF77FA] hover:bg-[#72727280]/10"
            href="/dashboard"
          >
            Dashboard
          </Link>
        )}
        {isStaff && (
          <Link
            onClick={() => setIsOpen(false)}
            className="py-2 pl-4 text-[#FF77FA] hover:bg-[#72727280]/10"
            href="/projects/new/staff"
          >
            New Staff Project
          </Link>
        )}
        <span className="w-full h-px bg-[#72727280]/50"></span>
        <button
          className="w-full text-left hover:bg-[#72727280]/10 pl-4 py-3 text-[#FA5A59]"
          onClick={() => {
            setIsOpen(false)
            authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  window.location.href = "/"
                },
              },
            })
          }}
        >
          Logout
        </button>
      </PopoverContent>
    </Popover>
  )
}
