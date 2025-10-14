import Image from "next/image"
import { notFound } from "next/navigation"

import { getProjectBySlug } from "@/lib/supabase/actions/projects"
import PageWrapper from "@/components/page-wrapper"

import ProjectDetails from "./components/ProjectDetails"
import ProjectElements from "./components/ProjectElements"
import ProjectHeader from "./components/ProjectHeader"
import ProjectNavigation from "./components/ProjectNavigation"
import ProjectVisitManager from "./components/ProjectVisitManager"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params

  let project
  try {
    const data = await getProjectBySlug(slug)

    project = data
  } catch (error) {
    notFound()
  }

  if (!project) {
    notFound()
  }

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
      />
      <ProjectNavigation awards={project.award} />
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
