import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /** Hides the floating Next dev indicator in the browser so localhost matches a clean preview while you build. */
  devIndicators: false,
  async redirects() {
    return [
      { source: '/component-gallery', destination: '/', permanent: false },
      { source: '/components', destination: '/', permanent: false },
      { source: '/gallery', destination: '/', permanent: false },
      { source: '/g', destination: '/', permanent: false },
    ];
  },
};

export default nextConfig;
