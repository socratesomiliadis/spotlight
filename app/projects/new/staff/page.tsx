import { redirect } from "next/navigation"
import { api } from "@/convex/_generated/api"

import { fetchAuthQuery } from "@/lib/auth-server"
import { hasStaffAccess } from "@/lib/roles"
import PageWrapper from "@/components/page-wrapper"

import NewProjectForm from "../components/NewProjectForm"
import NewProjectHeader from "../components/NewProjectHeader"

export default async function StaffPage() {
  const user = await fetchAuthQuery(api.profiles.getCurrentSafe)
  const userRole = user?.role

  if (!user || !hasStaffAccess(userRole)) {
    redirect("/")
  }

  return (
    <PageWrapper className="w-full flex flex-col pb-0">
      <NewProjectHeader />
      <NewProjectForm userId={user.user_id} isStaff={true} />
    </PageWrapper>
  )
}
