import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"

import Lanyard from "@/components/Lanyard/Lanyard"

export default async function Welcome() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/")
  }

  return (
    <div className="h-screen w-full relative bg-white">
      <Lanyard />
    </div>
  )
}
