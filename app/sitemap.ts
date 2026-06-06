import type { MetadataRoute } from "next"
import { api } from "@/convex/_generated/api"

import { fetchAuthQuery } from "@/lib/auth-server"
import { absoluteUrl } from "@/lib/seo"

function parseDate(value?: string) {
  return value ? new Date(value) : new Date()
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, profiles] = await Promise.all([
    fetchAuthQuery(api.projects.listSitemapEntries),
    fetchAuthQuery(api.profiles.listSitemapEntries),
  ])

  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/premium"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    ...projects.map((project) => ({
      url: absoluteUrl(`/projects/${project.slug}`),
      lastModified: parseDate(project.updatedAt || project.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...profiles.map((profile) => ({
      url: absoluteUrl(`/${profile.username}`),
      lastModified: parseDate(profile.updatedAt || profile.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ]
}
