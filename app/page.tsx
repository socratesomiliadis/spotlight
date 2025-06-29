import { getTodaysSiteOfTheDay } from "@/lib/supabase/actions"
import { createClient } from "@/lib/supabase/server"
import HomeHero from "@/components/Home/home-hero"
import HomeNavigation from "@/components/Home/home-navigation"
import PreviewCursor from "@/components/Home/preview-cursor"
import ProjectsGrid from "@/components/Home/projects-grid"
import PageWrapper from "@/components/page-wrapper"

export default async function Home() {
  const supabase = await createClient()

  // Get today's site of the day
  const siteOfTheDay = await getTodaysSiteOfTheDay()

  // Fallback to latest projects if no site of the day
  const { data: projects } = await supabase
    .from("project")
    .select("*, user:user_id(username, avatar_url, display_name)")
    .order("created_at", { ascending: false })

  // Use site of the day as featured project, or fallback to most recent
  const featuredProject = siteOfTheDay || projects?.[0]

  return (
    <PageWrapper className="flex flex-col pb-3 lg:pb-8">
      {/* @ts-ignore */}
      <HomeHero project={featuredProject} />
      <HomeNavigation />
      <ProjectsGrid projects={projects} />
      <PreviewCursor />
    </PageWrapper>
  )
}
