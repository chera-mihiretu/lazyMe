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
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'], 
};

export default nextConfig;
