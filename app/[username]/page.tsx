import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { api } from "@/convex/_generated/api"
import { preloadedQueryResult } from "convex/nextjs"

import { fetchAuthQuery, preloadAuthQuery } from "@/lib/auth-server"
import {
  absoluteUrl,
  breadcrumbJsonLd,
  defaultOgImage,
  profileDescription,
  profileJsonLd,
  publicRobots,
  serializeJsonLd,
} from "@/lib/seo"
import PageWrapper from "@/components/page-wrapper"

import ProfilePageContent from "./components/ProfilePageContent"

interface PageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params
  const profile = await fetchAuthQuery(api.profiles.getByUsername, { username })

  if (!profile) {
    notFound()
  }

  const displayName = profile.display_name || profile.username
  const description = profileDescription(profile)
  const image = profile.banner_url || profile.avatar_url || defaultOgImage
  const path = `/${profile.username}`

  return {
    title: displayName,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${displayName} - Spotlight`,
      description,
      url: path,
      type: "profile",
      images: [
        {
          url: image,
          width: 1600,
          height: 900,
          alt: `${displayName} on Spotlight`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayName} - Spotlight`,
      description,
      images: [image],
    },
    robots: publicRobots,
  }
}

export default async function UsernamePage({ params }: PageProps) {
  const { username } = await params

  const preloadedProfile = await preloadAuthQuery(api.profiles.getProfilePage, {
    username,
  })
  const profilePage = preloadedQueryResult(preloadedProfile)

  if (!profilePage) {
    notFound()
  }

  const displayName =
    profilePage.user.display_name || profilePage.user.username || username
  const jsonLd = [
    profileJsonLd(profilePage.user),
    breadcrumbJsonLd([
      { name: "Home", url: absoluteUrl("/") },
      { name: displayName, url: absoluteUrl(`/${profilePage.user.username}`) },
    ]),
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <PageWrapper className="w-full pb-3 lg:pb-11 flex flex-col">
        <ProfilePageContent
          preloadedProfile={preloadedProfile}
          username={username}
        />
      </PageWrapper>
    </>
  )
}
