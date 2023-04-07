import { useRouter } from "next/router";
import { useAuth, useUser } from "@clerk/nextjs";
import Head from "next/head";
import ChangeBannerUrlInput from "@/components/changeBannerUrlInput";
import { supabaseClient } from "@/utils/helpers";
import { useEffect, useState } from "react";
import HeroSection from "@/components/UserProfile/HeroSection";

export default function ProfilePage({ profileData }: { profileData: any }) {
  // const router = useRouter();
  // const { usernameQuery } = router.query;
  // const usernameQueryAsStr = usernameQuery as string;
  // const { isLoaded, getToken } = useAuth();
  // const { user } = useUser();
  // const [profileData, setProfileData] = useState<any>();
  const [profileLoaded, setProfileLoaded] = useState<boolean>(true);
  // const usernameQueryWithoutAt = usernameQueryAsStr?.replace("@", "");

  // const getProfileData = async () => {
  //   const { data, error } = await supabaseClient
  //     .from("profile")
  //     .select("*")
  //     .eq("username", usernameQueryWithoutAt)
  //     .single();

  //   if (error) {
  //     console.log(error);
  //   }
  //   if (data) {
  //     setProfileData(data);
  //     setProfileLoaded(true);
  //   }
  // };

  // useEffect(() => {
  //   if (!!usernameQueryWithoutAt)
  //     getProfileData().catch((err) => console.log(err));
  // }, [usernameQueryWithoutAt]);

  // useEffect(() => {
  //   if (isLoaded && user) {
  //     console.log(user.profileImageUrl);
  //   }
  // }, [isLoaded, user]);

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
        <HeroSection
          bannerUrl={profileData?.banner_url}
          profileImg={profileData?.avatar_url}
          profileLoaded={profileLoaded}
          username={profileData?.username}
          firstName={profileData?.first_name}
          lastName={profileData?.last_name}
        />
      </main>
    </>
  );
}

export const getStaticPaths = async () => {
  const { data, error } = await supabaseClient
    .from("profile")
    .select("username");

  const paths = data!.map((userPath: any) => ({
    params: {
      usernameQuery: `@${userPath}`,
    },
  }));
  return {
    paths,
    fallback: "blocking",
  };
};

export async function getStaticProps({ params }: { params: any }) {
  const { data, error } = await supabaseClient
    .from("profile")
    .select("*")
    .eq("username", params?.usernameQuery.replace("@", ""))
    .single();

  return {
    props: {
      profileData: data,
    },
    revalidate: 1,
  };
}
