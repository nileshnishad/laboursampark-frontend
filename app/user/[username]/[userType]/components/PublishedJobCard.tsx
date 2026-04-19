"use client";

import React, { useState, useEffect } from "react";
import { ImageIcon, ArrowRight, MapPin, Briefcase, CheckCircle } from "lucide-react";

// ─── Shared Types ────────────────────────────────────────────────────────────

export type RequirementTarget = "labour" | "sub_contractor";

export interface RequirementFormState {
  title: string;
  target: RequirementTarget[];
  description: string;
  location: string;
  workersNeeded: string;
  skills: string;
  images: string[];
  locationDetails: {
    city: string;
    state: string;
    area: string;
    pincode: string;
    address: string;
  };
}

export interface PublishedRequirement extends RequirementFormState {
  id: string;
  createdAt: string;
  visibility: boolean;
}

export interface ApiJob {
  _id?: string;
  id?: string;
  workTitle?: string;
  jobTitle?: string;
  visibility?: boolean;
  target?: RequirementTarget[];
  description?: string;
  location?: string | { city?: string; state?: string; area?: string; pincode?: string; address?: string };
  workersNeeded?: string | number;
  requiredSkills?: string[];
  skills?: string[];
  createdAt?: string;
  images?: string[];
}

const DEFAULT_LOCATION = { city: "", state: "", area: "", pincode: "", address: "" };

export function mapApiJobToPublishedRequirement(job: ApiJob): PublishedRequirement {
  const normalizedTargets = Array.isArray(job.target)
    ? job.target
        .map((item) => {
          if (item === "labour") return "labour";
          if (item === "sub_contractor") return "sub_contractor";
          return null;
        })
        .filter((item): item is RequirementTarget => item !== null)
    : [];

  const targetArray: RequirementTarget[] = normalizedTargets.length > 0 ? normalizedTargets : ["labour"];

  const skillsArray = Array.isArray(job.requiredSkills)
    ? job.requiredSkills
    : Array.isArray(job.skills)
      ? job.skills
      : [];

  return {
    id: String(job._id || job.id || Date.now()),
    title: job.workTitle || job.jobTitle || "Untitled Job",
    target: targetArray,
    description: job.description || "",
    location: typeof job.location === "string"
      ? job.location
      : typeof job.location === "object"
        ? `${job.location?.area || ""}, ${job.location?.city || ""}`.replace(/^, /, "")
        : "",
    workersNeeded: String(job.workersNeeded ?? ""),
    skills: skillsArray.join(", "),
    images: Array.isArray(job.images) ? job.images : [],
    locationDetails:
      typeof job.location === "object" && job.location !== null
        ? {
            city: job.location.city || "",
            state: job.location.state || "",
            area: job.location.area || "",
            pincode: job.location.pincode || "",
            address: job.location.address || "",
          }
        : DEFAULT_LOCATION,
    createdAt: job.createdAt ? new Date(job.createdAt).toLocaleString() : "",
    visibility: Boolean(job.visibility ?? false),
  };
}

// ─── PublishedJobCard Component ──────────────────────────────────────────────

interface PublishedJobCardProps {
  item: PublishedRequirement;
  formatTarget: (targets: RequirementTarget[]) => string;
  onShowDetails: () => void;
  onToggleVisibility: (jobId: string, currentVisibility: boolean) => void;
  onViewApplications: (jobId: string) => void;
  toggling: boolean;
}

