import type { NextConfig } from "next";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        // API Rewrites - Proxy backend API calls
        // NOTE: Local Next.js API routes (like /api/upload-url) are resolved first
        // before these rewrites are applied, so they will never be proxied.
        {
          source: '/api/:path*',
          destination: `${BACKEND_URL}/api/:path*`,
        },
        // Auth Endpoints
        {
          source: '/auth/:path*',
          destination: `${BACKEND_URL}/auth/:path*`,
        },
        // Inquiry Endpoints
        {
          source: '/inquiries/:path*',
          destination: `${BACKEND_URL}/inquiries/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
