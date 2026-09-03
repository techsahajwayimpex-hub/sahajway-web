import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import JsonLd from "@/components/seo/JsonLd";
import {
  getOrganizationSchema,
  getLocalBusinessSchema,
  getWebSiteSchema,
} from "@/lib/seo/schemas";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sahajwayimpex.com";

export const viewport: Viewport = {
  themeColor: "#030810",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | SAHAJWAY IMPEX",
    default: "SAHAJWAY IMPEX | Premium Global Indian Textile & B2B Export House",
  },
  description:
    "Luxury B2B global trade partner in Anand, Gujarat, India. Specializing in organic cotton baby bathrobes, Jaipuri double quilts, canvas tote bags, and private-label textile manufacturing.",
  applicationName: "Sahajway Impex",
  authors: [{ name: "Sahajway Impex Team", url: siteUrl }],
  generator: "Next.js",
  keywords: [
    "Textile Exporter India",
    "Cotton Products Exporter",
    "Jaipuri Quilts Wholesale",
    "Organic Baby Bathrobes Manufacturer",
    "Canvas Quilted Bags Exporter",
    "Import Export Company Gujarat",
    "B2B Indian Export House",
    "Private Label Apparel India",
    "Mundra Port Textile Shipments",
    "Anand Gujarat Exporter",
  ],
  creator: "Sahajway Impex",
  publisher: "Sahajway Impex",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "Sahajway Impex Product RSS Feed" }],
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Sahajway Impex",
    title: "Sahajway Impex | Premium Global B2B Export Partner",
    description:
      "Direct B2B sourcing of luxury handcrafted Indian textiles, Jaipuri quilts, and cotton lifestyle products from Gujarat to global markets.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Sahajway Impex B2B Trade & Export Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sahajway Impex | Premium Indian B2B Export House",
    description:
      "Handcrafted organic cotton textiles, quilts, and private-label apparel exported worldwide from Anand, Gujarat, India.",
    images: ["/twitter-image"],
    creator: "@sahajwayimpex",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/logo.png" }],
  },
  manifest: "/manifest.webmanifest",
  other: {
    // GEO (Geographic & Generative Optimization) Meta Tags
    "geo.region": "IN-GJ",
    "geo.placename": "Anand, Gujarat, India",
    "geo.position": "22.5645;72.9289",
    ICBM: "22.5645, 72.9289",
    "dc.coverage": "Worldwide",
    "dc.creator": "Sahajway Impex",
    "dc.language": "en",
    rating: "general",
    distribution: "global",
    "revisit-after": "7 days",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rootSchemas = [
    getOrganizationSchema(),
    getLocalBusinessSchema(),
    getWebSiteSchema(),
  ];

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <JsonLd schema={rootSchemas} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}