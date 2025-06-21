"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import CustomButton from "@/components/custom-button";
import { Tables } from "@/database.types";
import { toggleFollowAction } from "@/lib/supabase/follow-actions";

interface ProfileHeaderProps {
  user: Tables<"profile">;
  isOwnProfile: boolean;
  initialFollowStatus: boolean;
}

function removeHttpsAndTrailingSlash(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export default function ProfileHeader({
  user,
  isOwnProfile,
  initialFollowStatus,
}: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowStatus);
  const [isPending, startTransition] = useTransition();
  const displayName = user.display_name || user.username || "User";

  const handleFollowClick = () => {
    startTransition(async () => {
      try {
        const result = await toggleFollowAction(user.user_id);
        setIsFollowing(result.isFollowing);
      } catch (error) {
        console.error("Error toggling follow status:", error);
        // Optionally show an error message to the user
      }
    });
  };

  return (
    <div className="flex flex-col p-3">
      {/* Banner */}
      <div className="w-full aspect-[3/1] bg-[#f6f6f6] rounded-2xl overflow-hidden banner-image flex items-center justify-center">
        {user.banner_url ? (
          <Image
            src={user.banner_url || ""}
            alt={displayName}
            width={3000}
            height={1000}
            priority
            className="w-full aspect-[3/1] object-cover object-center"
          />
        ) : (
          <span className="w-16 block">
            <svg
              width="100%"
              viewBox="0 0 31 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.3388 27.8511C11.3388 26.5103 11.3388 25.84 11.3886 25.2748C11.942 18.993 16.9568 14.0124 23.2818 13.4629C23.8509 13.4134 24.5259 13.4134 25.8758 13.4134H29.2286M29.2286 13.4134C29.0102 12.6642 28.5675 11.8728 27.7775 10.4605L25.627 6.61599C24.6594 4.88622 24.1756 4.02134 23.4875 3.39155C22.8787 2.8344 22.1572 2.41276 21.3712 2.15483C20.4827 1.86328 19.4865 1.86328 17.4941 1.86328L13.9057 1.86328C11.9133 1.86328 10.9171 1.86328 10.0286 2.15483C9.24261 2.41276 8.5211 2.8344 7.91235 3.39156C7.22424 4.02134 6.74044 4.88623 5.77285 6.616L3.67306 10.3698C2.75689 12.0076 2.2988 12.8265 2.11921 13.6938C1.96026 14.4613 1.96026 15.253 2.11921 16.0206C2.2988 16.8878 2.75689 17.7067 3.67306 19.3446L5.77285 23.0984C6.74045 24.8281 7.22424 25.693 7.91235 26.3228C8.5211 26.8799 9.24261 27.3016 10.0286 27.5595C10.9171 27.8511 11.9133 27.8511 13.9057 27.8511H17.5787C19.5419 27.8511 20.5235 27.8511 21.4016 27.5668C22.1786 27.3154 22.8934 26.9041 23.4996 26.3598C24.1847 25.7446 24.673 24.8989 25.6496 23.2075L27.1365 20.6322L27.8542 19.2953C28.7247 17.6739 29.1599 16.8632 29.3261 16.0089C29.4731 15.2527 29.4664 14.4748 29.3062 13.7212C29.2844 13.6184 29.2586 13.5163 29.2286 13.4134ZM11.3388 11.9696C10.536 11.9696 9.88512 11.3232 9.88512 10.5259C9.88512 9.72851 10.536 9.08211 11.3388 9.08211C12.1417 9.08211 12.7925 9.72851 12.7925 10.5259C12.7925 11.3232 12.1417 11.9696 11.3388 11.9696Z"
                stroke="#ADADAD"
                strokeWidth="2.42043"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </div>

      {/* Profile Image and Buttons */}
      <div className="w-full flex flex-row justify-between items-start -mt-20 pl-8 pr-6">
        <Image
          src={user.avatar_url || ""}
          alt={displayName}
          width={256}
          height={256}
          priority
          className="rounded-xl size-40 aspect-square object-cover outline outline-[0.7rem] outline-white"
        />
        {isOwnProfile ? (
          <CustomButton
            text="Edit Profile"
            className="mt-24"
            href={`/${user.username}/edit`}
          />
        ) : (
          <div className="flex flex-row gap-2 buttons mt-24">
            <CustomButton
              text="Hire"
              inverted
              href="#"
              className="text-[#FF710C] border-[#FF710C]"
            />
            <CustomButton
              text={
                isPending ? "Loading..." : isFollowing ? "Unfollow" : "Follow"
              }
              onClick={handleFollowClick}
              disabled={isPending}
              className={
                isFollowing ? "bg-gray-100 text-gray-700 border-gray-300" : ""
              }
            />
          </div>
        )}
      </div>

      {/* Name and Details */}
      <div className="flex flex-col pl-8 mt-4">
        <div className="flex flex-col gap-0">
          <h1 className="text-3xl font-semibold tracking-tight">
            {displayName}
          </h1>
          <span className="text-lg text-[#989898]">@{user.username}</span>
        </div>
        <div className="flex flex-row gap-5 text-lg text-[#ACACAC] mt-6 mb-0">
          {user.location && (
            <div className="flex flex-row items-center gap-1">
              <span className="w-4">
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
              <span className="w-4">
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
  );
}
