import type {
  AwardType,
  CategoryType,
  ProjectCardView,
} from "@/lib/spotlight-types"
import HomeHero from "@/components/Home/home-hero"
import HomeNavigation from "@/components/Home/home-navigation"
import LoadMoreProjects from "@/components/Home/load-more-projects"
import ProjectPreviewController from "@/components/Home/project-preview-controller"
import ProjectsGrid from "@/components/Home/projects-grid"

type HomePageData = {
  featuredProject: ProjectCardView | null
  projects: ProjectCardView[]
  hasMore: boolean
  nextCursor: string | null
}

export default function HomeContent({
  home,
  filters,
}: {
  home: HomePageData
  filters: {
    category?: CategoryType
    tags?: string[]
    award?: AwardType
  }
}) {
  return (
    <>
      <HomeHero project={home.featuredProject} />
      <HomeNavigation />
      <ProjectsGrid projects={home.projects} />
      <LoadMoreProjects
        filters={filters}
        initialHasMore={home.hasMore}
        initialCursor={home.nextCursor}
      />
      <ProjectPreviewController />
    </>
  )
}
