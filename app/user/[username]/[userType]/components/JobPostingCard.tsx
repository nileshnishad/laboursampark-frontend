"use client";

import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface JobPostingCardProps {
  job: any;
  onApply?: (jobId: string) => void;
  onView?: (jobId: string) => void;
}

export default function JobPostingCard({ job, onApply, onView }: JobPostingCardProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const companyName = job?.businessName || job?.companyName || "";
  const postedBy = job?.fullName || companyName || "Contractor";
  const workType = job?.workType || job?.jobType || job?.category || "General Work";
  const location = job?.location || job?.city || "Location not specified";
  const workersNeeded = job?.workersNeeded || job?.teamSize || "As required";
  const target = (job?.target || "Labour + Sub-Contractor").toString().replace("_", " ");
  const workDetails = job?.description || job?.bio || "Work details will be discussed after connection.";
  const skills = Array.isArray(job?.skills)
    ? job.skills
    : Array.isArray(job?.serviceCategories)
      ? job.serviceCategories
      : [];

  const locationText = typeof location === "string" ? location : location?.city || "Not specified";
  const jobId = job?.id || job?._id || "";
  const isProfileHidden = user?.display === false;

  const handleApplyClick = () => {
    if (isProfileHidden || !jobId) return;
    onApply?.(jobId);
  };

  const handleViewClick = () => {
    if (isProfileHidden || !jobId) return;
    onView?.(jobId);
  };

  return (
    <div className="h-full rounded-xl border border-blue-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-3.5 sm:p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
         
          <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mt-0.5 leading-snug">
            {job?.jobTitle || "Construction Work Available"}
          </h3>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 font-semibold whitespace-nowrap">
          Open
        </span>
      </div>

      <div className="mt-3 divide-y divide-gray-100 dark:divide-gray-700">
        <div className="py-1.5 flex items-start gap-2 text-sm">
          <span className="w-28 shrink-0 text-gray-500 dark:text-gray-400">Work Type</span>
          <span className="font-semibold text-gray-900 dark:text-white">{workType}</span>
        </div>

        {companyName && (
          <div className="py-1.5 flex items-start gap-2 text-sm">
            <span className="w-28 shrink-0 text-gray-500 dark:text-gray-400">Company</span>
            <span className="font-semibold text-gray-900 dark:text-white">{companyName}</span>
          </div>
        )}

        <div className="py-1.5 flex items-start gap-2 text-sm">
          <span className="w-28 shrink-0 text-gray-500 dark:text-gray-400">Posted By</span>
          <span className="font-semibold text-gray-900 dark:text-white">{postedBy}</span>
        </div>

        <div className="py-1.5 flex items-start gap-2 text-sm">
          <span className="w-28 shrink-0 text-gray-500 dark:text-gray-400">Location</span>
          <span className="font-semibold text-gray-900 dark:text-white">{locationText}</span>
        </div>

       

        <div className="py-1.5 flex items-start gap-2 text-sm">
          <span className="w-28 shrink-0 text-gray-500 dark:text-gray-400">Workers</span>
          <span className="font-semibold text-gray-900 dark:text-white">{workersNeeded}</span>
        </div>

        <div className="py-1.5 flex items-start gap-2 text-sm">
          <span className="w-28 shrink-0 text-gray-500 dark:text-gray-400">Can Apply</span>
          <span className="font-semibold text-gray-900 dark:text-white capitalize">{target}</span>
        </div>
      </div>

      <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-gray-700">
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-0.5">Work Details</p>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{workDetails}</p>
      </div>

      {skills.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {skills.slice(0, 4).map((skill: string, idx: number) => (
            <span
              key={`${skill}-${idx}`}
              className="px-2 py-0.5 text-[11px] rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {isProfileHidden && (
        <p className="mt-2 text-[11px] text-orange-700 dark:text-orange-300">
          Make profile visible to view and connect on jobs.
        </p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-1.5">
        <button
          onClick={handleApplyClick}
          disabled={isProfileHidden || !jobId}
          className="w-full px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
        >
          Get Connect
        </button>
        <button
          onClick={handleViewClick}
          disabled={isProfileHidden || !jobId}
          className="w-full px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-60 disabled:cursor-not-allowed text-gray-900 dark:text-white text-sm font-semibold transition-colors"
        >
          View
        </button>
      </div>
    </div>
  );
}
