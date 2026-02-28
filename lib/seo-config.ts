// SEO Configuration for LabourSampark
export const siteConfig = {
  name: "LabourSampark",
  description: "Find verified skilled labourers and trusted contractors across India. Connect directly for construction, plumbing, electrical, carpentry and more. Hire workers instantly on India's largest labour platform.",
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

// Primary Keywords - Highly searched terms in India
export const primaryKeywords = [
  "labour platform India",
  "find skilled workers",
  "hire contractors",
  "construction workers India",
  "plumber near me",
  "carpenter hire",
  "electrical contractor",
  "labour sampark",
  "skilled labour marketplace",
  "contractor services",
  "find labour online",
  "hire construction workers",
];

// Secondary Keywords - Long tail keywords
export const secondaryKeywords = [
  "how to find skilled labourers in India",
  "best labour platform in India",
  "contractor booking app India",
  "hire workers online",
  "find construction workers near me",
  "trusted contractors online",
  "skilled workers platform",
  "labour hire marketplace",
  "construction labour services",
  "professional contractors India",
  "verified labourers online",
  "book contractors online",
];

// Location-based Keywords
export const locationKeywords = [
  "labour platform",
  "labour contractor",
  "labour hire",
  "labour market",
  "labour services",
  "labour solutions",
  "labour jobs",
  "labour work",
  "labour connect",
  "labour network",
];

// Service-specific Keywords
export const serviceKeywords = {
  labourers: [
    "skilled labourers",
    "construction labourers",
    "skilled workers",
    "construction workers",
    "electrical workers",
    "plumbing workers",
    "carpentry workers",
    "masonry workers",
    "painting workers",
    "civil workers",
    "labour hire",
    "temporary workers",
    "contract workers",
    "construction labour",
  ],
  contractors: [
    "contractors",
    "construction contractors",
    "electrical contractors",
    "plumbing contractors",
    "painting contractors",
    "carpentry contractors",
    "project contractors",
    "building contractors",
    "home renovation contractors",
    "renovation services",
    "project management",
    "construction services",
    "contractor services",
    "building services",
  ],
};

// Comprehensive meta descriptions for different sections
export const metaDescriptions = {
  home: "Find verified skilled labourers and trusted contractors across India. Hire workers instantly for construction, plumbing, electrical, carpentry and more. Join India's largest labour marketplace - LabourSampark.",
  labours: "Browse verified skilled labourers across India. Connect with construction workers, electricians, plumbers, carpenters and more. Hire reliable workers for your project.",
  contractors: "Connect with trusted contractors for construction, renovation, electrical, plumbing and other services. Find verified and experienced contractors near you.",
  about: "About LabourSampark - India's leading labour platform connecting skilled workers with contractors. Transparent, secure, and verified professional network.",
  contact: "Contact LabourSampark team for support, partnerships, or queries. Get in touch with us for labour hiring solutions.",
};

// Open Graph & Social Media Optimization
export const socialConfig = {
  twitter: {
    handle: "@laboursampark",
    creator: "@laboursampark",
    card: "summary_large_image",
  },
  facebook: {
    appId: "your-facebook-app-id",
    pageId: "laboursampark",
  },
};

// Schema.org JSON-LD for Organization
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "LabourSampark",
  "url": "https://laboursampark.com",
  "logo": "https://laboursampark.com/images/logo.jpg",
  "description": "India's largest platform connecting skilled labourers and trusted contractors. Find verified workers and hire contractors instantly.",
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
    "availableLanguage": ["en", "hi"],
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IN",
    "addressRegion": "India",
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

// Section-specific Schema.org structures

// Labours Section Schema
export const laboursSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Find Skilled Labourers",
  "description": "Browse and connect with verified skilled labourers across India. Find workers for construction, plumbing, carpentry, electrical work and more.",
  "provider": {
    "@type": "Organization",
    "name": "LabourSampark",
  },
  "areaServed": "IN",
  "serviceType": ["Construction Workers", "Skilled Labourers", "Contract Workers"],
};

// Contractors Section Schema
export const contractorsSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Find Trusted Contractors",
  "description": "Connect with verified and trusted contractors for your projects. Find experienced contractors in construction, renovation, electrical, plumbing and more services.",
  "provider": {
    "@type": "Organization",
    "name": "LabourSampark",
  },
  "areaServed": "IN",
  "serviceType": ["Construction Contractors", "Project Contractors", "Service Providers"],
};

