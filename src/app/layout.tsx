import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ResponsiveConstructionGate } from './ResponsiveConstructionGate';
import './globals.css';

export const metadata: Metadata = {
  title: 'BrianGPT',
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning style={{ isolation: 'isolate' }}>
        <div className="appBackground">{children}</div>
        <ResponsiveConstructionGate />
        {modal}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
