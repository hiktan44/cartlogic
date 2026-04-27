import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "CartLogic — AI-Powered E-Commerce Automation",
  description:
    "E-ticaret markaları için yapay zeka destekli iş akışı otomasyon platformu. Güçlü AI iş akışları oluşturun, mağazanızı büyütün.",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "CartLogic — AI-Powered E-Commerce Automation",
    description:
      "Build powerful AI workflows for your e-commerce store in minutes. No code. No complexity. Just growth.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "CartLogic - AI-Powered E-Commerce Automation",
      },
    ],
    type: "website",
    siteName: "CartLogic",
  },
  twitter: {
    card: "summary_large_image",
    title: "CartLogic — AI-Powered E-Commerce Automation",
    description:
      "Build powerful AI workflows for your e-commerce store in minutes. No code. No complexity. Just growth.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
