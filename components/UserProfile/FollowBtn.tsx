import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { supabaseClientWithAuth } from "@/utils/helpers";
import LoadingLine from "../LoadingLine";
import { motion } from "framer-motion";

export default function FollowBtn({
  otherUserId,
  currentUserId,
}: {
  otherUserId: string;
  currentUserId: string;
}) {
  const { getToken } = useAuth();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (otherUserId && currentUserId) checkIfFollowing();
  }, [otherUserId, currentUserId]);

  async function checkIfFollowing() {
    const supabaseAccessToken = await getToken({ template: "supabase" });
    const supabase = await supabaseClientWithAuth(
      supabaseAccessToken as string
    );
    const { data, error } = await supabase
      .from("relationships")
      .select("*")
      .eq("follower_id", currentUserId)
      .eq("following_id", otherUserId);
    if (error) {
      console.log(error);
    }
    if (data) {
      if (data.length > 0) setIsFollowing(true);
      else setIsFollowing(false);
      setIsLoaded(true);
    }
  }

  async function unfollowUser() {
    const supabaseAccessToken = await getToken({ template: "supabase" });
    const supabase = await supabaseClientWithAuth(
      supabaseAccessToken as string
    );
    const { data, error } = await supabase
      .from("relationships")
      .delete()
      .eq("follower_id", currentUserId)
      .eq("following_id", otherUserId);
    if (error) {
      console.log(error);
    }
    if (data) {
      console.log(data);
      // setIsFollowing(false);
    }
  }

  async function followUser() {
    const supabaseAccessToken = await getToken({ template: "supabase" });
    const supabase = await supabaseClientWithAuth(
      supabaseAccessToken as string
    );
    const { data, error } = await supabase.from("relationships").insert([
      {
        id: `${currentUserId}-${otherUserId}`,
        follower_id: currentUserId,
        following_id: otherUserId,
      },
    ]);
    if (error) {
      console.log(error);
    }
    if (data) {
      console.log(data);
      // setIsFollowing(true);
      console.log(isFollowing);
    }
  }

  function isSameUser() {
    return otherUserId === currentUserId;
  }

  if (!!isSameUser()) return null;
  else {
    return (
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={async () => {
            if (!isFollowing && !isSameUser()) {
              setIsFollowing(true);
              await followUser();
            }
            if (isFollowing && !isSameUser()) {
              setIsFollowing(false);
              await unfollowUser();
            }
            await checkIfFollowing();
          }}
          style={{
            opacity: isSameUser() ? 0.5 : 1,
            cursor: isSameUser() ? "not-allowed" : "pointer",
            pointerEvents: isSameUser() ? "none" : "auto",
          }}
          className={`follow-btn ${
            isFollowing ? "following border-[#262626]" : "border-[#E2E2E2]"
          } px-16 flex py-2 text-base rounded-full border-[1px] `}
        >
          <span className="flex items-center justify-center">
            {!isLoaded && (
              <div className="relative flex items-center">
                <div className="absolute w-full">
                  <LoadingLine className="w-full h-[16px] rounded-lg" />
                </div>
                <span aria-hidden className="opacity-0 pointer-events-none">
                  Unfollow
                </span>
              </div>
            )}
            {isLoaded ? (isFollowing ? "Unfollow" : "Follow") : ""}
          </span>
        </button>
      </div>
    );
  }
}
