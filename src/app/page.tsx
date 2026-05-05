import type { Metadata } from 'next';
import { PortfolioPage } from './PortfolioPage';

export const metadata: Metadata = {
  title: 'BrianGPT — Portfolio',
  description: 'Brian Munroe’s portfolio with an AI assistant grounded in context.md.',
};

export default function Home() {
  return <PortfolioPage />;
}
