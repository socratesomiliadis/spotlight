import { redirect } from "next/navigation"
import { api } from "@/convex/_generated/api"

import { fetchAuthQuery } from "@/lib/auth-server"
import { hasStaffAccess } from "@/lib/roles"
import PageWrapper from "@/components/page-wrapper"

import EditProjectForm from "./components/EditProjectForm"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function EditProjectPage({ params }: PageProps) {
  const { slug } = await params
  const user = await fetchAuthQuery(api.profiles.getCurrentSafe)

  if (!user) {
    redirect("/")
  }

  const userRole = user.role
  const isStaff = hasStaffAccess(userRole)

  // Get the project
  const project = await fetchAuthQuery(api.projects.getBySlug, { slug })

  if (!project) {
    redirect("/")
  }

  // Check if user is the project owner or staff
  const isOwner = project.user_id === user.user_id
  if (!isOwner && !isStaff) {
    redirect(`/projects/${slug}`)
  }

  return (
    <PageWrapper className="w-full flex flex-col pb-0">
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold tracking-tight">Edit Project</h1>
      </div>
      <EditProjectForm project={project} userId={user.user_id} />
    </PageWrapper>
  )
}
