import HeaderLink from "@/components/Header/header-link";
import Lanyard from "@/components/Lanyard/Lanyard";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Welcome() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="h-screen w-screen dark-logo relative bg-[#151515]">
      <Lanyard
        firstName={user?.firstName ?? undefined}
        lastName={user?.lastName ?? undefined}
      />
      <HeaderLink
        text="Home"
        href="/"
        inverted
        className="absolute left-1/2 -translate-x-1/2 bottom-[18%] border-0"
      />
    </div>
  );
}
