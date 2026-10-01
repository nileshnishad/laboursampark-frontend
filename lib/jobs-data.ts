export interface JobSalary {
  min?: number;
  max?: number;
  currency: string;
  unit?: "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR";
  label?: string;
}

export interface MarketplaceJob {
  id: string;
  slug: string;
  title: string;
  company?: string;
  employerAbout?: string;
  location: {
    city: string;
    state: string;
    address?: string;
  };
  salary?: JobSalary;
  experience?: string;
  jobType?: string;
  category: string;
  skills: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  postedAt?: string;
  workersNeeded?: string;
}

export interface JobFeed {
  jobs: MarketplaceJob[];
  error: boolean;
}

const approvedJobData: MarketplaceJob[] = [
  {
    id: "electrician-mumbai-maintenance-01",
    slug: "electrician-building-maintenance-mumbai",
    title: "Electrician for building maintenance",
    company: "Western Heights Facilities",
    employerAbout:
      "Residential property maintenance team supporting apartment buildings in Mumbai.",
    location: { city: "Mumbai", state: "Maharashtra" },
    salary: { min: 18000, max: 25000, currency: "INR", unit: "MONTH" },
    experience: "2–4 years",
    jobType: "Full-time",
    category: "Electrician",
    skills: ["Electrical wiring", "Preventive maintenance", "Fault finding"],
    description:
      "Support routine electrical maintenance across residential buildings, respond to repair requests and help keep common-area systems in working order.",
    responsibilities: [
      "Inspect wiring, lighting and distribution boards.",
      "Attend maintenance requests and document completed repairs.",
      "Follow site safety procedures during all electrical work.",
    ],
    requirements: [
      "Practical experience with residential electrical systems.",
      "Able to work safely with standard electrical tools.",
    ],
    postedAt: "2026-10-01T08:30:00.000Z",
    workersNeeded: "2",
  },
  {
    id: "plumber-thane-residential-01",
    slug: "plumber-residential-project-thane",
    title: "Plumber for residential project",
    company: "Sahyadri Buildworks",
    location: { city: "Thane", state: "Maharashtra" },
    salary: { min: 900, max: 1200, currency: "INR", unit: "DAY" },
    experience: "1–3 years",
    jobType: "Project work",
    category: "Plumber",
    skills: ["Water supply lines", "Sanitary fitting", "Leak repair"],
    description:
      "Join a residential site team for bathroom and kitchen plumbing work, including fixture installation and checks before handover.",
    responsibilities: [
      "Install water supply and drainage lines as per site instructions.",
      "Fit sanitary fixtures and check joints for leaks.",
      "Coordinate work with the site supervisor and other trades.",
    ],
    requirements: [
      "Experience with residential plumbing and sanitary fittings.",
      "Comfortable working at an active construction site.",
    ],
    postedAt: "2026-09-30T07:45:00.000Z",
    workersNeeded: "3",
  },
  {
    id: "carpenter-pune-modular-01",
    slug: "modular-kitchen-carpenter-pune",
    title: "Carpenter – modular kitchen installation",
    company: "Aarav Interior Works",
    location: { city: "Pune", state: "Maharashtra" },
    salary: { min: 22000, max: 30000, currency: "INR", unit: "MONTH" },
    experience: "3–5 years",
    jobType: "Full-time",
    category: "Carpenter",
    skills: ["Modular furniture", "Cabinet fitting", "Reading measurements"],
    description:
      "An interior installation team is looking for a carpenter experienced in fitting modular kitchen units and aligning cabinets at customer sites.",
    responsibilities: [
      "Measure and fit cabinets, shutters and hardware.",
      "Coordinate installation sequence with the site team.",
      "Keep finished surfaces protected during installation.",
    ],
    requirements: [
      "Hands-on modular kitchen or wardrobe installation experience.",
      "Ability to measure accurately and use carpentry tools.",
    ],
    postedAt: "2026-09-29T10:15:00.000Z",
    workersNeeded: "2",
  },
  {
    id: "mason-bengaluru-brickwork-01",
    slug: "mason-brickwork-bengaluru",
    title: "Mason for brickwork and plastering",
    company: "Nandi Civil Contractors",
    location: { city: "Bengaluru", state: "Karnataka" },
    salary: { min: 1000, max: 1400, currency: "INR", unit: "DAY" },
    experience: "2–5 years",
    jobType: "Contract",
    category: "Mason",
    skills: ["Brick masonry", "Internal plaster", "Site setting-out"],
    description:
      "Mason required for blockwork and internal plastering on a multi-unit residential project. Work is coordinated with the site supervisor.",
    responsibilities: [
      "Complete brick and block work to site measurements.",
      "Prepare surfaces and apply internal plaster finishes.",
      "Maintain a tidy work area and follow site safety rules.",
    ],
    requirements: [
      "Experience on residential construction sites.",
      "Able to work from measurements and supervisor instructions.",
    ],
    postedAt: "2026-09-28T06:50:00.000Z",
    workersNeeded: "4",
  },
  {
    id: "painter-hyderabad-interior-01",
    slug: "interior-painter-hyderabad",
    title: "Painter for apartment interiors",
    company: "Deccan Home Finishes",
    location: { city: "Hyderabad", state: "Telangana" },
    salary: { min: 850, max: 1150, currency: "INR", unit: "DAY" },
    experience: "2–4 years",
    jobType: "Project work",
    category: "Painter",
    skills: ["Surface preparation", "Emulsion painting", "Putty finish"],
    description:
      "Painters needed for surface preparation and interior emulsion work across apartments being prepared for occupancy.",
    responsibilities: [
      "Prepare walls, apply putty where needed and finish paint coats.",
      "Protect floors, fixtures and completed surfaces.",
      "Coordinate room handovers with the site supervisor.",
    ],
    requirements: [
      "Experience with interior painting and clean finishing.",
      "Able to follow colour and finish instructions.",
    ],
    postedAt: "2026-09-27T09:00:00.000Z",
    workersNeeded: "2",
  },
  {
    id: "welder-ahmedabad-fabrication-01",
    slug: "welder-fabrication-shop-ahmedabad",
    title: "Welder for fabrication workshop",
    company: "Shreeji Metal Fabrication",
    location: { city: "Ahmedabad", state: "Gujarat" },
    salary: { min: 20000, max: 28000, currency: "INR", unit: "MONTH" },
    experience: "2–5 years",
    jobType: "Full-time",
    category: "Welder",
    skills: ["Arc welding", "MIG welding", "Metal fabrication"],
    description:
      "Workshop role for a welder to assist with gates, frames and made-to-measure metal assemblies using drawings and supervisor guidance.",
    responsibilities: [
      "Prepare, align and weld metal components.",
      "Check finished joints and report material requirements.",
      "Use workshop equipment with appropriate protective gear.",
    ],
    requirements: [
      "Practical arc or MIG welding experience.",
      "Familiarity with workshop safety and basic measurements.",
    ],
    postedAt: "2026-09-26T08:00:00.000Z",
    workersNeeded: "2",
  },
  {
    id: "hvac-noida-commercial-01",
    slug: "hvac-technician-commercial-building-noida",
    title: "HVAC technician for commercial building",
    company: "Northline Building Services",
    location: { city: "Noida", state: "Uttar Pradesh" },
    salary: { min: 24000, max: 32000, currency: "INR", unit: "MONTH" },
    experience: "3–6 years",
    jobType: "Full-time",
    category: "HVAC Technician",
    skills: ["AC servicing", "Preventive maintenance", "Refrigeration"],
    description:
      "Building services team seeking a technician for scheduled HVAC inspections, basic troubleshooting and maintenance support at a commercial site.",
    responsibilities: [
      "Carry out planned checks on air-conditioning equipment.",
      "Assist with fault diagnosis and service records.",
      "Escalate repair needs and parts requirements to the supervisor.",
    ],
    requirements: [
      "Field experience servicing split or commercial AC systems.",
      "Comfortable following maintenance checklists and safety steps.",
    ],
    postedAt: "2026-09-25T11:00:00.000Z",
    workersNeeded: "1",
  },
  {
    id: "bar-bender-gurugram-residential-01",
    slug: "bar-bender-construction-gurugram",
    title: "Bar bender for residential construction",
    company: "Aravali Project Services",
    location: { city: "Gurugram", state: "Haryana" },
    salary: { min: 950, max: 1250, currency: "INR", unit: "DAY" },
    experience: "2–5 years",
    jobType: "Contract",
    category: "Bar Bender",
    skills: ["Rebar cutting", "Bar bending", "Reinforcement fixing"],
    description:
      "Bar bender needed to prepare and fix reinforcement for slabs and beams on a residential construction site.",
    responsibilities: [
      "Cut and bend reinforcement according to bar schedules.",
      "Fix bars and maintain cover as directed by the site team.",
      "Keep reinforcement materials organised near the work area.",
    ],
    requirements: [
      "Experience with reinforcement work on building sites.",
      "Able to follow bar-bending schedules and site instructions.",
    ],
    postedAt: "2026-09-24T07:30:00.000Z",
    workersNeeded: "5",
  },
  {
    id: "driver-lucknow-local-delivery-01",
    slug: "light-commercial-driver-lucknow",
    title: "Light commercial vehicle driver",
    company: "Awadh Electrical Supply",
    location: { city: "Lucknow", state: "Uttar Pradesh" },
    salary: { min: 16000, max: 21000, currency: "INR", unit: "MONTH" },
    experience: "2+ years",
    jobType: "Full-time",
    category: "Driver",
    skills: ["Route planning", "Goods handling", "Local delivery"],
    description:
      "Driver required for scheduled local delivery of electrical supplies to project sites and customer locations within the city.",
    responsibilities: [
      "Complete assigned delivery routes and maintain delivery records.",
      "Handle goods carefully during loading and unloading.",
      "Keep the vehicle clean and report maintenance issues.",
    ],
    requirements: [
      "Valid driving licence appropriate for the assigned vehicle.",
      "Familiarity with local roads and delivery routes.",
    ],
    postedAt: "2026-09-23T05:45:00.000Z",
    workersNeeded: "1",
  },
  {
    id: "tile-worker-surat-bathroom-01",
    slug: "tile-worker-bathroom-finishing-surat",
    title: "Tile worker for bathroom finishing",
    company: "BlueStone Renovation",
    location: { city: "Surat", state: "Gujarat" },
    salary: { min: 1100, max: 1500, currency: "INR", unit: "DAY" },
    experience: "3–5 years",
    jobType: "Project work",
    category: "Tile Worker",
    skills: ["Wall tiling", "Floor tiling", "Tile cutting"],
    description:
      "Tile worker required for bathroom wall and floor finishes on a residential renovation. Work includes setting-out, cuts and grouting.",
    responsibilities: [
      "Set out tile patterns and maintain consistent joints.",
      "Cut tiles neatly around fixtures and corners.",
      "Grout finished surfaces and protect completed areas.",
    ],
    requirements: [
      "Experience with bathroom wall and floor tiling.",
      "Able to use tile cutters and common installation tools.",
    ],
    postedAt: "2026-09-22T09:20:00.000Z",
    workersNeeded: "2",
  },
  {
    id: "site-helper-prayagraj-construction-01",
    slug: "construction-helper-prayagraj",
    title: "Construction site helper",
    company: "Ganga Civil Works",
    location: { city: "Prayagraj", state: "Uttar Pradesh" },
    salary: { min: 600, max: 800, currency: "INR", unit: "DAY" },
    experience: "Entry level",
    jobType: "Daily work",
    category: "Construction Helper",
    skills: ["Material handling", "Site housekeeping", "Team support"],
    description:
      "Site helper needed to support a building team with material movement, basic preparation and keeping work areas organised.",
    responsibilities: [
      "Move materials safely as directed by site workers.",
      "Support basic site preparation and housekeeping.",
      "Follow instructions from the supervisor and skilled team.",
    ],
    requirements: [
      "Willingness to work as part of a construction site team.",
      "Able to follow safety guidance and use basic protective equipment.",
    ],
    postedAt: "2026-09-21T06:30:00.000Z",
    workersNeeded: "4",
  },
];

