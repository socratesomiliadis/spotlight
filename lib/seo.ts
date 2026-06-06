import type { Metadata } from "next"

import type {
  AwardView,
  ProfileView,
  ProjectCardView,
  ProjectView,
} from "@/lib/spotlight-types"

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://spotlight.day"

export const siteName = "Spotlight"
export const defaultDescription =
  "A platform that awards creativity and innovation across industries worldwide."
export const defaultOgImage = "/ogImage.png"

export const publicRobots: Metadata["robots"] = {
  index: true,
  follow: true,
}

export const privateRobots: Metadata["robots"] = {
  index: false,
  follow: false,
}

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString()
}

export function truncateDescription(value: string, maxLength = 155) {
  const compact = value.replace(/\s+/g, " ").trim()

  if (compact.length <= maxLength) {
    return compact
  }

  return `${compact.slice(0, maxLength - 1).trim()}...`
}

export function categoryLabel(category: string) {
  return category
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function projectDescription(project: ProjectView | ProjectCardView) {
  const creator =
    project.profile?.display_name ||
    project.profile?.username ||
    project.user?.display_name ||
    project.user?.username
  const pieces = [
    project.title,
    `a ${categoryLabel(project.category)} project on Spotlight`,
    creator ? `by ${creator}` : "",
    project.tags.length ? `featuring ${project.tags.join(", ")}` : "",
  ].filter(Boolean)

  return truncateDescription(pieces.join(" "))
}

export function profileDescription(profile: ProfileView) {
  const displayName = profile.display_name || profile.username
  const pieces = [
    `${displayName} on Spotlight`,
    profile.business_type,
    profile.location ? `based in ${profile.location}` : "",
    profile.project?.length
      ? `with ${profile.project.length} featured project${
          profile.project.length === 1 ? "" : "s"
        }`
      : "",
  ].filter(Boolean)

  return truncateDescription(pieces.join(", "))
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

export function projectJsonLd(project: ProjectView) {
  const creator = project.profile || project.user
  const awards = (project.award || []).map((award: AwardView) =>
    categoryLabel(award.award_type)
  )

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: projectDescription(project),
    url: absoluteUrl(`/projects/${project.slug}`),
    image: project.main_img_url,
    dateCreated: project.created_at,
    dateModified: project.updated_at || project.created_at,
    genre: categoryLabel(project.category),
    keywords: project.tags.join(", "),
    award: awards.length ? awards : undefined,
    creator: creator
      ? {
          "@type": "Person",
          name: creator.display_name || creator.username,
          url: absoluteUrl(`/${creator.username}`),
        }
      : undefined,
  }
}

export function profileJsonLd(profile: ProfileView) {
  const displayName = profile.display_name || profile.username

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${displayName} on Spotlight`,
    description: profileDescription(profile),
    url: absoluteUrl(`/${profile.username}`),
    image: profile.avatar_url || profile.banner_url || undefined,
    dateCreated: profile.created_at,
    dateModified: profile.updated_at,
    mainEntity: {
      "@type": profile.business_type ? "Organization" : "Person",
      name: displayName,
      alternateName: `@${profile.username}`,
      url: profile.website_url || absoluteUrl(`/${profile.username}`),
      image: profile.avatar_url || undefined,
      address: profile.location
        ? {
            "@type": "PostalAddress",
            addressLocality: profile.location,
          }
        : undefined,
    },
  }
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
