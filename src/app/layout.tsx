import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BenchmrkProvider } from "@/components/BenchmrkProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Benchmrk — AI Model Benchmark Comparison",
  description: "Compare AI model performance across multiple benchmarks with sortable, filterable charts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#0a0a0f] text-white">
        <BenchmrkProvider>
          {children}
        </BenchmrkProvider>
      </body>
    </html>
  );
}
