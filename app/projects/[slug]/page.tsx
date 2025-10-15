import { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"

import { getProjectBySlug } from "@/lib/supabase/actions/projects"
import PageWrapper from "@/components/page-wrapper"

import ProjectAwards from "./components/ProjectAwards"
import ProjectDetails from "./components/ProjectDetails"
import ProjectElements from "./components/ProjectElements"
import ProjectHeader from "./components/ProjectHeader"
import ProjectVisitManager from "./components/ProjectVisitManager"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params

  let project
  try {
    const data = await getProjectBySlug(slug)

    project = data
  } catch (error) {
    console.error(error)
    notFound()
  }

  if (!project) {
    notFound()
  }

  return {
    title: `${project.title} — Spotlight`,
    openGraph: {
      title: `${project.title} — Spotlight`,
      images: [
        {
          url: project.main_img_url,
          width: 1600,
          height: 900,
          alt: project.title,
        },
      ],
    },
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params

  let project
  try {
    const data = await getProjectBySlug(slug)

    project = data
  } catch (error) {
    console.error(error)
    notFound()
  }

  if (!project) {
    notFound()
  }

  // Check if user can edit this project
  const user = await currentUser()
  const userRole = user?.publicMetadata.role as string
  const isStaff = userRole === "staff"
  const isOwner = user?.id === project.user_id
  const canEdit = isOwner || isStaff

  return (
    <PageWrapper className="w-full flex flex-col">
      <ProjectVisitManager liveUrl={project.live_url} />
      <ProjectHeader
        bannerUrl={project.banner_url || ""}
        title={project.title}
        createdAt={project.created_at}
        userAvatarUrl={project.profile.avatar_url}
        userDisplayName={project.profile.display_name}
        userUsername={project.profile.username}
        slug={project.slug}
        canEdit={canEdit}
      />
      {project.award && project.award.length > 0 && (
        <ProjectAwards awards={project.award} category={project.category} />
      )}
      <div className="px-4 lg:px-8">
        <Image
          src={project.main_img_url}
          alt="Project Image"
          width={2560}
          height={1440}
          className="w-full aspect-video object-cover rounded-2xl"
        />
      </div>
      {project.elements_url && project.elements_url.length > 0 && (
        <ProjectElements elementURLs={project.elements_url} />
      )}
      <ProjectDetails tags={project.tags} />
    </PageWrapper>
  )
}
