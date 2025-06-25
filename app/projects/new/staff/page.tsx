import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"

import NewProjectForm from "../components/NewProjectForm"
import NewProjectHeader from "../components/NewProjectHeader"

export default async function StaffPage() {
  const user = await currentUser()
  const userRole = user?.publicMetadata.role as string

  if (!user || userRole !== "staff") {
    redirect("/")
  }

  return (
    <main className="w-screen px-[22vw] py-28">
      <div className="w-full rounded-3xl border-[1px] border-[#EAEAEA] flex flex-col">
        <NewProjectHeader />
        <NewProjectForm userId={user.id} isStaff={true} />
      </div>
    </main>
  )
}
