import React, { Suspense } from "react";
import Skeleton from "@/app/components/Skeleton";
import { Briefcase } from "lucide-react";
import SEOHead from "@/app/components/SEOHead";
import JobsClient from "./JobsClient";

// Server-side SEO data for crawlers
const jobTitles = [
  "Furniture Work (Modular Kitchen & Wardrobe)",
  "Interior Wall Painting & Texture Work",
  "Industrial Electrician (Warehouse Wiring)",
  "Skilled Mason (Tile & Marble Installation)",
  "Sofa Repairing & Upholstery Specialist",
  "Structural Steel Fixer (Metro Project)"
];

export const metadata = {
  title: "Latest Construction & Furniture Jobs in India | LabourSampark",
  description: "Explore high-paying jobs for carpenters, painters, electricians, and masons. Direct contact with contractors for furniture work and interior projects.",
  keywords: ["furniture work", "carpenter jobs", "painting work", "electrician jobs", "masonry work", "labour jobs India"],
};

export default function JobsPage() {
  return (
    <>
      <SEOHead 
        title={metadata.title}
        description={metadata.description}
        keywords={metadata.keywords}
      />
      {/* Hidden container with job titles for SEO crawlers */}
      <div className="sr-only" aria-hidden="true">
        <h2>Available Job Opportunities:</h2>
        <ul>
          {jobTitles.map((title, index) => (
            <li key={index}>{title}</li>
          ))}
        </ul>
      </div>
      
      <Suspense fallback={
        <main className="min-h-screen bg-white dark:bg-zinc-950 pt-16 md:pt-4">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="h-64 bg-zinc-100 dark:bg-zinc-800 rounded-3xl animate-pulse mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-zinc-100 dark:bg-zinc-800 rounded-3xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </main>
      }>
        <JobsClient />
      </Suspense>
    </>
  );
}
