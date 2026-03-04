import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Disable Turbopack for build to use webpack instead
  experimental: {
    turbo: undefined,
  },
};

export default nextConfig;
