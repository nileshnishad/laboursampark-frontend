import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { BriefcaseBusiness, ChevronRight, MapPin } from "lucide-react";
import AppJobAction from "../AppJobAction";
import {
  approvedJobs,
  getOpenJobFeed,
  type MarketplaceJob,
} from "@/lib/jobs-data";

export const dynamic = "force-dynamic";

const getCachedOpenJobFeed = cache(getOpenJobFeed);
const siteUrl =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://laboursampark.com").replace(
    /\/+$/,
    "",
  );

interface JobRouteProps {
  params: Promise<{ slug: string }>;
}

async function findJob(slug: string): Promise<MarketplaceJob | undefined> {
  const feed = await getCachedOpenJobFeed();
  return (
    feed.jobs.find((job) => job.slug === slug) ??
    approvedJobs.find((job) => job.slug === slug)
  );
}

function locationText(job: MarketplaceJob): string {
  return [job.location.city, job.location.state].filter(Boolean).join(", ");
}

function salaryText(job: MarketplaceJob): string | null {
  const salary = job.salary;
  if (!salary) return null;
  if (salary.label) return salary.label;
  if (salary.min === undefined || salary.max === undefined) return null;
  const range = `${new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(salary.min)} – ${new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(salary.max)}`;
  return `${range}${salary.unit ? ` / ${salary.unit.toLowerCase()}` : ""}`;
}

function formatPostedDate(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getJobPostingSchema(job: MarketplaceJob) {
  const datePosted = job.postedAt ? new Date(job.postedAt) : null;
  const employmentTypeMap: Record<string, string> = {
    "full-time": "FULL_TIME",
    "full time": "FULL_TIME",
    "part-time": "PART_TIME",
    "part time": "PART_TIME",
    contract: "CONTRACTOR",
    contractor: "CONTRACTOR",
    temporary: "TEMPORARY",
    internship: "INTERN",
    intern: "INTERN",
  };
  const employmentType = job.jobType
    ? employmentTypeMap[job.jobType.trim().toLowerCase()]
    : undefined;
  const salary = job.salary;
  const validSalary =
    salary?.min !== undefined &&
    salary.max !== undefined &&
    salary.min > 0 &&
    salary.max >= salary.min &&
    Boolean(salary.unit) &&
    /^[A-Z]{3}$/.test(salary.currency);
  const validLocation = Boolean(job.location.city && job.location.state);
  const validDate = Boolean(
    datePosted &&
      !Number.isNaN(datePosted.getTime()) &&
      datePosted.getTime() <= Date.now(),
  );

  if (
    !job.company ||
    !job.title ||
    !job.description ||
    !validDate ||
    !validLocation
  ) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: datePosted?.toISOString(),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location.city,
        addressRegion: job.location.state,
        addressCountry: "IN",
      },
    },
    ...(validSalary
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: salary.currency,
            value: {
              "@type": "QuantitativeValue",
              minValue: salary.min,
              maxValue: salary.max,
              unitText: salary.unit,
            },
          },
        }
      : {}),
    ...(employmentType ? { employmentType } : {}),
    ...(job.experience
      ? { experienceRequirements: job.experience }
      : {}),
  };
}

