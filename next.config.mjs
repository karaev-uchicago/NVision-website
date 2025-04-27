/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/results/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/api/results/**',
      },
    ],
  },
}

export default nextConfig
