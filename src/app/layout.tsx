// ============================================
// Root Layout
// ============================================
// The top-level layout that wraps every page
// Sets up fonts, metadata, and global providers

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/providers/Providers";
import "./globals.css";

// Load Inter font with all needed weights
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

// SEO Metadata
export const metadata: Metadata = {
  title: {
    default: "ContentCal — Content Calendar for Creators",
    template: "%s | ContentCal",
  },
  description:
    "The drag-and-drop content calendar that helps bloggers and YouTubers plan, organize, and track their content pipeline.",
  keywords: [
    "content calendar",
    "blog planner",
    "youtube planner",
    "content planning",
    "editorial calendar",
  ],
  authors: [{ name: "ContentCal" }],
  openGraph: {
    title: "ContentCal — Content Calendar for Creators",
    description:
      "Plan your content. Grow your audience. The smart calendar for creators.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}