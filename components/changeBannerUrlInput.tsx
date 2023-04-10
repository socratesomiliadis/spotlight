import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { supabaseClientWithAuth } from "@/utils/helpers";

export default function ChangeBannerUrlInput() {
  const [bannerUrl, setBannerUrl] = useState("");
  const { getToken, userId } = useAuth();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const supabaseAccessToken = await getToken({ template: "supabase" });
    const supabase = await supabaseClientWithAuth(
      supabaseAccessToken as string
    );

    const { data, error } = await supabase
      .from("profile")
      .update({
        banner_url: bannerUrl,
      })
      .eq("user_id", userId);

    if (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        value={bannerUrl}
        onChange={(e) => setBannerUrl(e.target.value)}
        type="url"
        className="w-[300px] h-[50px] bg-black/5"
      />
      <button type="submit">Change</button>
    </form>
  );
}
