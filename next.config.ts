import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "build",
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ucollab.blob.core.windows.net",
        port: "",
        pathname: "/ucollab-files/**",
      },
    ],
  },
};

export default nextConfig;
