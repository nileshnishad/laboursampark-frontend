"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  ChevronRight,
  MapPin,
  Search,
  X,
} from "lucide-react";
import type { MarketplaceJob } from "@/lib/jobs-data";
import AppJobAction from "./AppJobAction";
import { useLanguage } from "@/app/context/LanguageContext";

const PAGE_SIZE = 12;

interface JobsClientProps {
  jobs: MarketplaceJob[];
  feedError: boolean;
  initialQuery?: string;
  initialLocation?: string;
  initialCategory?: string;
  initialExperience?: string;
  initialJobType?: string;
  initialSalary?: string;
}

const salaryFilterOptions = [
  { value: "month-under-20000", label: "Under ₹20,000 / month", min: 0, max: 20000, unit: "MONTH" },
  { value: "month-20000-35000", label: "₹20,000–₹35,000 / month", min: 20000, max: 35000, unit: "MONTH" },
  { value: "month-over-35000", label: "Over ₹35,000 / month", min: 35000, max: Infinity, unit: "MONTH" },
  { value: "day-under-800", label: "Under ₹800 / day", min: 0, max: 800, unit: "DAY" },
  { value: "day-800-1200", label: "₹800–₹1,200 / day", min: 800, max: 1200, unit: "DAY" },
  { value: "day-over-1200", label: "Over ₹1,200 / day", min: 1200, max: Infinity, unit: "DAY" },
];

