import './src/env.mjs';

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ['@movie/ui', '@movie/api', '@movie/auth'],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
  },
};

export default config;
