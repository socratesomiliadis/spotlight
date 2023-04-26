import Image from "next/image";
import { SpotlightNavigation } from "./Nav";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { acidGrotesk } from "@/pages/_app";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/primitives/Avatar";
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/primitives/Dropdown";
import { useProfilePopup } from "@/hooks/useProfilePopup";

export default function Header() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { setIsProfilePopupOpen } = useProfilePopup();
  return (
    <header className="absolute z-[999] w-screen top-0 py-8 flex flex-row items-center justify-between px-16">
      <div className="flex flex-row gap-20">
        <Link href="/">
          <Image
            src="/static/images/Logo.png"
            width={157}
            height={37}
            alt="Spotlight Logo"
            className="w-[150px] object-contain aspect-[157/37]"
          />
        </Link>
        <SpotlightNavigation />
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 search-bar flex flex-row items-center rounded-full text-white bg-white/10 backdrop-blur-md px-6 py-3 gap-6">
        <svg
          width="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 13L10.0375 10.0375M11.5 6.25C11.5 9.1495 9.1495 11.5 6.25 11.5C3.35051 11.5 1 9.1495 1 6.25C1 3.35051 3.35051 1 6.25 1C9.1495 1 11.5 3.35051 11.5 6.25Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
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
          <DropdownMenu>
            <DropdownMenuTrigger className="avatar-btn">
              <Avatar>
                <AvatarImage src={user?.profileImageUrl} />
                {/* <AvatarFallback>{`${user!.firstName![0]}${
                  user!.lastName![0]
                }`}</AvatarFallback> */}
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={`mt-2 w-56 ${acidGrotesk.className}`}
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() =>
                    router.push("/[usernameQuery]", `/@${user?.username}`)
                  }
                >
                  <User className="mr-2 h-4 w-4" />
                  <span className="-mb-1">Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsProfilePopupOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span className="-mb-1">Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span className="-mb-1">Billing</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LifeBuoy className="mr-2 h-4 w-4" />
                <span className="-mb-1">Support</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Cloud className="mr-2 h-4 w-4" />
                <span className="-mb-1">API</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span className="-mb-1">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

        <Link
          href="/subscribe"
          className="px-10 flex py-2 bg-white text-black text-lg rounded-full"
        >
          <span className="-mb-1">Subscribe</span>
        </Link>
      </div>
    </header>
  );
}
