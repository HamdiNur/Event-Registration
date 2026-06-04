import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EventHub - Discover & Register for Events',
  description: 'Find and register for amazing events in your city',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}