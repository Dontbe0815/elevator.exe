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
  // Add headers for audio files to prevent caching issues
  async headers() {
    return [
      {
        source: '/assets/audio/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
