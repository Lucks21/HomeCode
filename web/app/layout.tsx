import './globals.css';
import type { Metadata, Viewport } from 'next';
import { BackButtonHandler } from '@/shared/presentation/components/BackButtonHandler';

export const metadata: Metadata = {
  title: 'HomeCode',
  description: 'HomeCode Frontend',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <BackButtonHandler />
        {children}
      </body>
    </html>
  );
}
