import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/hooks/use-cart";
import { WishlistProvider } from "@/hooks/use-wishlist";
import ClientLayoutShell from "@/components/ClientLayoutShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "KICKZ - Premium Footwear Store",
    template: "%s | KICKZ",
  },
  description:
    "Discover the finest selection of premium shoes for men, women, and kids. Quality meets style in every pair. Nike, Adidas, Puma and more.",
  keywords: [
    "shoes",
    "sneakers",
    "footwear",
    "nike",
    "adidas",
    "puma",
    "running shoes",
    "basketball shoes",
    "casual shoes",
  ],
  authors: [{ name: "KICKZ Team" }],
  creator: "KICKZ",
  publisher: "KICKZ",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "KICKZ - Premium Footwear Store",
    description:
      "Discover the finest selection of premium shoes for men, women, and kids. Quality meets style in every pair.",
    siteName: "KICKZ",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KICKZ - Premium Footwear Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KICKZ - Premium Footwear Store",
    description:
      "Discover the finest selection of premium shoes for men, women, and kids. Quality meets style in every pair.",
    images: ["/og-image.jpg"],
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <WishlistProvider>
            <div className="flex min-h-screen flex-col">
              <ClientLayoutShell>
                <main className="flex-1">{children}</main>
              </ClientLayoutShell>
            </div>
            <Toaster />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
