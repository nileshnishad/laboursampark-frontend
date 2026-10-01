import type { Metadata } from "next";
import { cache } from "react";
import JobsClient from "./JobsClient";
import { getOpenJobFeed } from "@/lib/jobs-data";

export const dynamic = "force-dynamic";

const title = "Jobs for Skilled Workers, Labour & Contractors | LabourSampark";
const description =
  "Find jobs for skilled workers, labour and contractors on LabourSampark. Search trade skills and locations to discover relevant work opportunities.";
const siteUrl =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://laboursampark.com").replace(
    /\/+$/,
    "",
  );
const getCachedOpenJobFeed = cache(getOpenJobFeed);

interface JobsPageProps {
  searchParams: Promise<{
    q?: string;
    search?: string;
    location?: string;
    skill?: string;
    experience?: string;
    type?: string;
    salary?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title,
    description,
    keywords: [
      "jobs for skilled workers",
      "labour jobs",
      "contractor jobs",
      "trade jobs",
      "job opportunities",
      "LabourSampark",
    ],
    alternates: {
      canonical: `${siteUrl}/jobs`,
    },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: `${siteUrl}/jobs`,
      siteName: "LabourSampark",
      title,
      description,
      images: [
        {
          url: "/images/logo.jpg",
          width: 1200,
          height: 630,
          alt: "LabourSampark job opportunities",
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: ["/images/logo.jpg"],
      creator: "@laboursampark",
    },
  };
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const [params, feed] = await Promise.all([
    searchParams,
    getCachedOpenJobFeed(),
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: siteUrl,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Jobs",
                item: `${siteUrl}/jobs`,
              },
            ],
          }).replace(/</g, "\\u003c"),
        }}
      />
      <JobsClient
        jobs={feed.jobs}
        feedError={feed.error}
        initialQuery={params.q ?? params.search ?? ""}
        initialLocation={params.location ?? ""}
        initialCategory={params.skill ?? ""}
        initialExperience={params.experience ?? ""}
        initialJobType={params.type ?? ""}
        initialSalary={params.salary ?? ""}
      />
    </>
  );
}
