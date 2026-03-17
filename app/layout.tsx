import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PageForge | AI-Powered Landing Page Generator",
  description: "Transform your product ideas into high-conversion landing pages in seconds using Gemini AI. No coding required.",
  openGraph: {
    title: "PageForge | AI-Powered Landing Page Generator",
    description: "Transform your product ideas into high-conversion landing pages in seconds using Gemini AI. No coding required.",
    url: "https://pageforge.ai",
    siteName: "PageForge",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PageForge AI Landing Page Generator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PageForge | AI-Powered Landing Page Generator",
    description: "Transform your product ideas into high-conversion landing pages in seconds using Gemini AI. No coding required.",
    images: ["/og-image.png"],
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
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${dmSans.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
