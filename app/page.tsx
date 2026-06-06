import type { Metadata } from "next"
import { api } from "@/convex/_generated/api"

import { fetchAuthQuery } from "@/lib/auth-server"
import {
  absoluteUrl,
  defaultDescription,
  defaultOgImage,
  publicRobots,
  serializeJsonLd,
  siteName,
} from "@/lib/seo"
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
  title: {
    absolute: siteName,
  },
  description: defaultDescription,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: siteName,
    type: "website",
    url: "/",
    siteName,
    description: defaultDescription,
    images: [
      {
        url: defaultOgImage,
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
    title: siteName,
    description: defaultDescription,
    images: [defaultOgImage],
  },
  robots: publicRobots,
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
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteName,
      url: absoluteUrl("/"),
      description: defaultDescription,
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteName,
      url: absoluteUrl("/"),
      logo: absoluteUrl("/logo.png"),
      sameAs: ["https://x.com/SpotlightDay"],
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <PageWrapper className="flex flex-col pb-3 lg:pb-8">
        <HomeContent
          home={home}
          filters={{ category, tags, award }}
        />
      </PageWrapper>
    </>
  )
}
