"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useClerk } from "@clerk/nextjs"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function UserBtn({ avatarUrl }: { avatarUrl: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useClerk()

  const isStaff = user?.publicMetadata.role === "staff"

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="rounded-lg text-sm size-10 lg:size-[2.7rem] bg-[#1E1E1E] text-[#989898] flex items-center justify-center leading-none font-bold overflow-hidden">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              width={128}
              height={128}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span>
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </span>
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
        <span className="w-full h-[1px] bg-[#72727280]/50"></span>
        <Link
          onClick={() => setIsOpen(false)}
          className="py-2 pl-4 hover:bg-[#72727280]/10"
          href={`/${user?.username}`}
        >
          Profile
        </Link>
        <Link
          onClick={() => setIsOpen(false)}
          className="py-2 pl-4 hover:bg-[#72727280]/10"
          href={`/${user?.username}/projects`}
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
        {isStaff && <span className="w-full h-[1px] bg-[#72727280]/50"></span>}
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
        <span className="w-full h-[1px] bg-[#72727280]/50"></span>
        <button
          className="w-full text-left hover:bg-[#72727280]/10 pl-4 py-3 text-[#FA5A59]"
          onClick={() => {
            setIsOpen(false)
            signOut({ redirectUrl: "/" })
          }}
        >
          Logout
        </button>
      </PopoverContent>
    </Popover>
  )
}
