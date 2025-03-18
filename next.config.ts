import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
    nodeMiddleware: true,
  },
};

export default nextConfig;
