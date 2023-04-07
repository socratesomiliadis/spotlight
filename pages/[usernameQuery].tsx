import { useRouter } from "next/router";
import { useAuth, useUser } from "@clerk/nextjs";
import Head from "next/head";
import ChangeBannerUrlInput from "@/components/changeBannerUrlInput";
import { supabaseClient } from "@/utils/helpers";
import { useEffect, useState } from "react";
import HeroSection from "@/components/UserProfile/HeroSection";

export default function ProfilePage() {
  const router = useRouter();
  const { usernameQuery } = router.query;
  const { isLoaded, getToken } = useAuth();
  const { user } = useUser();
  const [profileData, setProfileData] = useState<any>();
  const [profileLoaded, setProfileLoaded] = useState<boolean>(false);

  const getProfileData = async () => {
    const { data, error } = await supabaseClient
      .from("profile")
      .select("*")
      .eq("username", usernameQuery)
      .single();

    if (error) {
      console.log(error);
    }
    if (data) {
      setProfileData(data);
      setProfileLoaded(true);
    }
  };

  useEffect(() => {
    if (!!usernameQuery) getProfileData().catch((err) => console.log(err));
  }, [usernameQuery]);

  useEffect(() => {
    if (isLoaded && user) {
      console.log(user.profileImageUrl);
    }
  }, [isLoaded, user]);

  return (
    <>
      <Head>
        <title>Spotlight — Digital Awards</title>
        <meta name="robots" content="follow, index" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <meta
          content="Spotlight is the no.1 Digital Awards issuer that recognizes and promotes the talent and effort of the best developers, designers and web agencies in the world."
          name="description"
        />
      </Head>
      <main className="bg-white w-screen">
        <HeroSection bannerUrl={profileData?.banner_url} />
      </main>
    </>
  );
}
