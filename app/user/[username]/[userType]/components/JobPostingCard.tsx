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
  const workTitle = job?.workTitle || job?.jobTitle || "Construction Work Available";
  const workersNeeded = job?.workersNeeded || job?.teamSize || "As required";
  const createdByName = job?.createdBy?.fullName || job?.fullName || job?.businessName || "Contractor";
  const status = job?.status || "open";
  const statusLabel = String(status).charAt(0).toUpperCase() + String(status).slice(1);
  const location = job?.location;
  const locationText =
    typeof location === "string"
      ? location
      : [location?.address, location?.state].filter(Boolean).join(", ") || job?.city || "Not specified";
  const targetArray = Array.isArray(job?.target)
    ? job.target
    : typeof job?.target === "string"
      ? [job.target]
      : [];
  const targetText =
    targetArray.length > 0
      ? targetArray
          .map((item: string) => (item === "sub_contractor" || item === "sub-contractor" ? "Sub-Contractor" : "Labour"))
          .join(" + ")
      : "Labour";
  const skills = Array.isArray(job?.requiredSkills)
    ? job.requiredSkills
    : Array.isArray(job?.skills)
      ? job.skills
      : [];
  const createdAt = job?.createdAt ? new Date(job.createdAt).toLocaleDateString() : "";
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
            {workTitle}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">By {createdByName}</p>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 font-semibold whitespace-nowrap">
          {statusLabel}
        </span>
      </div>

      <div className="mt-3 space-y-1.5 text-sm">
        <p className="text-gray-700 dark:text-gray-300"><span className="text-gray-500 dark:text-gray-400">Location:</span> {locationText}</p>
        <p className="text-gray-700 dark:text-gray-300"><span className="text-gray-500 dark:text-gray-400">Workers:</span> {workersNeeded}</p>
        <p className="text-gray-700 dark:text-gray-300"><span className="text-gray-500 dark:text-gray-400">Target:</span> {targetText}</p>
        {createdAt && (
          <p className="text-gray-700 dark:text-gray-300"><span className="text-gray-500 dark:text-gray-400">Created:</span> {createdAt}</p>
        )}
      </div>

      {skills.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-1.5">
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
