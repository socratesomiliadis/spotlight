import type { Metadata } from "next"
import { api } from "@/convex/_generated/api"

import { fetchAuthQuery } from "@/lib/auth-server"
import type { AwardType, CategoryType } from "@/lib/spotlight-types"
import HomeContent from "@/components/Home/home-content"
import PageWrapper from "@/components/page-wrapper"

const validCategories: CategoryType[] = [
  "websites",
  "design",
  "films",
  "crypto",
  "startups",
  "ai",
]

const validAwards: AwardType[] = ["otd", "otm", "oty", "honorable"]

export const metadata: Metadata = {
  title: "Spotlight",
  description:
    "A platform that awards creativity and innovation across industries worldwide.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Spotlight",
    type: "website",
    url: "https://spotlight.day",
    description:
      "A platform that awards creativity and innovation across industries worldwide.",
    images: [
      {
        url: "https://spotlight-awards.vercel.app/ogImage.png",
        width: 1600,
        height: 900,
        alt: "Preview image for Spotlight",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@SpotlightDay",
  },
  robots: "index, follow",
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
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

  const home = await fetchAuthQuery(api.projects.getHomePage, {
    category,
    tags,
    award,
  })

  return (
    <PageWrapper className="flex flex-col pb-3 lg:pb-8">
      <HomeContent
        home={home}
        filters={{ category, tags, award }}
      />
    </PageWrapper>
  )
}
