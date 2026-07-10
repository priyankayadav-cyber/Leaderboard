import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingIncludes: {
    "/api/leaderboard": ["./prisma/dev.db"],
    "/api/*": ["./prisma/dev.db"],
    "/api/**/*": ["./prisma/dev.db"],
  },
};

export default nextConfig;
