import type { Metadata } from 'next';
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
      <body>
        <div className="appBackground">{children}</div>
        {modal}
      </body>
    </html>
  );
}
