import { MetadataRoute } from "next";
import { getOpenJobFeed } from "@/lib/jobs-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    (process.env.NEXT_PUBLIC_SITE_URL || "https://laboursampark.com").replace(
      /\/+$/,
      "",
    );
  const feed = await getOpenJobFeed();

  const routes: MetadataRoute.Sitemap = [
    // Main Pages
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    
    // Browsing Pages (New Multi-Page Structure)
    {
      url: `${baseUrl}/labours`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contractors`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: "always" as const,
      priority: 0.95,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    
    // Authentication Pages
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];

  const jobRoutes: MetadataRoute.Sitemap = feed.jobs.map((job) => ({
    url: `${baseUrl}/jobs/${job.slug}`,
    lastModified: job.postedAt ? new Date(job.postedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [...routes, ...jobRoutes];
}
