"use client";

import { useClerk } from "@clerk/nextjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";

export default function UserBtn() {
  const { user, signOut } = useClerk();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="rounded-lg text-sm size-11 bg-[#1E1E1E] text-[#989898] flex items-center justify-center leading-none font-bold">
          <span className="-mb-1">
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-fit bg-[#1E1E1E] text-white border-0 flex flex-col p-0 text-base"
      >
        <Link
          href="/premium"
          className="pt-4 py-3 hover:bg-[#72727280]/10 pl-4 pr-12 w-full"
        >
          Upgrade to{" "}
          <span className="bg-white ml-1 px-3 pt-2 pb-1 text-black rounded-lg">
            Premium
          </span>
        </Link>
        <span className="w-full h-[1px] bg-[#72727280]/50"></span>
        <Link
          className="pt-2 pb-1 pl-4 hover:bg-[#72727280]/10"
          href={`/${user?.username}`}
        >
          Profile
        </Link>
        <Link
          className="pt-2 pb-1 pl-4 hover:bg-[#72727280]/10"
          href={`/${user?.username}/projects`}
        >
          Projects
        </Link>
        <span className="w-full h-[1px] bg-[#72727280]/50"></span>
        <button
          className="w-full text-left hover:bg-[#72727280]/10 pl-4 pt-3 pb-3 text-[#FA5A59]"
          onClick={() => signOut({ redirectUrl: "/" })}
        >
          Logout
        </button>
      </PopoverContent>
    </Popover>
  );
}
