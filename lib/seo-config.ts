// SEO Configuration for LabourSampark
export const siteConfig = {
  name: "LabourSampark",
  description: "Bridging the gap between skilled labourers and trusted contractors across India",
  url: "https://laboursampark.com",
  ogImage: "https://laboursampark.com/images/logo.jpg",
  mailSupport: "support@laboursampark.com",
  links: {
    twitter: "https://twitter.com/laboursampark",
    facebook: "https://facebook.com/laboursampark",
    instagram: "https://instagram.com/laboursampark",
    linkedin: "https://linkedin.com/company/laboursampark",
  },
  features: [
    "Find verified labourers",
    "Connect with trusted contractors",
    "Direct communication",
    "Secure transactions",
    "Performance reviews",
    "Mobile friendly",
  ],
};

// Schema.org JSON-LD for Organization
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "LabourSampark",
  "url": "https://laboursampark.com",
  "logo": "https://laboursampark.com/images/logo.jpg",
  "description": "Platform connecting skilled labourers and trusted contractors",
  "sameAs": [
    "https://www.facebook.com/laboursampark",
    "https://twitter.com/laboursampark",
    "https://www.instagram.com/laboursampark",
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "email": "support@laboursampark.com",
    "areaServed": "IN",
  },
};

// Schema.org for SearchAction
export const searchActionSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "LabourSampark",
  "url": "https://laboursampark.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://laboursampark.com/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};