// About Section Schema
export const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "LabourSampark",
  "description": "About LabourSampark - Bridging the gap between skilled labourers and trusted contractors across India with a transparent and secure platform.",
  "url": "https://laboursampark.com",
  "image": "https://laboursampark.com/images/logo.jpg",
  "areaServed": "IN",
  "serviceArea": {
    "@type": "City",
    "name": "India",
  },
};

// Contact Section Schema
export const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact LabourSampark",
  "description": "Get in touch with LabourSampark support team. We're here to help you connect with labourers or contractors.",
  "url": "https://laboursampark.com#contact",
  "mainEntity": {
    "@type": "Organization",
    "name": "LabourSampark",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "support@laboursampark.com",
      "areaServed": "IN",
    },
  },
};

// BreadcrumbList Schema for navigation
export const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://laboursampark.com",
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Find Labourers",
      "item": "https://laboursampark.com#labours",
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Find Contractors",
      "item": "https://laboursampark.com#contractors",
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "About Us",
      "item": "https://laboursampark.com#about",
    },
    {
      "@type": "ListItem",
      "position": 5,
      "name": "Contact",
      "item": "https://laboursampark.com#contact",
    },
  ],
};

// FAQ Schema - Common questions for better SERP visibility
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How to find skilled labourers on LabourSampark?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Visit LabourSampark, browse our verified labourers by skill, location, and experience. Connect directly with workers for construction, plumbing, electrical, carpentry and more.",
      },
    },
    {
      "@type": "Question",
      "name": "How to hire contractors on LabourSampark?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Search for contractors by service type, experience, and location on LabourSampark. Check ratings and reviews, then connect directly with trusted contractors for your project.",
      },
    },
    {
      "@type": "Question",
      "name": "Is LabourSampark safe and secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, LabourSampark verifies all workers and contractors. All transactions are secure with buyer protection, ratings, and reviews to ensure safety.",
      },
    },
    {
      "@type": "Question",
      "name": "What services are available on LabourSampark?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "LabourSampark offers construction, plumbing, electrical, carpentry, painting, renovation, and many other skilled services. Find both labourers and contractors.",
      },
    },
    {
      "@type": "Question",
      "name": "Is registration free on LabourSampark?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, registration is free for both labourers and contractors. Start connecting and grow your network today.",
      },
    },
  ],
};

// AggregateRating Schema - For platform ratings
export const aggregateRatingSchema = {
  "@context": "https://schema.org",
  "@type": "AggregateRating",
  "ratingValue": "4.5",
  "bestRating": "5",
  "worstRating": "1",
  "ratingCount": "5000",
  "name": "LabourSampark",
};

// Software Application Schema - Advanced platform schema
export const platformSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "LabourSampark",
  "description": "India's largest labour hiring platform connecting verified workers and contractors. Find skilled labourers and trusted contractors instantly.",
  "url": "https://laboursampark.com",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web, iOS, Android",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR",
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "ratingCount": "5000",
  },
};

// Dynamic Service Schema Generator - For different service types
export const generateServiceSchema = (service: {
  name: string;
  description: string;
  image?: string;
  rating?: number;
  ratingCount?: number;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": service.name,
  "description": service.description,
  "image": service.image || "https://laboursampark.com/images/logo.jpg",
  "provider": {
    "@type": "Organization",
    "name": "LabourSampark",
    "url": "https://laboursampark.com",
  },
  "areaServed": "IN",
  ...(service.rating && {
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": service.rating,
      "ratingCount": service.ratingCount || 100,
    },
  }),
});

// Dynamic Person/ProfilePage Schema - For individual labourers and contractors
export const generateProfileSchema = (profile: {
  name: string;
  role: "labour" | "contractor";
  image?: string;
  description?: string;
  rating?: number;
  ratingCount?: number;
}) => ({
  "@context": "https://schema.org",
  "@type": profile.role === "contractor" ? "LocalBusiness" : "Person",
  "name": profile.name,
  "description": profile.description || `Verified ${profile.role} on LabourSampark`,
  "image": profile.image || "https://laboursampark.com/images/logo.jpg",
  "url": "https://laboursampark.com",
  ...(profile.rating && {
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": profile.rating,
      "ratingCount": profile.ratingCount || 10,
    },
  }),
});

// All keywords export for use across the app
export const allKeywords = [
  ...primaryKeywords,
  ...secondaryKeywords,
  ...locationKeywords,
  ...serviceKeywords.labourers,
  ...serviceKeywords.contractors,
];
