import Image from "next/image";
import { SpotlightNavigation } from "./Nav";
import { SignedIn, SignedOut, UserButton, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { acidGrotesk } from "@/pages/_app";

export default function Header() {
  const router = useRouter();
  const clerk = useClerk();
  return (
    <header className="absolute z-[999] w-screen top-0 py-8 flex flex-row items-center justify-between px-16">
      <div className="flex flex-row gap-20">
        <Image
          src="/static/images/Logo.png"
          width={157}
          height={37}
          alt="Spotlight Logo"
          className="w-[150px] object-contain aspect-[157/37]"
        />
        <SpotlightNavigation />
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 search-bar flex flex-row items-center rounded-full text-white bg-white/5 backdrop-blur-md px-6 py-3 gap-6">
        <svg
          width="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 13L10.0375 10.0375M11.5 6.25C11.5 9.1495 9.1495 11.5 6.25 11.5C3.35051 11.5 1 9.1495 1 6.25C1 3.35051 3.35051 1 6.25 1C9.1495 1 11.5 3.35051 11.5 6.25Z"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <input
          type="text"
          placeholder="Search Spotlight Awards"
          className="bg-transparent w-[320px] -mb-1 text-white focus:outline-none"
        />
      </div>
      <div className="header-btns flex flex-row items-center gap-6 text-white">
        <SignedIn>
          <UserButton
            appearance={{
              variables: {
                fontFamily: acidGrotesk.style.fontFamily,
              },
              elements: {
                userButtonPopoverActions: "mt-6",
                userButtonPopoverActionButton: "gap-2",
                userButtonPopoverActionButtonText: "text-black -mb-1",
                userButtonPopoverActionButtonIconBox: "text-black",
              },
            }}
          />
        </SignedIn>

        <SignedOut>
          <button
            className="-mb-1 text-lg"
            onClick={() => {
              router.push(`${router.asPath}?auth=signIn`);
            }}
          >
            Sign In
          </button>
        </SignedOut>

        <button className="px-10 flex py-2 bg-white text-black text-lg rounded-full">
          <span className="-mb-1">Subscribe</span>
        </button>
      </div>
    </header>
  );
}
