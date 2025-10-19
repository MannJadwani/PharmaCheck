import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CaseStoreProvider } from "@/components/providers/case-store-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PharmaCheck | Clinical Posting Companion",
  description:
    "A clinical posting companion that captures cases, runs AI-based prescription checks, and streamlines faculty reviews.",
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
        <CaseStoreProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            {children}
            <Footer />
          </div>
        </CaseStoreProvider>
      </body>
    </html>
  );
}
