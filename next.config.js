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
  transpilePackages: ["geist"],
};

export default config;
