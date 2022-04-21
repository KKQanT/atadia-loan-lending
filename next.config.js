/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MAINNET_RPC: process.env.MAINNET_RPC,
  }
}

module.exports = nextConfig
