import Lanyard from "@/components/Lanyard/Lanyard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Welcome() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="h-screen w-screen relative bg-white">
      <Lanyard />
    </div>
  );
}
