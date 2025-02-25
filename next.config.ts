/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
  },
  env: {
    STRAPI_HOST: process.env.STRAPI_HOST,
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
