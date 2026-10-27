import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // libSQL ships a native binding, so keep it out of the server bundle.
  serverExternalPackages: ["@libsql/client", "libsql"],
};

export default nextConfig;
