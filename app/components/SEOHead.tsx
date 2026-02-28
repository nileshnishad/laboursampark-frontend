"use client";

import Script from "next/script";
import {
  organizationSchema,
  searchActionSchema,
  laboursSchema,
  contractorsSchema,
  aboutSchema,
  contactSchema,
  breadcrumbSchema,
  faqSchema,
  platformSchema,
  socialConfig,
  metaDescriptions,
} from "@/lib/seo-config";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogUrl?: string;
  twitterHandle?: string;
  canonicalUrl?: string;
  structuredData?: any;
  section?: "home" | "labours" | "contractors" | "about" | "contact";
}

export function SEOHead({
  title,
  description,
  keywords = [],
  ogImage = "https://laboursampark.com/images/logo.jpg",
  ogUrl = "https://laboursampark.com",
  twitterHandle = socialConfig.twitter.creator,
  canonicalUrl,
  structuredData,
  section = "home",
}: SEOProps) {
  const keywordString = keywords.join(", ");
  const dynamicDescription = description || metaDescriptions[section];

  return (
    <>
      {/* Meta Tags */}
      <meta name="description" content={dynamicDescription} />
      {keywordString && <meta name="keywords" content={keywordString} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#2563eb" />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="author" content="LabourSampark" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl || ogUrl} />

      {/* OpenGraph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={dynamicDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:site_name" content="LabourSampark" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Tags */}
      <meta name="twitter:card" content={socialConfig.twitter.card} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={dynamicDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:site" content={twitterHandle} />

      {/* Organization Schema */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
        strategy="afterInteractive"
      />

      {/* Platform Schema */}
      <Script
        id="platform-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(platformSchema),
        }}
        strategy="afterInteractive"
      />

      {/* Website Search Action Schema */}
      <Script
        id="search-action-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(searchActionSchema),
        }}
        strategy="afterInteractive"
      />

      {/* Labours Section Schema */}
      <Script
        id="labours-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(laboursSchema),
        }}
        strategy="afterInteractive"
      />

      {/* Contractors Section Schema */}
      <Script
        id="contractors-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contractorsSchema),
        }}
        strategy="afterInteractive"
      />

      {/* About Section Schema */}
      <Script
        id="about-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutSchema),
        }}
        strategy="afterInteractive"
      />

      {/* Contact Section Schema */}
      <Script
        id="contact-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactSchema),
        }}
        strategy="afterInteractive"
      />

      {/* Breadcrumb Navigation Schema */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
        strategy="afterInteractive"
      />

      {/* FAQ Schema - Appears in search results */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
        strategy="afterInteractive"
      />

      {/* Custom Structured Data if provided */}
      {structuredData && (
        <Script
          id="custom-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}

// Export default for direct page usage
export default SEOHead;
