import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'marfa-argaam-scraper | Saudi Financial News',
  description: 'Automated Saudi financial news scraper from Argaam.com with AI summarization by marfa.sa',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-arabic antialiased">{children}</body>
    </html>
  );
}
