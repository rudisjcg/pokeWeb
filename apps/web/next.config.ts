import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  transpilePackages: ["@pokeweb/shared", "three"],
};

export default nextConfig;
