/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@instantdb/react'],
  env: {
    NEXT_PUBLIC_INSTANTDB_APP_ID: process.env.NEXT_PUBLIC_INSTANTDB_APP_ID,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  }
}

module.exports = nextConfig