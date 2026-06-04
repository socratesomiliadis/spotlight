import { redirect } from "next/navigation"
import { api } from "@/convex/_generated/api"

import { fetchAuthQuery, preloadAuthQuery } from "@/lib/auth-server"
import PageWrapper from "@/components/page-wrapper"

import DashboardContent from "./components/DashboardContent"

export default async function DashboardPage() {
  const user = await fetchAuthQuery(api.profiles.getCurrentSafe)
  const userRole = user?.role

  if (!user || userRole !== "staff") {
    redirect("/")
  }

  const preloadedProjects = await preloadAuthQuery(
    api.projects.listWithAwardsForStaff
  )

  return (
    <PageWrapper className="w-full flex flex-col p-6 pb-0">
      <DashboardContent preloadedProjects={preloadedProjects} />
    </PageWrapper>
  )
}
