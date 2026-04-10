import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/provider";
import { LanguageProvider } from "@/app/context/LanguageContext";
import SEOHead from "./components/SEOHead";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://laboursampark.com"),
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

import LayoutWrapper from "./components/LayoutWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics - Production Only */}
        {/* Site structured data */}
        <SEOHead />
        {process.env.NODE_ENV === "production" && (
          <>
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
            <Script
              id="microsoft-clarity"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                  })(window, document, "clarity", "script", "w2eywbd6mf");
                `,
              }}
            />
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <ReduxProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </ReduxProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
