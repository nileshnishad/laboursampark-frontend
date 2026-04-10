"use client";

import React from "react";
import { 
  Briefcase, 
  MapPin, 
  Users, 
  Calendar, 
  Lock, 
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Job {
  _id: string;
  workTitle: string;
  description: string;
  location: string | { address?: string; city?: string; state?: string };
  workersNeeded: number | string;
  budget?: string;
  createdAt: string;
  createdBy: {
    fullName: string;
    email: string;
    mobile: string;
  };
}

interface JobCardProps {
  job: Job;
  isLoggedIn: boolean;
}

export default function JobCard({ job, isLoggedIn }: JobCardProps) {
  const router = useRouter();

  const handleAction = () => {
    if (!isLoggedIn) {
      router.push("/login?redirect=/jobs");
    } else {
      // In a real app, this might open a modal or dedicated page
      router.push(`/jobs/${job._id}`);
    }
  };

  const locationText = typeof job.location === 'string' 
    ? job.location 
    : [job.location?.city, job.location?.state].filter(Boolean).join(", ") || "Location hidden";

  const blurText = (text: string) => {
    if (!isLoggedIn) {
      return (
        <span className="relative inline-flex items-center">
          <span className="blur-[4px] select-none opacity-40">XXXXXXXXXX</span>
          <Lock size={10} className="absolute left-1/2 -translate-x-1/2 text-gray-400" />
        </span>
      );
    }
    return text;
  };

  return (
    <div className="group relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1">
      {/* Premium Badge */}
      <div className="absolute top-6 right-6">
        <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-100 dark:border-blue-800">
          <ShieldCheck size={12} />
          Verified Job
        </div>
      </div>

      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="mb-6">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <Briefcase size={24} />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {job.workTitle}
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-2 leading-relaxed h-10">
            {job.description}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center shrink-0">
              <MapPin size={14} />
            </div>
            <span className="text-xs font-semibold truncate">{locationText}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center shrink-0">
              <Users size={14} />
            </div>
            <span className="text-xs font-semibold">Need: {job.workersNeeded}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center shrink-0">
              <Calendar size={14} />
            </div>
            <span className="text-xs font-semibold">{new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Private Data Section */}
        <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-medium">Contact Person:</span>
            <span className="text-zinc-900 dark:text-white font-bold">{blurText(job.createdBy.fullName)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-medium">Mobile Number:</span>
            <span className="text-zinc-900 dark:text-white font-bold">{blurText(job.createdBy.mobile)}</span>
          </div>
        </div>

        {/* CTA Button */}
        <button 
          onClick={handleAction}
          className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold text-sm hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white transition-all active:scale-95 group/btn"
        >
          {isLoggedIn ? "View Details" : "Login to Apply"}
          <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}