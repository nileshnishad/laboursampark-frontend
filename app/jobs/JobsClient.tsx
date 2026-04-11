"use client";

import React, { useEffect, useState } from "react";
import { getToken } from "@/lib/api-service";
import Skeleton from "@/app/components/Skeleton";
import JobCard from "@/app/components/common/JobCard";
import { useRouter, useSearchParams } from "next/navigation";
import { Briefcase, Filter, Search, SearchCheck } from "lucide-react";

const mockJobs = [
  {
    _id: "1",
    workTitle: "Urgent Furniture Work: Modular Kitchen & Wardrobe",
    description: "Looking for 5 skilled furniture carpenters for a premium interior project in Mumbai. Specialist needed for modular kitchen fitting and wardrobe installation. Tools provided.",
    location: { city: "Mumbai", state: "Maharashtra" },
    workersNeeded: "5+",
    category: "Furniture/Carpenter",
    createdAt: new Date().toISOString(),
    createdBy: { fullName: "Rakesh construction", email: "rakesh@const.com", mobile: "+91 9172272305" }
  },
  {
    _id: "2",
    workTitle: "Interior Wall Painting & Texture Work",
    description: "Professional painters required for a high-end 3BHK interior painting job in Pune. Must be skilled in royal emulsion and decorative texture painting.",
    location: { city: "Pune", state: "Maharashtra" },
    workersNeeded: "2",
    category: "Painting",
    createdAt: new Date().toISOString(),
    createdBy: { fullName: "Anil Designs", email: "anil@designs.com", mobile: "+91 8877665544" }
  },
  {
    _id: "3",
    workTitle: "Industrial Electrician: Warehouse Wiring & Panels",
    description: "Heavy-duty warehouse project in Nashik needs licensed industrial electricians. Task includes main panel setup and underground cable wiring.",
    location: { city: "Nashik", state: "Maharashtra" },
    workersNeeded: "4",
    category: "Electrical",
    createdAt: new Date().toISOString(),
    createdBy: { fullName: "Power Builders", email: "power@builders.com", mobile: "+91 7766554433" }
  },
  {
    _id: "4",
    workTitle: "Skilled Mason for Tile & Marble Installation",
    description: "Building project in Thane requires expert masons for granite floor and wall tile installation. 6 months long-term project with accommodation.",
    location: { city: "Thane", state: "Maharashtra" },
    workersNeeded: "10+",
    category: "Masonry",
    createdAt: new Date().toISOString(),
    createdBy: { fullName: "Thane Constructions", email: "thane@const.com", mobile: "+91 6655443322" }
  },
  {
    _id: "5",
    workTitle: "Sofa Repairing & Upholstery Specialist",
    description: "Skilled upholstery worker/carpenter needed for premium sofa manufacturing unit in Nagpur. Must know fabric cutting and foam fixing.",
    location: { city: "Nagpur", state: "Maharashtra" },
    workersNeeded: "3",
    category: "Furniture",
    createdAt: new Date().toISOString(),
    createdBy: { fullName: "Nagpur Furnishing", email: "nagpur@furnishing.com", mobile: "+91 5544332211" }
  },
  {
    _id: "6",
    workTitle: "Structural Steel Fixer for Metro Project",
    description: "Aurangabad Metro project hiring steel fixers and welders for heavy structural bridge work. Safety certification preffered.",
    location: { city: "Aurangabad", state: "Maharashtra" },
    workersNeeded: "15+",
    category: "Steel/Construction",
    createdAt: new Date().toISOString(),
    createdBy: { fullName: "Infra Corp", email: "infra@corp.com", mobile: "+91 4433221100" }
  }
];

export default function JobsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [jobs] = useState(mockJobs);
  const [loading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isLoggedIn = Boolean(getToken());

  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) setSearchQuery(decodeURIComponent(urlSearch));
  }, [searchParams]);

  const filteredJobs = jobs.filter(job => {
    const query = searchQuery.toLowerCase();
    const city = typeof job.location === "string" ? job.location : job.location?.city || "";
    return job.workTitle.toLowerCase().includes(query) || 
           job.description.toLowerCase().includes(query) ||
           city.toLowerCase().includes(query);
  });

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 pt-10 md:pt-10">
      <div className="max-w-7xl mx-auto">
        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-6 md:p-10 border border-zinc-100 dark:border-zinc-800 shadow-sm mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                <Briefcase size={32} />
              </div>
              <div>
                <h1 className="text-2xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight leading-none mb-2">
                  All <span className="text-blue-600">Jobs</span>
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium">Opportunities for local skilled workers.</p>
              </div>
            </div>
            <div className="w-full md:w-96 relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, location, or skills..."
                className="w-full h-16 pl-14 pr-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>
          {!isLoggedIn && (
            <div className="bg-blue-600/5 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-4 text-sm font-bold text-blue-700 mb-2">
              <SearchCheck className="shrink-0" />
              <span>Login to see full job details like mobile numbers and apply directly.</span>
              <button onClick={() => router.push("/login?redirect=/jobs")} className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-blue-500/20">Login Now</button>
            </div>
          )}
        </div>
        <div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => <Skeleton key={i} type="card" />)}
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredJobs.map((job) => <JobCard key={job._id} job={job} isLoggedIn={isLoggedIn} />)}
            </div>
          ) : (
            <div className="text-center py-40 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[3rem] bg-zinc-50/50">
              <Filter className="mx-auto mb-6 text-zinc-400" size={32} />
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">No jobs found</h3>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
