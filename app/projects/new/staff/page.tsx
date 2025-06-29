import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"

import PageWrapper from "@/components/page-wrapper"

import NewProjectForm from "../components/NewProjectForm"
import NewProjectHeader from "../components/NewProjectHeader"

export default async function StaffPage() {
  const user = await currentUser()
  const userRole = user?.publicMetadata.role as string

  if (!user || userRole !== "staff") {
    redirect("/")
  }

  return (
    <PageWrapper className="w-full flex flex-col pb-0">
      <NewProjectHeader />
      <NewProjectForm userId={user.id} isStaff={true} />
    </PageWrapper>
  )
}