export const approvedJobs = approvedJobData;

function record(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function stringValue(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value).trim();
  }
  return "";
}

function listOfStrings(value: unknown): string[] {
  return Array.isArray(value)
    ? value.map(stringValue).filter(Boolean)
    : [];
}

function slugPart(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function stableSuffix(value: string): string {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash).toString(36).slice(0, 6);
}

function parseSalary(raw: Record<string, unknown>): JobSalary | undefined {
  const salaryRecord =
    record(raw.salary) ?? record(raw.pay) ?? record(raw.budget);
  const rawText =
    typeof raw.salary === "string"
      ? raw.salary
      : typeof raw.pay === "string"
        ? raw.pay
        : typeof raw.budget === "string"
          ? raw.budget
          : "";
  const min = Number(
    salaryRecord?.min ??
      salaryRecord?.minValue ??
      raw.salaryMin ??
      raw.minSalary,
  );
  const max = Number(
    salaryRecord?.max ??
      salaryRecord?.maxValue ??
      raw.salaryMax ??
      raw.maxSalary,
  );
  const unitValue = stringValue(
    salaryRecord?.unit ?? raw.salaryUnit ?? raw.payPeriod,
  ).toUpperCase();
  const supportedUnits: JobSalary["unit"][] = [
    "HOUR",
    "DAY",
    "WEEK",
    "MONTH",
    "YEAR",
  ];
  const unit = supportedUnits.find((candidate) => candidate === unitValue);
  const hasRange =
    Number.isFinite(min) &&
    Number.isFinite(max) &&
    min > 0 &&
    max >= min;

  if (!hasRange && !rawText) return undefined;
  return {
    ...(hasRange ? { min, max } : {}),
    currency: stringValue(salaryRecord?.currency ?? raw.currency) || "INR",
    ...(unit ? { unit } : {}),
    ...(rawText ? { label: rawText } : {}),
  };
}

