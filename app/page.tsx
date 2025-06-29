import { Database } from "@/database.types"

import { getTodaysSiteOfTheDay } from "@/lib/supabase/actions"
import { createClient } from "@/lib/supabase/server"
import HomeHero from "@/components/Home/home-hero"
import HomeNavigation from "@/components/Home/home-navigation"
import PreviewCursor from "@/components/Home/preview-cursor"
import ProjectsGrid from "@/components/Home/projects-grid"
import PageWrapper from "@/components/page-wrapper"

type CategoryType = Database["public"]["Enums"]["category"]
type AwardType = Database["public"]["Enums"]["awards"]

const validCategories: CategoryType[] = [
  "websites",
  "design",
  "films",
  "crypto",
  "startups",
  "ai",
]

const validAwards: AwardType[] = ["otd", "otm", "oty", "honorable"]

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const resolvedSearchParams = await searchParams

  // Parse filter parameters
  const categoryParam = resolvedSearchParams?.category as string | undefined
  const tagsParam = resolvedSearchParams?.tags as string | undefined
  const awardParam = resolvedSearchParams?.award as string | undefined

  // Validate category parameter
  const category =
    categoryParam && validCategories.includes(categoryParam as CategoryType)
      ? (categoryParam as CategoryType)
      : undefined

  // Parse and validate tags parameter
  const tags = tagsParam ? tagsParam.split(",").filter(Boolean) : []

  // Validate award parameter
  const award =
    awardParam && validAwards.includes(awardParam as AwardType)
      ? (awardParam as AwardType)
      : undefined

  // Get today's site of the day
  const siteOfTheDay = await getTodaysSiteOfTheDay()

  // Build base query
  let query = supabase
    .from("project")
    .select(
      `
      *,
      user:user_id(username, avatar_url, display_name),
      award(award_type, awarded_at)
    `
    )
    .order("created_at", { ascending: false })

  // Add category filter if specified
  if (category) {
    query = query.eq("category", category)
  }

  // Add tags filter if specified
  if (tags.length > 0) {
    // Use overlaps operator to check if any of the selected tags exist in the project's tags array
    query = query.overlaps("tags", tags)
  }

  // Execute the main query
  const { data: allProjects } = await query

  // Filter by award if specified (done in JavaScript since we need to join awards)
  let projects = allProjects || []

  if (award && projects) {
    projects = projects.filter(
      (project) =>
        project.award &&
        Array.isArray(project.award) &&
        project.award.some((a: any) => a.award_type === award)
    )
  }

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
