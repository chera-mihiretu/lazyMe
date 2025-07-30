import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
  },
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'], // Specify the file extensions for pages
};

export default nextConfig;
