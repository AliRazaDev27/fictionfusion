import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/next';



const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} bg-stone-900`}>
        <Header />
        <main>{children}</main>
        <footer className="p-4 text-center text-sm text-white">
          <div className="container mx-auto">
            <p>© 2023 <span className="font-semibold text-[#f97316]">FictionFusion</span>. All rights reserved.</p>
          </div>
        </footer>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
