import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
