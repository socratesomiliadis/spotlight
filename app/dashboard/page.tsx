import { redirect } from "next/navigation"
import { api } from "@/convex/_generated/api"

import { fetchAuthQuery, preloadAuthQuery } from "@/lib/auth-server"
import { hasStaffAccess } from "@/lib/roles"
import type { AwardType, CategoryType } from "@/lib/spotlight-types"
import PageWrapper from "@/components/page-wrapper"

import DashboardContent from "./components/DashboardContent"

const validCategories: CategoryType[] = [
  "websites",
  "design",
  "films",
  "crypto",
  "startups",
  "ai",
]

const validAwards: AwardType[] = ["otd", "otm", "oty", "honorable"]

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const user = await fetchAuthQuery(api.profiles.getCurrentSafe)
  const userRole = user?.role

  if (!user || !hasStaffAccess(userRole)) {
    redirect("/")
  }

  const resolvedSearchParams = await searchParams
  const search = (resolvedSearchParams.search as string | undefined)?.trim()
  const categoryParam = resolvedSearchParams.category as string | undefined
  const awardParam = resolvedSearchParams.award as string | undefined
  const category =
    categoryParam && validCategories.includes(categoryParam as CategoryType)
      ? (categoryParam as CategoryType)
      : undefined
  const award =
    awardParam && validAwards.includes(awardParam as AwardType)
      ? (awardParam as AwardType)
      : undefined

  const preloadedProjects = await preloadAuthQuery(
    api.projects.listWithAwardsForStaff,
    {
      search: search || undefined,
      category,
      award,
    }
  )

  return (
    <PageWrapper className="w-full flex flex-col p-6 pb-0">
      <DashboardContent preloadedProjects={preloadedProjects} />
    </PageWrapper>
  )
}