export function normalizeApiJob(value: unknown): MarketplaceJob | null {
  const raw = record(value);
  if (!raw) return null;

  const title = stringValue(raw.workTitle ?? raw.jobTitle ?? raw.title);
  if (!title) return null;

  const rawLocation = record(raw.location);
  const city = stringValue(rawLocation?.city ?? raw.city);
  const state = stringValue(rawLocation?.state ?? raw.state);
  const locationText = typeof raw.location === "string" ? raw.location : "";
  const [fallbackCity, fallbackState] = locationText
    .split(",")
    .map((part) => part.trim());
  const finalCity = city || fallbackCity || "";
  const finalState = state || fallbackState || "";
  const skills = listOfStrings(raw.requiredSkills ?? raw.skills);
  const category = stringValue(raw.category) || skills[0] || "";
  const id = stringValue(raw.jobId ?? raw.id ?? raw._id);
  const rawPostedAt = stringValue(raw.createdAt ?? raw.postedAt);
  const postedAtDate = rawPostedAt ? new Date(rawPostedAt) : null;
  const postedAt =
    postedAtDate && !Number.isNaN(postedAtDate.getTime())
      ? postedAtDate.toISOString()
      : "";
  const employer = record(raw.createdBy ?? raw.postedBy);
  const company = stringValue(
    employer?.businessName ??
      employer?.companyName ??
      raw.businessName ??
      raw.companyName,
  );
  const responsibilities = listOfStrings(raw.responsibilities);
  const requirements = listOfStrings(raw.requirements);
  const locationName = [finalCity, finalState].filter(Boolean).join("-");
  const baseSlug = slugPart([title, locationName].filter(Boolean).join("-"));
  const identity = id || [title, finalCity, postedAt].join("|");
  const jobType = stringValue(raw.jobType ?? raw.employmentType);
  const experience = stringValue(
    raw.experience ?? raw.experienceRequired ?? raw.experienceLevel,
  );
  const description = stringValue(raw.description);
  const salary = parseSalary(raw);

  return {
    id,
    slug: `${baseSlug || "skilled-job"}-${stableSuffix(identity)}`,
    title,
    ...(company ? { company } : {}),
    ...(stringValue(employer?.about ?? employer?.description)
      ? {
          employerAbout: stringValue(
            employer?.about ?? employer?.description,
          ),
        }
      : {}),
    location: {
      city: finalCity,
      state: finalState,
      ...(stringValue(rawLocation?.area ?? rawLocation?.address)
        ? { address: stringValue(rawLocation?.area ?? rawLocation?.address) }
        : {}),
    },
    ...(salary ? { salary } : {}),
    ...(experience ? { experience } : {}),
    ...(jobType ? { jobType } : {}),
    category,
    skills,
    description,
    responsibilities,
    requirements,
    ...(postedAt ? { postedAt } : {}),
    ...(stringValue(raw.workersNeeded)
      ? { workersNeeded: stringValue(raw.workersNeeded) }
      : {}),
  };
}

