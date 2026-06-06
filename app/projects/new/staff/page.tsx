import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { api } from "@/convex/_generated/api"

import { signInUrl } from "@/lib/auth-flow"
import { fetchAuthQuery } from "@/lib/auth-server"
import { hasStaffAccess } from "@/lib/roles"
import { privateRobots } from "@/lib/seo"
import PageWrapper from "@/components/page-wrapper"

import NewProjectForm from "../components/NewProjectForm"
import NewProjectHeader from "../components/NewProjectHeader"

export const metadata: Metadata = {
  title: "Staff New Project",
  robots: privateRobots,
}

export default async function StaffPage() {
  const user = await fetchAuthQuery(api.profiles.getCurrentSafe)
  const userRole = user?.role

  if (!user) {
    redirect(signInUrl("/projects/new/staff"))
  }

  if (!hasStaffAccess(userRole)) {
    redirect("/")
  }

  return (
    <PageWrapper className="w-full flex flex-col pb-0">
      <NewProjectHeader />
      <NewProjectForm userId={user.user_id} isStaff={true} />
    </PageWrapper>
  )
}
