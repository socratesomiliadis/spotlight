"use client";

import { useClerk } from "@clerk/nextjs";

export default function UserBtn() {
  const { user, signOut } = useClerk();
  return (
    <button
      onClick={() => signOut({ redirectUrl: "/" })}
      className="rounded-lg text-sm size-11 bg-[#1E1E1E] text-[#989898] flex items-center justify-center leading-none font-bold"
    >
      <span className="-mb-1">
        {user?.firstName?.charAt(0)}
        {user?.lastName?.charAt(0)}
      </span>
    </button>
  );
}
