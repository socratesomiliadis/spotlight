import { Metadata } from "next"
import { notFound } from "next/navigation"
import { api } from "@/convex/_generated/api"
import { preloadedQueryResult } from "convex/nextjs"

import { fetchAuthQuery, preloadAuthQuery } from "@/lib/auth-server"
import PageWrapper from "@/components/page-wrapper"

import ProjectPageContent from "./components/ProjectPageContent"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params

  const project = await fetchAuthQuery(api.projects.getBySlug, { slug })

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

  const preloadedProject = await preloadAuthQuery(api.projects.getPageBySlug, {
    slug,
  })

  if (!preloadedQueryResult(preloadedProject)) {
    notFound()
  }

  return (
    <PageWrapper className="w-full flex flex-col">
      <ProjectPageContent preloadedProject={preloadedProject} />
    </PageWrapper>
  )
}
