"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tables } from "@/database.types"

import { toggleFollowAction } from "@/lib/supabase/follow-actions"
import CustomButton from "@/components/custom-button"

interface ProfileHeaderProps {
  user: Tables<"profile">
  isOwnProfile: boolean
  initialFollowStatus: boolean
}

function removeHttpsAndTrailingSlash(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "")
}

export default function ProfileHeader({
  user,
  isOwnProfile,
  initialFollowStatus,
}: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowStatus)
  const [isPending, startTransition] = useTransition()
  const displayName = user.display_name || user.username || "User"

  const handleFollowClick = () => {
    startTransition(async () => {
      try {
        const result = await toggleFollowAction(user.user_id)
        setIsFollowing(result.isFollowing)
      } catch (error) {
        console.error("Error toggling follow status:", error)
        // Optionally show an error message to the user
      }
    })
  }

  return (
    <div className="flex flex-col p-3">
      {/* Banner */}
      <div className="w-full aspect-3/1 bg-[#f6f6f6] rounded-2xl overflow-hidden banner-image flex items-center justify-center">
        {user.banner_url && (
          <Image
            src={user.banner_url || ""}
            alt={displayName}
            width={3000}
            height={1000}
            priority
            className="w-full aspect-3/1 object-cover object-center"
          />
        )}
      </div>

      {/* Profile Image and Buttons */}
      <div className="w-full flex flex-row justify-between items-start -mt-12 lg:-mt-20 pl-4 lg:pl-8 pr-3 lg:pr-6">
        <div className="bg-white">
          <Image
            src={user.avatar_url || ""}
            alt={displayName}
            width={256}
            height={256}
            priority
            className="rounded-xl transform-gpu size-24 lg:size-40 aspect-square object-cover outline-solid outline-[0.4rem] lg:outline-[0.7rem] outline-white bg-white"
          />
        </div>
        {isOwnProfile ? (
          <CustomButton
            text="Edit Profile"
            className="mt-14 lg:mt-24"
            href={`/${user.username}/edit`}
          />
        ) : user.is_unclaimed ? (
          <div className="flex flex-row gap-2 buttons mt-14 lg:mt-24">
            <CustomButton
              text="Claim Account"
              href={`/claim/${user.username}`}
            />
            <CustomButton
              text="Hire"
              inverted
              href="#"
              className="text-[#FF710C] border-[#FF710C]"
            />
          </div>
        ) : (
          <div className="flex flex-row gap-2 buttons mt-14 lg:mt-24">
            <CustomButton
              text="Hire"
              inverted
              href="#"
              className="text-[#FF710C] border-[#FF710C]"
            />
            <CustomButton
              text={isFollowing ? "Unfollow" : "Follow"}
              onClick={handleFollowClick}
              disabled={isPending}
              isLoading={isPending}
              className={
                isFollowing ? "bg-gray-100 text-gray-700 border-gray-300" : ""
              }
            />
          </div>
        )}
      </div>

      {/* Name and Details */}
      <div className="flex flex-col pl-4 lg:pl-8 mt-4">
        <div className="flex flex-col gap-0">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight">
              {displayName}
            </h1>
            {user.is_unclaimed && (
              <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full -mb-1">
                Unclaimed
              </span>
            )}
          </div>
          <span className="text-base lg:text-lg text-[#989898]">
            @{user.username}
          </span>
        </div>
        <div className="hidden lg:flex flex-row flex-wrap gap-x-3.5 lg:gap-x-5 text-base lg:text-lg text-[#ACACAC] mt-6 mb-0">
          {user.location && (
            <div className="flex flex-row items-center gap-1">
              <span className="w-3 lg:w-4">
                <svg
                  width="100%"
                  viewBox="0 0 16 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1 7.88383C1 4.082 4.13401 1 8 1C11.866 1 15 4.082 15 7.88383C15 10.2362 13.8314 12.3925 12.5609 14.0556C11.2795 15.7328 9.81545 17.0111 9.05671 17.625C8.43875 18.125 7.56125 18.125 6.94329 17.625C6.18455 17.0111 4.72048 15.7328 3.43913 14.0556C2.16861 12.3925 1 10.2362 1 7.88383ZM7.99808 10.035C9.2062 10.035 10.1856 9.0719 10.1856 7.88383C10.1856 6.69576 9.2062 5.73263 7.99808 5.73263C6.78995 5.73263 5.81058 6.69576 5.81058 7.88383C5.81058 9.0719 6.78995 10.035 7.99808 10.035Z"
                    stroke="#ACACAC"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>{user.location}</span>
            </div>
          )}
          {user.website_url && (
            <Link
              href={user.website_url}
              className="flex flex-row items-center gap-1"
              target="_blank"
            >
              <span className="w-3 lg:w-4">
                <svg
                  width="100%"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.9497 6.70711L6.70711 10.9497M7.41421 3.17157L8.12132 2.46447C10.0739 0.511845 13.2398 0.511845 15.1924 2.46447C17.145 4.41709 17.145 7.58291 15.1924 9.53553L14.4853 10.2426M3.17157 7.41421L2.46447 8.12132C0.511845 10.0739 0.511845 13.2398 2.46447 15.1924C4.41709 17.145 7.58291 17.145 9.53553 15.1924L10.2426 14.4853"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="-mt-0.5">
                {removeHttpsAndTrailingSlash(user.website_url)}
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
