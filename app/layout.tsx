import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LabourSampark - Connect Labourers & Contractors | India",
  description: "Bridging the gap between skilled labourers and trusted contractors across India. Find verified labourers and contractors for your projects.",
  keywords: ["labourers", "contractors", "labour platform", "construction workers", "India", "skilled workers"],
  authors: [{ name: "LabourSampark" }],
  creator: "LabourSampark",
  publisher: "LabourSampark",
  robots: "index, follow",
  category: "Employment",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://laboursampark.com",
    siteName: "LabourSampark",
    title: "LabourSampark - Connect Labourers & Contractors",
    description: "Bridging the gap between skilled labourers and trusted contractors across India",
    images: [
      {
        url: "/images/logo.jpg",
        width: 1200,
        height: 630,
        alt: "LabourSampark",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LabourSampark - Connect Labourers & Contractors",
    description: "Bridging the gap between skilled labourers and trusted contractors",
    images: ["/images/logo.jpg"],
    creator: "@laboursampark",
  },
  icons: {
    icon: "/images/logo.jpg",
    shortcut: "/images/logo.jpg",
    apple: "/images/logo.jpg",
  },
  manifest: "/manifest.json",
  verification: {
    google: "your-google-verification-code", // Replace with actual code from Google Search Console
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5YQR1DQWB1"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-5YQR1DQWB1');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
