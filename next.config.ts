import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    viewTransition: true,
  },
  /** Hides the floating Next dev indicator in the browser so localhost matches a clean preview while you build. */
  devIndicators: false,
  async redirects() {
    return [
      { source: '/component-gallery', destination: '/', permanent: false },
      { source: '/components', destination: '/', permanent: false },
      { source: '/gallery', destination: '/', permanent: false },
      { source: '/g', destination: '/', permanent: false },
      { source: '/work/selectai', destination: '/work/selexai', permanent: true },
    ];
  },
};

export default nextConfig;