function extractJobs(payload: unknown): unknown[] {
  const root = record(payload);
  const nested = record(root?.data);
  const container = nested ?? root;
  const nestedData = record(container?.data);
  const list =
    container?.jobs ??
    container?.items ??
    nestedData?.jobs ??
    nestedData?.items;
  return Array.isArray(list) ? list : [];
}

function getTotalPages(payload: unknown): number {
  const root = record(payload);
  const nested = record(root?.data);
  const container = nested ?? root;
  const meta =
    record(container?.pagination) ??
    record(container?.meta) ??
    record(record(container?.data)?.pagination) ??
    record(record(container?.data)?.meta);
  const pages = Number(
    meta?.totalPages ?? meta?.pages ?? container?.totalPages ?? 1,
  );
  return Number.isFinite(pages) && pages > 0 ? Math.floor(pages) : 1;
}

class OpenJobsApiError extends Error {
  constructor(readonly status: number) {
    super(`Open jobs API returned HTTP ${status}`);
    this.name = "OpenJobsApiError";
  }
}

export async function getOpenJobFeed(): Promise<JobFeed> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

  try {
    const fetchPage = async (page: number): Promise<unknown> => {
      const url = new URL("/api/jobs", apiBase);
      url.searchParams.set("status", "open");
      url.searchParams.set("page", String(page));
      url.searchParams.set("limit", "100");

      const response = await fetch(url, {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) {
        throw new OpenJobsApiError(response.status);
      }

      return response.json();
    };

    const firstPage = await fetchPage(1);
    const totalPages = Math.min(10, getTotalPages(firstPage));
    const pages =
      totalPages > 1
        ? [
            firstPage,
            ...(await Promise.all(
              Array.from({ length: totalPages - 1 }, (_, index) =>
                fetchPage(index + 2),
              ),
            )),
          ]
        : [firstPage];
    const jobs = pages
      .flatMap(extractJobs)
      .map(normalizeApiJob)
      .filter((job): job is MarketplaceJob => Boolean(job));
    if (jobs.length > 0) return { jobs, error: false };
    return { jobs: approvedJobs, error: false };
  } catch (error) {
    if (error instanceof OpenJobsApiError && error.status === 401) {
      return { jobs: approvedJobs, error: false };
    }

    console.error("Failed to fetch public jobs:", error);
    return { jobs: approvedJobs, error: true };
  }
}
