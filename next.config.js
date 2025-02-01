const config = {
  reactStrictMode: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.nyc3.digitaloceanspaces.com",
        pathname: "/**",
      },
    ],
  },
  transpilePackages: ['next-auth'],
};

export default config;
