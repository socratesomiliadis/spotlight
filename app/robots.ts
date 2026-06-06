import type { MetadataRoute } from "next"

import { absoluteUrl } from "@/lib/seo"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/claim/",
        "/dashboard",
        "/email-preview",
        "/premium/success",
        "/projects/new",
        "/settings",
        "/staff-guide",
        "/welcome",
        "/*/edit",
        "/projects/*/edit",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  }
}
