import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: [
      'images.unsplash.com',
      'agmwsgijgyicowqovfzm.supabase.co',
    ],
  },
};

export default nextConfig;