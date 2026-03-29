/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  allowedDevOrigins: ['localhost:3000', '127.0.0.1:3000'],
}

module.exports = nextConfig
