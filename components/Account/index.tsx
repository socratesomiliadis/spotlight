import TabMenu from "./TabMenu";
import { useRouter } from "next/router";
import { useEffect } from "react";
import ProfileTab from "./ProfileTab";
import { useUser } from "@clerk/nextjs";
import SocialsTab from "./SocialsTab";
export type menuLinkType = {
  key: string;
  label: string;
  isPro: boolean;
};

const MenuLinks = [
  { key: "profile", label: "Public Profile", isPro: false },
  {
    key: "social",
    label: "Social Media",
    isPro: false,
  },
  { key: "avatar", label: "Avatar", isPro: false },
  { key: "directory", label: "Directory", isPro: true },
  { key: "gallery", label: "Gallery", isPro: true },
];

export default function Account() {
  const { isLoaded } = useUser();
  const { push, query } = useRouter();

  const selectedTab = query.tab ?? "profile";

  function isTabInMenuLinks(tab: string): tab is menuLinkType["key"] {
    return MenuLinks.some((menuLink) => menuLink.key === tab);
  }

  function isTabPro(tab: string): boolean {
    return MenuLinks.find((menuLink) => menuLink.key === tab)?.isPro ?? false;
  }

  useEffect(() => {
    //@ts-expect-error
    if (isTabPro(selectedTab) || !isTabInMenuLinks(selectedTab)) {
      push("/account?tab=profile");
    }
  }, [selectedTab]);

  return (
    <div className="bg-white w-screen h-screen pt-44 flex flex-col items-center">
      <TabMenu menuLinks={MenuLinks} />
      {isLoaded ? selectedTab === "profile" && <ProfileTab /> : null}
      {isLoaded ? selectedTab === "social" && <SocialsTab /> : null}
    </div>
  );
}
