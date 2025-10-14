import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"

import { getProjectBySlug } from "@/lib/supabase/actions/projects"
import PageWrapper from "@/components/page-wrapper"

import EditProjectForm from "./components/EditProjectForm"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function EditProjectPage({ params }: PageProps) {
  const { slug } = await params
  const user = await currentUser()

  if (!user) {
    redirect("/")
  }

  const userRole = user?.publicMetadata.role as string
  const isStaff = userRole === "staff"

  // Get the project
  let project
  try {
    project = await getProjectBySlug(slug)
  } catch (error) {
    redirect("/")
  }

  if (!project) {
    redirect("/")
  }

  // Check if user is the project owner or staff
  const isOwner = project.user_id === user.id
  if (!isOwner && !isStaff) {
    redirect(`/projects/${slug}`)
  }

  return (
    <PageWrapper className="w-full flex flex-col pb-0">
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold tracking-tight">Edit Project</h1>
      </div>
      <EditProjectForm project={project} userId={user.id} />
    </PageWrapper>
  )
}
