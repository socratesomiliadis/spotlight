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
};

export default nextConfig;
