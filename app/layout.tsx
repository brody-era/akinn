import type { Metadata, Viewport } from "next";
import "./globals.css";
import Footer from "@/components/Footer";

export const viewport: Viewport = {
  themeColor: "#ffffff", // browser UI color
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "https://akinn.xyz"),
  title: "Akinn Labs",
  description: "Akinn is a web3 studio building the future of decentralized experiences",
  openGraph: {
    title: "Akinn Labs",
    description: "Akinn is a web3 studio building the future of decentralized experiences",
    url: "/",
    siteName: "Akinn Labs",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Akinn Labs" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akinn Labs",
    description: "AKINN is a web3 studio building the future of decentralized experiences",
    images: ["/og.png"],
  },

  // keep your single manifest
  manifest: "/site.webmanifest",

  icons: {
    icon: [
      { url: "/favicons/favicon.ico" },
      { url: "/favicons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicons/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicons/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/favicons/apple-touch-icon.png", sizes: "180x180" },
    other: [{ rel: "mask-icon", url: "/favicons/safari-pinned-tab.svg", color: "#000000" }],
  },

  // Windows tiles
  other: {
    "msapplication-TileImage": "/favicons/mstile-150x150.png",
    "msapplication-TileColor": "#FFFFFF",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col bg-[#0a0a0a] text-[#FAFAFA] text-center antialiased">
        {children}
        <Footer />
      </body>
    </html>
  );
}