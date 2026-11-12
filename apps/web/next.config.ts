import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  transpilePackages: ["@pokeweb/shared", "three"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "raw.githubusercontent.com" }],
  },
};

export default nextConfig;
