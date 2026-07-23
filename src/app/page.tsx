import type { Metadata } from 'next';
import { LandingPage } from './LandingPage';

export const metadata: Metadata = {
  title: 'Brian Munroe — Product Designer',
  description:
    'Product designer creating thoughtful, useful digital experiences. Explore Brian Munroe’s work and meet BrianGPT.',
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ menu?: string }>;
}) {
  const { menu } = await searchParams;
  return <LandingPage initialSidebarDensity={menu === 'open' ? 'comfortable' : 'compact'} />;
}
