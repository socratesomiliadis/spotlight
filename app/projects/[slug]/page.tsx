import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { api } from "@/convex/_generated/api"
import { preloadedQueryResult } from "convex/nextjs"

import { fetchAuthQuery, preloadAuthQuery } from "@/lib/auth-server"
import {
  absoluteUrl,
  breadcrumbJsonLd,
  categoryLabel,
  defaultOgImage,
  projectDescription,
  projectJsonLd,
  publicRobots,
  serializeJsonLd,
} from "@/lib/seo"
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

  const description = projectDescription(project)
  const image = project.main_img_url || defaultOgImage
  const creator = project.profile?.display_name || project.profile?.username
  const path = `/projects/${project.slug}`

  return {
    title: project.title,
    description,
    alternates: {
      canonical: path,
    },
    keywords: [project.category, ...project.tags],
    openGraph: {
      title: `${project.title} - Spotlight`,
      description,
      url: path,
      type: "article",
      publishedTime: project.created_at,
      modifiedTime: project.updated_at || project.created_at,
      authors: creator ? [creator] : undefined,
      images: [
        {
          url: image,
          width: 1600,
          height: 900,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} - Spotlight`,
      description,
      images: [image],
    },
    robots: publicRobots,
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params

  const preloadedProject = await preloadAuthQuery(api.projects.getPageBySlug, {
    slug,
  })
  const projectPage = preloadedQueryResult(preloadedProject)

  if (!projectPage) {
    notFound()
  }

  const { project } = projectPage
  const jsonLd = [
    projectJsonLd(project),
    breadcrumbJsonLd([
      { name: "Home", url: absoluteUrl("/") },
      {
        name: categoryLabel(project.category),
        url: absoluteUrl(`/?category=${project.category}`),
      },
      { name: project.title, url: absoluteUrl(`/projects/${project.slug}`) },
    ]),
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <PageWrapper className="w-full flex flex-col">
        <ProjectPageContent preloadedProject={preloadedProject} />
      </PageWrapper>
    </>
  )
}
