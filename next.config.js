const config = {
  reactStrictMode: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ucollab-blob.nyc3.digitaloceanspaces.com',
        pathname: '/**',
      },
    ],
  },
  transpilePackages: ["geist"],
};

export default config;
