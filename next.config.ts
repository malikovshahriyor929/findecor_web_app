import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [process.env.NEXT_PUBLIC_IMG || "storage.googleapis.com"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**', 
      },
    ],
  },

};

export default nextConfig;
