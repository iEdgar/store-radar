import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Mock API and the store-detail metadata read the JSON datasets from
  // `data/` with `fs` at runtime. Ensure those files are traced into the
  // serverless functions so they exist in production (e.g. on Vercel).
  outputFileTracingIncludes: {
    "/api/**": ["./data/**"],
    "/stores/**": ["./data/**"],
  },
};

export default nextConfig;
