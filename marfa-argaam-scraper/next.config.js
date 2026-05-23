/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['puppeteer', 'gray-matter'],
  },
};

module.exports = nextConfig;
