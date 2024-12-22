import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fiction Fusion",
  description: "Fiction Fusion is a platform for sharing and discovering books and shows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-tl from-[#24374e] to-[#114e77]`}>
        <Header />
        <Analytics />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