function money(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function salaryText(job: MarketplaceJob): string {
  const salary = job.salary;
  if (!salary) return "";
  if (salary.label) return salary.label;
  if (salary.min === undefined || salary.max === undefined) return "";
  const range = `${money(salary.min)} – ${money(salary.max)}`;
  const unit = salary.unit?.toLowerCase();
  return unit ? `${range} / ${unit}` : range;
}

function postedDate(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function updateSearchUrl(
  values: Record<string, string>,
) {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const queryString = params.toString();
  window.history.replaceState(
    null,
    "",
    queryString ? `/jobs?${queryString}` : "/jobs",
  );
}

export default function JobsClient({
  jobs,
  feedError,
  initialQuery = "",
  initialLocation = "",
  initialCategory = "",
  initialExperience = "",
  initialJobType = "",
  initialSalary = "",
}: JobsClientProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState(initialCategory);
  const [experience, setExperience] = useState(initialExperience);
  const [jobType, setJobType] = useState(initialJobType);
  const [salaryFilter, setSalaryFilter] = useState(initialSalary);
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => [...new Set(jobs.map((job) => job.category).filter(Boolean))],
    [jobs],
  );
  const experiences = useMemo(
    () => [...new Set(jobs.map((job) => job.experience).filter(Boolean))],
    [jobs],
  );
  const jobTypes = useMemo(
    () => [...new Set(jobs.map((job) => job.jobType).filter(Boolean))],
    [jobs],
  );
  const salaryTypes = useMemo(
    () =>
      [...new Set(jobs.map((job) => job.salary?.unit).filter(Boolean))],
    [jobs],
  );
  const availableSalaryFilters = salaryFilterOptions.filter((option) =>
    salaryTypes.includes(option.unit as NonNullable<MarketplaceJob["salary"]>["unit"]),
  );

  const filteredJobs = useMemo(() => {
    const terms = query
      .trim()
      .toLocaleLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    const locationTerm = location.trim().toLocaleLowerCase();

    return jobs.filter((job) => {
      const searchableText = [
        job.title,
        job.company,
        job.category,
        job.location.city,
        job.location.state,
        job.location.address,
        job.description,
        ...job.skills,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();
      const matchesTerms = terms.every((term) => searchableText.includes(term));
      const fullLocation = `${job.location.city} ${job.location.state} ${job.location.address ?? ""}`
        .toLocaleLowerCase();
      const matchesLocation =
        !locationTerm || fullLocation.includes(locationTerm);
      const matchesCategory = !category || job.category === category;
      const matchesExperience =
        !experience || job.experience === experience;
      const matchesJobType = !jobType || job.jobType === jobType;
      const salaryOption = salaryFilterOptions.find(
        (option) => option.value === salaryFilter,
      );
      const matchesSalary =
        !salaryOption ||
        (job.salary?.unit === salaryOption.unit &&
          job.salary.min !== undefined &&
          job.salary.min < salaryOption.max &&
          (job.salary.max ?? job.salary.min) >= salaryOption.min);

      return (
        matchesTerms &&
        matchesLocation &&
        matchesCategory &&
        matchesExperience &&
        matchesJobType &&
        matchesSalary
      );
    });
  }, [jobs, query, location, category, experience, jobType, salaryFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleJobs = filteredJobs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const applySearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    updateSearchUrl({
      q: query.trim(),
      location: location.trim(),
      skill: category,
      experience,
      type: jobType,
      salary: salaryFilter,
    });
  };

  const updateFilter = (
    setter: (value: string) => void,
    key: string,
    value: string,
  ) => {
    setter(value);
    setPage(1);
    updateSearchUrl({
      q: query.trim(),
      location: location.trim(),
      skill: key === "skill" ? value : category,
      experience: key === "experience" ? value : experience,
      type: key === "type" ? value : jobType,
      salary: key === "salary" ? value : salaryFilter,
    });
  };

  const clearFilters = () => {
    setQuery("");
    setLocation("");
    setCategory("");
    setExperience("");
    setJobType("");
    setSalaryFilter("");
    setPage(1);
    window.history.replaceState(null, "", "/jobs");
  };

  const filterSelectClass =
    "h-11 min-w-0 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

  return (
    <div className="min-h-screen bg-zinc-50 pb-16 pt-20 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 sm:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section
          aria-labelledby="jobs-heading"
          className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8"
        >
          <div className="max-w-3xl">
            <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
              <BriefcaseBusiness size={17} aria-hidden="true" />
              LabourSampark {t("navigation.jobs", {}, "Jobs")}
            </p>
            <h1
              id="jobs-heading"
              className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl"
            >
              {t("find_work_based_on_skills", {}, "Find Jobs That Match Your Skills")}
            </h1>
            <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-zinc-300">
              Discover work opportunities related to your skills, trade and
              location. Search listings shared on LabourSampark and review the
              details before continuing.
            </p>
          </div>

          <form
            aria-label="Search jobs"
            onSubmit={applySearch}
            className="mt-6 grid gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-950 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)_auto] sm:p-4"
          >
            <label className="relative block">
              <span className="sr-only">{t("search_labour_hint", {}, "Search jobs, skills or trades")}</span>
              <Search
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("search_labour_hint", {}, "Search jobs, skills or trades")}
                className="h-12 w-full rounded-lg border border-zinc-300 bg-white pl-10 pr-3 text-sm text-zinc-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              />
            </label>
            <label className="relative block">
              <span className="sr-only">{t("city_dropdown", {}, "City or state")}</span>
              <MapPin
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="search"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder={t("city_dropdown", {}, "City or state")}
                className="h-12 w-full rounded-lg border border-zinc-300 bg-white pl-10 pr-3 text-sm text-zinc-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
              />
            </label>
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
            >
              {t("search_contractor", {}, "Search jobs")}
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          </form>

          {(categories.length > 0 ||
            experiences.length > 0 ||
            jobTypes.length > 0 ||
            availableSalaryFilters.length > 0) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.length > 0 && (
                <label>
                  <span className="sr-only">Filter by skill or trade</span>
                  <select
                    value={category}
                    onChange={(event) =>
                      updateFilter(
                        setCategory,
                        "skill",
                        event.currentTarget.value,
                      )
                    }
                    className={filterSelectClass}
                  >
                    <option value="">{t("all_skills", {}, "All skills")}</option>
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              {experiences.length > 0 && (
                <label>
                  <span className="sr-only">Filter by experience</span>
                  <select
                    value={experience}
                    onChange={(event) =>
                      updateFilter(
                        setExperience,
                        "experience",
                        event.currentTarget.value,
                      )
                    }
                    className={filterSelectClass}
                  >
                    <option value="">{t("any_experience", {}, "Any experience")}</option>
                    {experiences.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              {jobTypes.length > 0 && (
                <label>
                  <span className="sr-only">Filter by job type</span>
                  <select
                    value={jobType}
                    onChange={(event) =>
                      updateFilter(
                        setJobType,
                        "type",
                        event.currentTarget.value,
                      )
                    }
                    className={filterSelectClass}
                  >
                    <option value="">{t("any_job_type", {}, "Any job type")}</option>
                    {jobTypes.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              {availableSalaryFilters.length > 0 && (
                <label>
                  <span className="sr-only">Filter by salary range</span>
                  <select
                    value={salaryFilter}
                    onChange={(event) =>
                      updateFilter(
                        setSalaryFilter,
                        "salary",
                        event.currentTarget.value,
                      )
                    }
                    className={filterSelectClass}
                  >
                    <option value="">{t("any_pay_range", {}, "Any pay range")}</option>
                    {availableSalaryFilters.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              {(query || location || category || experience || jobType || salaryFilter) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-zinc-600 underline underline-offset-2 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-zinc-300 dark:hover:text-blue-300"
                >
                  <X size={15} aria-hidden="true" />
                  {t("clear_filters", {}, "Clear filters")}
                </button>
              )}
            </div>
          )}
        </section>

        {feedError && (
          <aside
            aria-label="Job listing update"
            className="mt-5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-950 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100"
          >
            Job updates are temporarily unavailable. You can still browse
            these available opportunities.
          </aside>
        )}

        <section
          id="job-listings"
          aria-labelledby="job-listings-heading"
          className="mt-9 scroll-mt-24"
        >
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2
                id="job-listings-heading"
                className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-2xl"
              >
                {category ? `${category} ${t("opportunities", {}, "opportunities")}` : t("open_job_opportunities", {}, "Open job opportunities")}
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Browse skilled and trade work by role, experience and location.
              </p>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400" aria-live="polite">
              {filteredJobs.length}{" "}
              {filteredJobs.length === 1 ? t("opportunity", {}, "opportunity") : t("opportunities", {}, "opportunities")}
            </p>
          </div>

          {visibleJobs.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleJobs.map((job) => {
                const place = [job.location.city, job.location.state]
                  .filter(Boolean)
                  .join(", ");
                const date = postedDate(job.postedAt);

                return (
                  <article
                    key={job.slug}
                    className="flex min-w-0 flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        <BriefcaseBusiness size={19} aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold leading-6 text-zinc-950 dark:text-white">
                          <Link
                            href={`/jobs/${job.slug}`}
                            className="rounded-sm hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:text-blue-300"
                          >
                            {job.title}
                          </Link>
                        </h3>
                        {job.company && (
                          <p className="mt-1 truncate text-sm text-zinc-600 dark:text-zinc-300">
                            {job.company}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                      {place && (
                        <p className="flex items-start gap-2">
                          <MapPin
                            size={16}
                            aria-hidden="true"
                            className="mt-0.5 shrink-0 text-zinc-400"
                          />
                          <span>{place}</span>
                        </p>
                      )}
                      {salaryText(job) && (
                        <p className="font-semibold text-zinc-900 dark:text-white">
                          {salaryText(job)}
                        </p>
                      )}
                      {(job.experience || job.jobType) && (
                        <p>
                          {[job.experience, job.jobType]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}
                    </div>
                    {job.description && (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                        {job.description}
                      </p>
                    )}
                    {job.skills.length > 0 && (
                      <ul
                        aria-label="Required skills"
                        className="mt-3 flex flex-wrap gap-1.5"
                      >
                        {job.skills.slice(0, 4).map((skill) => (
                          <li
                            key={skill}
                            className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                          >
                            {skill}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                      {date && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {t("posted_on", {}, "Posted")} {date}
                        </p>
                      )}
                      <AppJobAction className="ml-auto inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900">
                        {t("know_more_or_apply_in_app", {}, "Know more or apply in app")}
                      </AppJobAction>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200 bg-white px-5 py-10 text-center dark:border-zinc-800 dark:bg-zinc-900 sm:px-8">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300">
                <Search size={21} aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
                {t("no_opportunities_match", {}, "No opportunities match these filters")}
              </h3>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                {t("try_different_filter", {}, "Try a different skill or location, or clear the filters to see all available listings.")}
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                <X size={16} aria-hidden="true" />
                {t("clear_filters", {}, "Clear filters")}
              </button>
            </div>
          )}

          {pageCount > 1 && (
            <nav
              aria-label="Job listing pages"
              className="mt-6 flex items-center justify-between gap-3"
            >
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={currentPage <= 1}
                className="inline-flex min-h-11 items-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:focus-visible:ring-offset-zinc-950"
              >
                {t("previous", {}, "Previous")}
              </button>
              <p className="text-sm text-zinc-600 dark:text-zinc-400" aria-live="polite">
                {t("page_of", { current: currentPage, total: pageCount }, `Page ${currentPage} of ${pageCount}`)}
              </p>
              <button
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(pageCount, current + 1))
                }
                disabled={currentPage >= pageCount}
                className="inline-flex min-h-11 items-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:focus-visible:ring-offset-zinc-950"
              >
                {t("next", {}, "Next")}
              </button>
            </nav>
          )}
        </section>

        <section
          aria-labelledby="jobs-guide-heading"
          className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800"
        >
          <h2
            id="jobs-guide-heading"
            className="text-lg font-semibold text-zinc-950 dark:text-white"
          >
            {t("find_work_based_on_skills", {}, "Find work based on your skills")}
          </h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            LabourSampark helps skilled workers, labour and contractors explore
            job opportunities by trade and location. Listings may include
            project work and ongoing roles in construction, maintenance,
            interiors, fabrication and transport. Review the skills,
            experience and location on each opportunity to find work relevant
            to your profile.
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            LabourSampark also helps you{" "}
            <Link
              href="/labours"
              className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200"
            >
              explore worker profiles
            </Link>{" "}
            and{" "}
            <Link
              href="/contractors"
              className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200"
            >
              find contractors
            </Link>
            .
          </p>
          {categories.length > 0 && (
            <nav aria-label="Popular job skills" className="mt-5">
              <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {t("browse_popular_skills", {}, "Browse popular skills")}
              </h3>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                {categories.slice(0, 8).map((item) => {
                  const params = new URLSearchParams({ skill: item });
                  return (
                    <li key={item}>
                      <Link
                        href={`/jobs?${params.toString()}`}
                        className="text-sm text-blue-700 underline underline-offset-2 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300 dark:hover:text-blue-200"
                      >
                        {item} jobs
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
