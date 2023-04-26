import { useAuth } from "@clerk/nextjs";
import { supabaseClientWithAuth } from "@/utils/helpers";
import { useEffect, useState } from "react";

export default function FollowsYouComp({
  otherUserId,
}: {
  otherUserId: string;
}) {
  const { getToken, userId } = useAuth();
  const [followsYou, setFollowsYou] = useState<boolean>(false);

  async function checkFollowsYou() {
    const supabaseAccessToken = await getToken({ template: "supabase" });
    const supabase = await supabaseClientWithAuth(
      supabaseAccessToken as string
    );
    const { data, error } = await supabase
      .from("relationships")
      .select("*")
      .eq("follower_id", otherUserId)
      .eq("following_id", userId);
    if (error) {
      console.log(error);
    }
    if (data) {
      if (data.length > 0) setFollowsYou(true);
      else setFollowsYou(false);
    }
  }

  useEffect(() => {
    if (otherUserId && userId) checkFollowsYou();
  }, [otherUserId, userId]);

  if (followsYou)
    return (
      <span className="text-[0.6rem] select-none -mr-24 flex tracking-wide uppercase pt-2 pb-1 leading-none px-4 bg-black/70 text-white/90 w-fit rounded-md">
        <span>Follows you</span>
      </span>
    );
  else return null;
}
