import Image from "next/image";
import { SpotlightNavigation } from "./Nav";
import { SignedIn, SignedOut, useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { inter } from "@/pages/_app";
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
import { useHeaderTheme } from "@/hooks/useHeaderTheme";
import { useEffect } from "react";

export default function Header() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { setIsProfilePopupOpen } = useProfilePopup();
  const { headerTheme } = useHeaderTheme();

  useEffect(() => {
    console.log(headerTheme);
  }, [headerTheme]);

  return (
    <header className="fixed z-[999] w-screen top-0 py-8 flex flex-row items-center justify-end px-16">
      <SpotlightNavigation />
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
            <DropdownMenuContent className={`mt-2 w-56 ${inter.className}`}>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() =>
                    router.push("/[usernameQuery]", `/@${user?.username}`)
                  }
                >
                  <User className="mr-2 h-4 w-4" />
                  <span className="">Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsProfilePopupOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span className="">Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span className="">Billing</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LifeBuoy className="mr-2 h-4 w-4" />
                <span className="">Support</span>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Cloud className="mr-2 h-4 w-4" />
                <span className="">API</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span className="">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SignedIn>

        <SignedOut>
          <Link
            href={{
              pathname: "/auth/sign-in",
              query: { redirect_url: router.asPath },
            }}
            className="flex flex-row items-center gap-2"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 18 18"
              fill="none"
              className="scale-100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.79795 15.4412C3.97654 15.0426 4.14082 14.6372 4.29022 14.2254M11.5052 16.9211C11.7637 16.2455 11.9929 15.5571 12.1916 14.8572C12.3719 14.2222 12.5269 13.5777 12.6558 12.9247M16.4612 13.6507C16.815 11.8834 17 10.0612 17 8.19899C17 4.2231 13.5224 1 9.23263 1C8.01371 1 6.86037 1.26022 5.83375 1.724M1 11.8205C1.30409 10.6595 1.46525 9.44669 1.46525 8.19899C1.46525 6.63293 2.00479 5.18367 2.92098 4.00217M9.23304 8.19899C9.23304 10.683 8.79867 13.073 7.99647 15.3073C7.79006 15.8822 7.55929 16.4468 7.3053 17M5.06703 11.3486C5.25243 10.3243 5.34894 9.27208 5.34894 8.19899C5.34894 6.21104 7.08772 4.5995 9.23263 4.5995C11.3775 4.5995 13.1163 6.21104 13.1163 8.19899C13.1163 8.75385 13.0976 9.30466 13.0608 9.85092"
                stroke="#818181"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                color: headerTheme === "dark" ? "#000" : "#fff",
              }}
              className="font-medium text-profitBlack text-sm lg:text-base"
            >
              Log in
            </span>
          </Link>
        </SignedOut>

        <Link
          href="/subscribe"
          style={{
            color: headerTheme === "dark" ? "#000" : "#fff",
          }}
          className="px-10 backdrop-blur-xl flex py-2 bg-[#d9d9d94a] text-black text-lg rounded-full"
        >
          <span className="">Subscribe</span>
        </Link>
      </div>
    </header>
  );
}
