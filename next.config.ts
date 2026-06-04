import type { NextConfig } from "next"

const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL
const convexHostname = convexSiteUrl
  ? new URL(convexSiteUrl).hostname
  : undefined

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config, options) {
    config.module.rules.push({
      test: /.*\.(glb|gltf)$/,
      use: {
        loader: "file-loader",
      },
    })
    return config
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      ...(convexHostname
        ? [
            {
              protocol: "https" as const,
              hostname: convexHostname,
            },
          ]
        : []),
      {
        protocol: "https",
        hostname: "qldivxknoeqqjlvydqyh.supabase.co",
      },
      {
        protocol: "https",
        hostname: "cloud.convex.spotlight.day",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
}

export default nextConfig
