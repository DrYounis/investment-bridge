import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "مرفأ",
  description: "منصة ذكية لربط المستثمرين بالفرص الاستثمارية",
  metadataBase: new URL('https://marfa.sa'), // Ensuring absolute URLs
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "مرفأ | Investment Bridge",
    description: "منصة ذكية لربط المستثمرين بالفرص الاستثمارية",
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "مرفأ | Investment Bridge",
    description: "منصة ذكية لربط المستثمرين بالفرص الاستثمارية",
    images: ['/twitter-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
