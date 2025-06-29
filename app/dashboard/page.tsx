import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"

import { getAllProjectsWithAwards } from "@/lib/supabase/actions"
import PageWrapper from "@/components/page-wrapper"

import AwardButtons from "./components/AwardButtons"

export default async function DashboardPage() {
  const user = await currentUser()
  const userRole = user?.publicMetadata.role as string

  if (!user || userRole !== "staff") {
    redirect("/")
  }

  const projects = await getAllProjectsWithAwards()

  return (
    <PageWrapper className="w-full flex flex-col p-6 pb-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Staff Dashboard</h1>
        <div className="text-sm text-gray-600">
          {projects?.length || 0} projects total
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
      <div className="flex flex-col divide-y divide-[#EAEAEA] w-full mt-12">
        {projects?.map((project) => (
          <div
            key={project.id}
            className="flex flex-row items-start gap-6 py-6"
          >
            <Link target="_blank" href={`/projects/${project.slug}`}>
              <Image
                src={project.main_img_url}
                alt={project.title}
                width={720}
                height={405}
                className="rounded-xl w-44 aspect-video flex-shrink-0"
              />
            </Link>
            <div className="flex flex-row items-center gap-20">
              <div>
                <h2 className="text-2xl font-medium tracking-tight">
                  {project.title}
                </h2>
                <div className="text-sm text-gray-600 mt-1">
                  by {project.user?.display_name || project.user?.username} •{" "}
                  {project.category}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Created: {new Date(project.created_at).toLocaleDateString()}
                </div>
              </div>
              <AwardButtons
                projectId={project.id}
                currentAwards={project.award || []}
              />
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  )
}
