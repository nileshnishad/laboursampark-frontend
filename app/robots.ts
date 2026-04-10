import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin", 
          "/api", 
          "/private", 
          "/user/dashboard", 
          "/*?token=",
          "/*.php",
          "/*.env",
          "/wp-admin",
          "/.git"
        ],
      },
      {
        // Block Scrapers and Aggressive AI Bots (Not Search Engines)
        userAgent: [
          "GPTBot",          // OpenAI
          "CCBot",           // Common Crawl (Major source of bot traffic)
          "ClaudeBot",       // Anthropic
          "AdsBot-Google", 
          "Amazonbot", 
          "anthropic-ai", 
          "Bytespider",      // TikTok/ByteDance (Very aggressive)
          "Curebot",
          "ImagesiftBot",
          "PetalBot",
          "SemrushBot",      // SEO Tools (Can be heavy)
          "AhrefsBot",       // SEO Tools
          "DotBot",
          "Rogerbot"
        ],
        disallow: "/",
      },
      {
        // Explicitly allow Google and Bing (Main Search Engines)
        userAgent: ["Googlebot", "Bingbot", "DuckDuckBot"],
        allow: "/",
      },
    ],
    sitemap: "https://laboursampark.com/sitemap.xml",
    host: "https://laboursampark.com",
  };
}