function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export async function generateMetadata({
  params,
}: JobRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await findJob(slug);
  if (!job) return { title: "Job not found | LabourSampark", robots: { index: false } };

  const place = locationText(job);
  const jobRole = job.category || job.title;
  const pageTitle = `${jobRole} Jobs${place ? ` in ${job.location.city}` : ""} | LabourSampark`;
  const pageDescription = [
    `Explore this ${jobRole.toLowerCase()} opportunity`,
    place ? `in ${place}` : "",
    job.experience ? `for workers with ${job.experience} experience` : "",
    "on LabourSampark.",
    job.salary ? `Pay: ${salaryText(job)}.` : "",
  ]
    .filter(Boolean)
    .join(" ");
  const canonicalUrl = `${siteUrl}/jobs/${job.slug}`;

  return {
    title: pageTitle,
    description: pageDescription.slice(0, 160),
    alternates: { canonical: canonicalUrl },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: "LabourSampark",
      title: pageTitle,
      description: pageDescription.slice(0, 160),
      images: [
        {
          url: "/images/logo.jpg",
          width: 1200,
          height: 630,
          alt: job.title,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: pageTitle,
      description: pageDescription.slice(0, 160),
      images: ["/images/logo.jpg"],
    },
  };
}

export default async function JobDetailPage({ params }: JobRouteProps) {
  const { slug } = await params;
  const job = await findJob(slug);
  if (!job) notFound();

  const place = locationText(job);
  const date = formatPostedDate(job.postedAt);
  const postingSchema = getJobPostingSchema(job);
  const breadcrumbSchema = {
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
      {
        "@type": "ListItem",
        position: 3,
        name: job.category || job.title,
        item: `${siteUrl}/jobs?skill=${encodeURIComponent(job.category)}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: job.title,
        item: `${siteUrl}/jobs/${job.slug}`,
      },
    ],
  };
  return (
    <div className="min-h-screen bg-zinc-50 pb-16 pt-20 dark:bg-zinc-950 sm:pt-24">
      {postingSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(postingSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-5 text-sm">
          <ol className="flex flex-wrap items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <li>
              <Link
                href="/"
                className="rounded-sm hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:text-blue-300"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/jobs"
                className="rounded-sm hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:text-blue-300"
              >
                Jobs
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-zinc-800 dark:text-zinc-200">
              {job.category}
            </li>
          </ol>
        </nav>

        <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <header className="border-b border-zinc-200 p-5 dark:border-zinc-800 sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                <BriefcaseBusiness size={23} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                {job.category && (
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    {job.category}
                  </p>
                )}
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
                  {job.title}
                </h1>
                {job.company && (
                  <p className="mt-2 font-medium text-zinc-700 dark:text-zinc-200">
                    {job.company}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-zinc-600 dark:text-zinc-300">
              {place && (
                <span className="inline-flex items-center gap-2">
                  <MapPin size={16} aria-hidden="true" />
                  {place}
                </span>
              )}
              {salaryText(job) && (
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {salaryText(job)}
                </span>
              )}
              {job.experience && <span>{job.experience} experience</span>}
              {job.jobType && <span>{job.jobType}</span>}
              {job.workersNeeded && (
                <span>{job.workersNeeded} positions</span>
              )}
              {date && <span>Posted {date}</span>}
            </div>

            <AppJobAction className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900">
              Know more or apply in app
            </AppJobAction>
          </header>

          <div className="space-y-8 p-5 sm:p-8">
            <section aria-labelledby="job-description-heading">
              <h2
                id="job-description-heading"
                className="text-lg font-semibold text-zinc-950 dark:text-white"
              >
                Job description
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                {job.description}
              </p>
            </section>

            {job.skills.length > 0 && (
              <section aria-labelledby="job-skills-heading">
                <h2
                  id="job-skills-heading"
                  className="text-lg font-semibold text-zinc-950 dark:text-white"
                >
                  Skills for this role
                </h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-md bg-zinc-100 px-3 py-1.5 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {job.responsibilities.length > 0 && (
              <section aria-labelledby="job-responsibilities-heading">
                <h2
                  id="job-responsibilities-heading"
                  className="text-lg font-semibold text-zinc-950 dark:text-white"
                >
                  Responsibilities
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-700 marker:text-blue-700 dark:text-zinc-300 dark:marker:text-blue-300">
                  {job.responsibilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {job.requirements.length > 0 && (
              <section aria-labelledby="job-requirements-heading">
                <h2
                  id="job-requirements-heading"
                  className="text-lg font-semibold text-zinc-950 dark:text-white"
                >
                  Requirements
                </h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-700 marker:text-blue-700 dark:text-zinc-300 dark:marker:text-blue-300">
                  {job.requirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {(job.company || job.employerAbout) && (
              <section aria-labelledby="employer-heading">
                <h2
                  id="employer-heading"
                  className="text-lg font-semibold text-zinc-950 dark:text-white"
                >
                  About the employer
                </h2>
                {job.company && (
                  <p className="mt-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {job.company}
                  </p>
                )}
                {job.employerAbout && (
                  <p className="mt-1 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                    {job.employerAbout}
                  </p>
                )}
              </section>
            )}

            <div className="border-t border-zinc-200 pt-5 dark:border-zinc-800">
              <Link
                href="/jobs"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300 dark:hover:text-blue-200"
              >
                <ChevronRight
                  size={17}
                  aria-hidden="true"
                  className="rotate-180"
                />
                Browse more jobs
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
