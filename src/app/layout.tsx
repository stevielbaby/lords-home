import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.author} | ${site.name}`,
  description: `${site.tagline}. ${site.shareDescription}`,
  openGraph: {
    title: `${site.tagline} | ${site.author}`,
    description: site.shareDescription,
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: site.url,
    images: [
      {
        url: "/opengraph-image",
        width: 1080,
        height: 1920,
        alt: `Pre-order ${site.tagline} by ${site.author}`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.tagline} | ${site.author}`,
    description: site.shareDescription,
    images: ["/opengraph-image"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: site.name,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col bg-ink text-bone"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
