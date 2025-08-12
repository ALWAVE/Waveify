import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
   async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://77.94.203.78:5000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
