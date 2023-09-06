import Image from "next/image";
import { SpotlightNavigation } from "./Nav";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { acidGrotesk, inter } from "@/pages/_app";
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
          <button
            className=" text-lg"
            onClick={() => {
              router.push(`${router.asPath}?auth=signIn`);
            }}
          >
            Sign In
          </button>
        </SignedOut>

        <Link
          href="/subscribe"
          className="px-10 flex py-2 bg-[#D9D9D94F] text-black text-lg rounded-full"
        >
          <span className="">Subscribe</span>
        </Link>
      </div>
    </header>
  );
}
