import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { menuLinkType } from ".";

function TabLink({
  tab,
  label,
  activeTab,
  isPro,
}: {
  tab: string;
  label: string;
  activeTab: string | string[];
  isPro?: boolean;
}) {
  return (
    <Link
      key={tab}
      href={{
        pathname: "/account",
        query: { tab },
      }}
      className={`${
        activeTab === tab ? "" : "hover:text-black/60"
      } relative text-lg select-none text-black transition-colors duration-250 ease-out`}
      style={{
        pointerEvents: activeTab === tab || isPro ? "none" : "auto",
        WebkitTapHighlightColor: "transparent",
        color: isPro ? "#ACACAC" : "inherit",
      }}
    >
      {isPro && (
        <span className="block text-sm absolute text-black -right-[20%] -top-[30%]">
          Pro
        </span>
      )}
      {activeTab === tab && (
        <motion.span
          layoutId="bubble"
          className="absolute bottom-0 w-full z-10 h-[1px] bg-black"
          style={{ borderRadius: 9999 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      {label}
    </Link>
  );
}

export default function TabMenu({ menuLinks }: { menuLinks: menuLinkType[] }) {
  const { query } = useRouter();

  const selectedTab = query.tab ?? "profile";

  useEffect(() => {
    console.log(selectedTab);
  }, [selectedTab]);

  return (
    <div className="w-full border-y-[1px] border-[#f6f6f6] py-8 flex items-center justify-center">
      <div className="flex flex-row items-center gap-12">
        <TabLink tab="profile" label="Public Profile" activeTab={selectedTab} />
        <TabLink tab="social" label="Social Media" activeTab={selectedTab} />
        <TabLink tab="avatar" label="Avatar" activeTab={selectedTab} />
        <TabLink
          tab="directory"
          label="Directory"
          activeTab={selectedTab}
          isPro
        />
        <TabLink tab="gallery" label="Gallery" activeTab={selectedTab} isPro />
      </div>
    </div>
  );
}
