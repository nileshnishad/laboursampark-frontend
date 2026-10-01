import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    (process.env.NEXT_PUBLIC_SITE_URL || "https://laboursampark.com").replace(
      /\/+$/,
      "",
    );

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
        // Explicitly allow Google and Bing (Main Search Engines)
        userAgent: ["Googlebot", "Bingbot", "DuckDuckBot"],
        allow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
