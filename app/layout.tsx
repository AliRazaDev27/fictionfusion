import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Suspense } from "react";
import LoaderHeader from "./loaderHeader";

const inter = Inter({ subsets: ["latin"] });

export const experimental_ppr = true;

export const metadata: Metadata = {
  title: "FictionFusion - Your Entertainment Hub",
  description: "Track, discover, and personalize your favorite books, movies, TV shows, and music all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 082635
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#082635" />
      </head>
      <body className={`${inter.className} bg-stone-900`}>
        <Suspense fallback={<LoaderHeader />}>
          <Header />
        </Suspense>
        <main>{children}</main>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
