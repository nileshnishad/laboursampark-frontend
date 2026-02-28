/**
 * SEO Utilities - Dynamic functions for generating SEO metadata
 * This file helps create dynamic, keyword-optimized content across the app
 */

import { primaryKeywords, secondaryKeywords, serviceKeywords } from "@/lib/seo-config";

/**
 * Generate meta title for any page/section
 * Includes primary keyword and brand name
 */
export function generateMetaTitle(
  keyword: string,
  brandName: string = "LabourSampark"
): string {
  const title = `${keyword} | ${brandName} - Hire Workers & Contractors Online`;
  return title.substring(0, 60); // Google recommends 50-60 chars
}

/**
 * Generate meta description with keyword
 * Optimized for CTR
 */
export function generateMetaDescription(
  service: "labour" | "contractor",
  keyword: string
): string {
  const templates = {
    labour: `Find verified skilled ${keyword}s on LabourSampark. Hire reliable workers for your project. Direct connection with ${keyword}s - trusted labour platform in India.`,
    contractor: `Connect with trusted ${keyword}s on LabourSampark. Hire experienced contractors for your project. Book ${keyword}s online - India's largest contractor network.`,
  };
  
  const desc = templates[service];
  return desc.substring(0, 160); // Google recommends 150-160 chars
}

/**
 * Generate rich keyword phrase for SEO
 * Combines keywords with location intent
 */
export function generateKeywordPhrase(
  service: string,
  location: string = "India"
): string[] {
  return [
    `hire ${service} in ${location}`,
    `${service} services ${location}`,
    `find ${service} near me`,
    `best ${service} platform ${location}`,
    `verified ${service} online`,
  ];
}

/**
 * Get all service keywords
 */
export function getServiceKeywords(type: "labour" | "contractor"): string[] {
  const keyMap = { labour: "labourers", contractor: "contractors" } as const;
  return serviceKeywords[keyMap[type]];
}

/**
 * Generate OpenGraph tag content
 */
export function generateOGContent(
  title: string,
  description: string,
  imageUrl: string = "https://laboursampark.com/images/logo.jpg",
  url: string = "https://laboursampark.com"
): {
  og: Record<string, string>;
  twitter: Record<string, string>;
} {
  return {
    og: {
      title,
      description,
      image: imageUrl,
      url,
      type: "website",
      site_name: "LabourSampark",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      image: imageUrl,
      creator: "@laboursampark",
    },
  };
}

/**
 * Generate structured data for FAQ items
 */
export function generateFAQStructure(
  question: string,
  answer: string
): {
  "@type": string;
  name: string;
  acceptedAnswer: {
    "@type": string;
    text: string;
  };
} {
  return {
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer,
    },
  };
}

/**
 * Generate breadcrumb items for navigation
 */
export function generateBreadcrumb(
  items: Array<{ name: string; url: string }>
): Array<{
  "@type": string;
  position: number;
  name: string;
  item: string;
}> {
  return items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  }));
}

/**
 * Optimize text for SEO
 * Repeat keywords naturally
 */
export function optimizeTextForSEO(
  text: string,
  primaryKeyword: string,
  secondaryKeywords: string[] = []
): string {
  // Simple implementation - in real world, use more sophisticated NLP
  let optimized = text;
  
  // Ensure primary keyword appears in first 100 words
  if (!text.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    optimized = `${primaryKeyword}. ${text}`;
  }
  
  return optimized;
}

/**
 * Get random keywords for keyword variation
 */
export function getRandomKeywords(count: number = 5): string[] {
  const allKeywords = [...primaryKeywords, ...secondaryKeywords];
  const shuffled = [...allKeywords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Generate canonical URL
 */
export function generateCanonicalURL(path: string): string {
  const baseUrl = "https://laboursampark.com";
  return `${baseUrl}${path}`;
}

/**
 * Check if text is optimized for SEO
 */
export function checkSEOOptimization(
  text: string,
  keywords: string[]
): {
  score: number;
  suggestions: string[];
} {
  const suggestions: string[] = [];
  let score = 0;

  for (const keyword of keywords) {
    if (text.toLowerCase().includes(keyword.toLowerCase())) {
      score += 20;
    } else {
      suggestions.push(`Consider adding keyword: "${keyword}"`);
    }
  }

  if (text.length < 100) {
    suggestions.push("Content is too short. Expand for better SEO.");
  } else {
    score += 20;
  }

  if (text.length > 300) {
    score += 10;
  }

  return {
    score: Math.min(score, 100),
    suggestions,
  };
}
