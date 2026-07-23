import type { Metadata } from 'next';
import { PortfolioPage } from '../PortfolioPage';

export const metadata: Metadata = {
  title: 'BrianGPT — Brian Munroe',
  description: 'Explore Brian Munroe’s product design work through conversation.',
};

export default async function BrianGptPage({
  searchParams,
}: {
  searchParams: Promise<{ menu?: string }>;
}) {
  const { menu } = await searchParams;
  return <PortfolioPage initialSidebarDensity={menu === 'open' ? 'comfortable' : 'compact'} />;
}