export default function PublishedJobCard({
  item,
  formatTarget,
  onShowDetails,
  onToggleVisibility,
  onViewApplications,
  toggling,
}: PublishedJobCardProps) {
  // Auto-cycle images: rotate which image is front/middle/back
  const [imgIndex, setImgIndex] = useState(0);
  const imageCount = item.images?.length || 0;

  useEffect(() => {
    if (imageCount <= 1) return;
    const interval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % imageCount);
    }, 20000);
    return () => clearInterval(interval);
  }, [imageCount]);

  const getStackImage = (offset: number) => {
    if (!item.images || imageCount === 0) return "";
    return item.images[(imgIndex + offset) % imageCount];
  };

  return (
    <div className="group relative flex flex-col bg-white dark:bg-zinc-900 border-2 border-indigo-300 dark:border-indigo-700 rounded-3xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-2xl hover:shadow-indigo-400/20 hover:-translate-y-1">
      {/* Top Image Banner */}
      <div className="relative h-40 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {item.images && item.images.length > 1 ? (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 p-3">
            <div className="relative w-[75%] h-[90%]">
              {imageCount > 2 && (
                <div className="absolute inset-0 rounded-lg border-2 border-white dark:border-zinc-600 shadow-md overflow-hidden rotate-6 translate-x-2 -translate-y-1 bg-zinc-200 dark:bg-zinc-700 transition-all duration-700">
                  <img src={getStackImage(2)} alt="" className="w-full h-full object-cover opacity-70 transition-opacity duration-700" />
                </div>
              )}
              <div className="absolute inset-0 rounded-lg border-2 border-white dark:border-zinc-600 shadow-md overflow-hidden -rotate-3 -translate-x-1 translate-y-0.5 bg-zinc-200 dark:bg-zinc-700 transition-all duration-700">
                <img src={getStackImage(1)} alt="" className="w-full h-full object-cover opacity-80 transition-opacity duration-700" />
              </div>
              <div className="relative rounded-lg border-2 border-white dark:border-zinc-500 shadow-xl overflow-hidden h-full transition-all duration-700">
                <img src={getStackImage(0)} alt={item.title} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white shadow-lg">
              <ImageIcon size={10} />
              <span className="text-[9px] font-black">{imgIndex + 1}/{item.images.length}</span>
            </div>
          </div>
        ) : item.images && item.images.length === 1 ? (
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900">
            <div className="relative w-[60%] h-[70%]">
              <div className="absolute inset-0 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 rotate-6 translate-x-2 -translate-y-1 bg-zinc-100 dark:bg-zinc-800" />
              <div className="absolute inset-0 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 -rotate-3 -translate-x-1 translate-y-0.5 bg-zinc-100 dark:bg-zinc-800" />
              <div className="relative rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 h-full bg-zinc-50 dark:bg-zinc-800/80 flex items-center justify-center">
                <ImageIcon size={24} className="text-zinc-300 dark:text-zinc-600" />
              </div>
            </div>
            <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-600 mt-1.5 uppercase tracking-widest">No Photos</span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 pointer-events-none">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-lg border-2 ${
            item.visibility
              ? 'bg-green-600 border-green-400 text-white'
              : 'bg-zinc-800 border-zinc-600 text-zinc-300'
          }`}>
            <div className={`w-2 h-2 rounded-full ${item.visibility ? 'bg-white animate-pulse' : 'bg-zinc-500'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">
              {item.visibility ? 'Live' : 'Hidden'}
            </span>
          </div>
          <span className="text-[8px] font-bold text-white drop-shadow-md bg-black/30 px-1.5 py-0.5 rounded backdrop-blur-[2px]">
            {item.visibility ? 'Visible to everyone' : 'Only you can see this'}
          </span>
        </div>

        {/* Visibility Toggle */}
        <div className="absolute bottom-3 left-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(item.id, item.visibility);
            }}
            disabled={toggling}
            className={`group/toggle relative flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-md transition-all shadow-2xl border-2 ${
              item.visibility
                ? 'bg-white/95 border-green-500 text-green-700 hover:bg-green-50'
                : 'bg-zinc-900/95 border-zinc-500 text-zinc-100 hover:bg-zinc-800'
            } active:scale-95`}
            title={item.visibility ? "Click to Pause" : "Click to Publish"}
          >
            <div className="relative">
              <div className={`w-3 h-3 rounded-full transition-colors ${item.visibility ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-zinc-500'}`} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tight">
              {item.visibility ? 'Go Offline' : 'Go Online'}
            </span>
            {toggling && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </button>
        </div>
      </div>

      <div className="p-2 flex flex-col flex-1">
        {/* Title & Metadata */}
        <div className="mb-4">
          <h4 className="text-base md:text-lg font-extrabold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {item.title}
          </h4>
          <div className="flex items-center gap-2 mt-2 text-zinc-500 dark:text-zinc-400">
            <MapPin size={10} />
            <span className="text-xs font-medium truncate">
              {item.locationDetails.area}, {item.locationDetails.city}
            </span>
          </div>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 mb-5">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 transition-colors">
            <Briefcase size={12} className="text-indigo-500 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 capitalize truncate">
                {item.target[0] === 'labour' ? 'Labour' : 'Sub-Contractor'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 transition-colors">
            <CheckCircle size={12} className="text-green-500 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] font-bold text-zinc-400 uppercase leading-none">Required</span>
              <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 truncate">
                {item.workersNeeded} Workers
              </span>
            </div>
          </div>
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4 min-h-[1.5rem]">
          {item.skills.split(',').slice(0, 3).map((skill, i) => (
            <span key={i} className="text-xs font-bold text-indigo-700 dark:text-indigo-400 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800/50">
              {skill.trim()}
            </span>
          ))}
          {item.skills.split(',').length > 3 && (
            <div className="group/skills relative inline-block cursor-help">
              <span className="text-[10px] font-bold text-zinc-400 hover:text-indigo-500 transition-colors bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
                +{item.skills.split(',').length - 3} more
              </span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/skills:block z-30">
                <div className="bg-zinc-900 text-white text-[9px] py-1 px-2 rounded shadow-xl whitespace-nowrap">
                  {item.skills.split(',').slice(3).join(', ')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Description Snippet */}
        <p className="text-[12px] md:text-[14px] text-zinc-500 dark:text-zinc-400 truncate italic leading-relaxed mb-5" title={item.description}>
          &ldquo;{item.description}&rdquo;
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-indigo-100 dark:border-indigo-800 gap-1">
          <button
            onClick={() => onViewApplications(item.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-green-50 hover:bg-green-100 dark:bg-green-900/40 dark:hover:bg-green-800 text-green-700 dark:text-green-200 text-xs md:text-sm font-extrabold uppercase tracking-wider transition-all border border-green-100 dark:border-green-800 active:scale-95 shadow-sm"
          >
            Applications
          </button>
          <button
            onClick={onShowDetails}
            className="flex-1 flex items-center justify-center px-2 py-1 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-extrabold uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/20 active:scale-95 border border-indigo-700"
          >
            Edit Job
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
