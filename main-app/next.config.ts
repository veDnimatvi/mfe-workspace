import type { NextConfig } from "next";

const BLOG_APP_URL = process.env.BLOG_APP_URL || "http://localhost:3001";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/blog",
        destination: `${BLOG_APP_URL}/blog`,
      },
      {
        source: "/blog/:path*",
        destination: `${BLOG_APP_URL}/blog/:path*`,
      },
    ];
  },
};

export default nextConfig;
