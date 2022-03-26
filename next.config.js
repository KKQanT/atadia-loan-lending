/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://atadia-pfpscore-api.herokuapp.com/:path*',
      },
    ]
  },
}

module.exports = nextConfig
