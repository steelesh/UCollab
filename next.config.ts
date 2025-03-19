import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
    authInterrupts: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.digitaloceanspaces.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '9000',
        pathname: '/**',
      },
    ],
  },
  serverExternalPackages: ['bullmq'],
};

export default nextConfig;
