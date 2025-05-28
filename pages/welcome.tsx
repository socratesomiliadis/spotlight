import HeaderLink from "@/components/Header/header-link";
import Lanyard from "@/components/Lanyard/Lanyard";
import { useAuth } from "@clerk/nextjs";

export default function Welcome() {
  const { userId } = useAuth();

  return (
    <div className="h-screen w-screen dark-logo relative bg-[#0d0d0d]">
      {!!userId && <Lanyard />}
      <HeaderLink
        text="Home"
        href="/"
        inverted
        className="absolute left-1/2 -translate-x-1/2 bottom-[18%] border-0"
      />
    </div>
  );
}
