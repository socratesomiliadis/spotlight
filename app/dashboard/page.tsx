import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"

import { getAllProjectsWithAwards } from "@/lib/supabase/actions"
import PageWrapper from "@/components/page-wrapper"

import AwardButtons from "./components/AwardButtons"
import DashboardFilters from "./components/DashboardFilters"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const user = await currentUser()
  const userRole = user?.publicMetadata.role as string

  if (!user || userRole !== "staff") {
    redirect("/")
  }

  const allProjects = await getAllProjectsWithAwards()
  const resolvedSearchParams = await searchParams

  // Get filter parameters
  const searchQuery = (resolvedSearchParams?.search as string) || ""
  const categoryFilter = (resolvedSearchParams?.category as string) || ""
  const awardFilter = (resolvedSearchParams?.award as string) || ""

  // Filter projects
  let projects = allProjects || []

  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    projects = projects.filter(
      (project) =>
        project.title.toLowerCase().includes(query) ||
        project.user?.display_name?.toLowerCase().includes(query) ||
        project.user?.username?.toLowerCase().includes(query)
    )
  }

  // Apply category filter
  if (categoryFilter) {
    projects = projects.filter((project) => project.category === categoryFilter)
  }

  // Apply award filter
  if (awardFilter) {
    projects = projects.filter(
      (project) =>
        project.award &&
        Array.isArray(project.award) &&
        project.award.some((a: any) => a.award_type === awardFilter)
    )
  }

  return (
    <PageWrapper className="w-full flex flex-col p-6 pb-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        <div className="text-sm text-gray-600">
          {projects?.length || 0} of {allProjects?.length || 0} projects
        </div>
      </div>
      <p className="text-gray-600 mt-2">
        Manage project awards by clicking the award buttons. Active awards are
        highlighted.
        <br />
        <span className="text-sm">
          • Click an unawarded button to select a date and give the award •
          Click an awarded button to remove the award • Click the date under an
          awarded button to edit the award date
        </span>
      </p>

      {/* Filters */}
      <div className="mt-8">
        <DashboardFilters />
      </div>

      {/* Projects List */}
      <div className="flex flex-col divide-y divide-[#EAEAEA] w-full mt-8">
        {projects.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No projects found matching your filters
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-row items-start gap-6 py-6 w-full"
            >
              <div className="flex flex-row items-center gap-6 w-[50%]">
                <Link target="_blank" href={`/projects/${project.slug}`}>
                  <Image
                    src={project.main_img_url}
                    alt={project.title}
                    width={720}
                    height={405}
                    className="rounded-xl w-44 aspect-video shrink-0"
                  />
                </Link>
                <div className="whitespace-nowrap">
                  <h2 className="text-2xl font-medium tracking-tight">
                    {project.title}
                  </h2>
                  <div className="text-sm text-gray-600 mt-1">
                    by{" "}
                    <Link
                      href={`/${project.user?.username}`}
                      className="underline"
                    >
                      {project.user?.display_name || project.user?.username}
                    </Link>{" "}
                    • {project.category}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Created: {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="w-[50%] flex flex-row items-center gap-20">
                <AwardButtons
                  projectId={project.id}
                  currentAwards={project.award || []}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </PageWrapper>
  )
}
