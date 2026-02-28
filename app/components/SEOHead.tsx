"use client";
import Script from "next/script";
import {
  siteConfig,
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
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogUrl?: string;
  twitterHandle?: string;
  canonicalUrl?: string;
  structuredData?: any;
  section?: "home" | "labours" | "contractors" | "about" | "contact";
}

export default function SEOHead({
  title,
  description,
  keywords = [],
  ogImage = siteConfig.ogImage,
  ogUrl = siteConfig.url,
  twitterHandle = socialConfig.twitter.creator,
  canonicalUrl,
  structuredData,
  section = "home",
}: SEOProps) {
  const keywordString = keywords.join(", ");
  const dynamicDescription = description || metaDescriptions[section];

  return (
    <>
      {/* Basic tags */}
      <title>{title || siteConfig.name}</title>
      <meta name="description" content={dynamicDescription} />
      {keywordString && <meta name="keywords" content={keywordString} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={canonicalUrl || ogUrl} />

      {/* OpenGraph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title || siteConfig.name} />
      <meta property="og:description" content={dynamicDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content={socialConfig.twitter.card} />
      <meta name="twitter:title" content={title || siteConfig.name} />
      <meta name="twitter:description" content={dynamicDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content={twitterHandle} />

      {/* Core JSON-LD scripts (Load after interactive so they don't block render) */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        strategy="afterInteractive"
      />

      <Script
        id="platform-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(platformSchema) }}
        strategy="afterInteractive"
      />

      <Script
        id="search-action-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(searchActionSchema) }}
        strategy="afterInteractive"
      />

      {/* Section schemas */}
      <Script
        id="labours-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(laboursSchema) }}
        strategy="afterInteractive"
      />

      <Script
        id="contractors-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contractorsSchema) }}
        strategy="afterInteractive"
      />

      <Script
        id="about-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
        strategy="afterInteractive"
      />

      <Script
        id="contact-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
        strategy="afterInteractive"
      />

      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        strategy="afterInteractive"
      />

      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        strategy="afterInteractive"
      />

      {/* Custom structured data injection */}
      {structuredData && (
        <Script
          id="custom-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
