/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "miramar-shop-production.up.railway.app",
      },
      {
        protocol: "https",
        hostname: "tu-strapi-vercel-app.vercel.app",
      },
    ],
  },
  env: {
    STRAPI_HOST: process.env.STRAPI_HOST,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
