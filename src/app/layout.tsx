import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ClerkWrapper from "@/components/providers/ClerkWrapper";
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
  title: {
    template: "%s | SAHAJWAY IMPEX",
    default: "SAHAJWAY IMPEX | Premium Global Import-Export Platform",
  },
  description: "A luxury B2B global trade partner exporting premium textiles, custom apparel, Jaipuri quilts, and canvas bags from Anand, Gujarat, India to international markets.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  keywords: [
    "Textile Exporter India",
    "Import Export Company Gujarat",
    "Indian Export Company",
    "Cotton Products Exporter",
    "Export Business India",
    "Global Trade Partner",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkWrapper>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-background text-foreground">
          {children}
        </body>
      </html>
    </ClerkWrapper>
  );
}
