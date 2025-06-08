import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config, options) {
    config.module.rules.push({
      test: /.*\.(glb|gltf)$/,
      use: {
        loader: "file-loader",
      },
    });
    return config;
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qldivxknoeqqjlvydqyh.supabase.co",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

export default nextConfig;
