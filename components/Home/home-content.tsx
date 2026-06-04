"use client"

import { api } from "@/convex/_generated/api"
import { Preloaded, usePreloadedQuery } from "convex/react"

import HomeHero from "@/components/Home/home-hero"
import HomeNavigation from "@/components/Home/home-navigation"
import PreviewCursor from "@/components/Home/preview-cursor"
import ProjectsGrid from "@/components/Home/projects-grid"

export default function HomeContent({
  preloadedHome,
}: {
  preloadedHome: Preloaded<typeof api.projects.getHomePage>
}) {
  const { featuredProject, projects } = usePreloadedQuery(preloadedHome)

  return (
    <>
      <HomeHero project={featuredProject} />
      <HomeNavigation />
      <ProjectsGrid projects={projects} />
      <PreviewCursor />
    </>
  )
}
