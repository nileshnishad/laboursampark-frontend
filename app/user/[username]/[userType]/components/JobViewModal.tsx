"use client";

import React, { useEffect, useMemo, useState } from "react";

interface JobViewModalProps {
  job: any;
  isOpen: boolean;
  onClose: () => void;
  onConnect?: (jobId: string) => void;
}

function getJobImageUrl(job: any): string {
  if (!job) return "";

  const directImage =
    job?.imageUrl ||
    job?.image ||
    job?.jobImage ||
    job?.photo ||
    job?.thumbnail;

  if (typeof directImage === "string" && directImage.trim()) {
    return directImage;
  }

  if (Array.isArray(job?.images) && job.images.length > 0) {
    const first = job.images[0];
    if (typeof first === "string") return first;
    if (first?.url) return first.url;
  }

  if (Array.isArray(job?.photos) && job.photos.length > 0) {
    const first = job.photos[0];
    if (typeof first === "string") return first;
    if (first?.url) return first.url;
  }

  return "";
}

export default function JobViewModal({ job, isOpen, onClose, onConnect }: JobViewModalProps) {
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowImage(false);
    }
  }, [isOpen]);

  const companyName = job?.businessName || job?.companyName || "N/A";
  const postedBy = job?.fullName || companyName || "Contractor";
  const workType = job?.workType || job?.jobType || job?.category || "General Work";
  const location = job?.location || job?.city || "Not specified";
  const timeline = job?.timeline || job?.deadline || job?.duration || "Start as soon as possible";
  const workersNeeded = job?.workersNeeded || job?.teamSize || "As required";
  const target = (job?.target || "Labour + Sub-Contractor").toString().replace("_", " ");
  const workDetails = job?.description || job?.bio || "Work details will be discussed after connection.";
  const budget = job?.budget || job?.salary || job?.amount || "To be discussed";
  const jobId = job?.id || job?._id || "";

  const locationText = typeof location === "string" ? location : location?.city || "Not specified";
  const skills = Array.isArray(job?.skills)
    ? job.skills
    : Array.isArray(job?.serviceCategories)
      ? job.serviceCategories
      : [];

  const imageUrl = useMemo(() => getJobImageUrl(job), [job]);
  const hasImage = Boolean(imageUrl);

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="px-4 sm:px-5 py-3 border-b border-gray-200 dark:border-gray-700 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] sm:text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
              Job Details
            </p>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mt-0.5 leading-snug">
              {job?.jobTitle || "Construction Work Available"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
          >
            Close
          </button>
        </div>

        <div className="px-4 sm:px-5 py-3 overflow-y-auto space-y-3">
          {hasImage && (
            <div className="flex items-center justify-between gap-2 rounded-lg border border-blue-100 dark:border-blue-900/50 bg-blue-50/70 dark:bg-blue-900/20 px-3 py-2">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-sm font-medium">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <circle cx="8.5" cy="10" r="1.5" />
                  <path d="M21 15l-4.2-4.2a1 1 0 00-1.4 0L9 17" />
                </svg>
                <span>Job image available</span>
              </div>
              <button
                onClick={() => setShowImage((prev) => !prev)}
                className="text-xs sm:text-sm font-semibold px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
              >
                {showImage ? "Hide Image" : "View Image"}
              </button>
            </div>
          )}

          {showImage && hasImage && (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-900/40">
              <img
                src={imageUrl}
                alt={job?.jobTitle || "Job image"}
                className="w-full max-h-72 object-cover rounded-md"
              />
            </div>
          )}

          <div className="divide-y divide-gray-100 dark:divide-gray-700 rounded-lg border border-gray-100 dark:border-gray-700 px-3">
            <div className="py-2 flex items-start gap-2 text-sm">
              <span className="w-32 shrink-0 text-gray-500 dark:text-gray-400">Work Type</span>
              <span className="font-semibold text-gray-900 dark:text-white">{workType}</span>
            </div>
            <div className="py-2 flex items-start gap-2 text-sm">
              <span className="w-32 shrink-0 text-gray-500 dark:text-gray-400">Company</span>
              <span className="font-semibold text-gray-900 dark:text-white">{companyName}</span>
            </div>
            <div className="py-2 flex items-start gap-2 text-sm">
              <span className="w-32 shrink-0 text-gray-500 dark:text-gray-400">Posted By</span>
              <span className="font-semibold text-gray-900 dark:text-white">{postedBy}</span>
            </div>
            <div className="py-2 flex items-start gap-2 text-sm">
              <span className="w-32 shrink-0 text-gray-500 dark:text-gray-400">Location</span>
              <span className="font-semibold text-gray-900 dark:text-white">{locationText}</span>
            </div>
            <div className="py-2 flex items-start gap-2 text-sm">
              <span className="w-32 shrink-0 text-gray-500 dark:text-gray-400">Timeline</span>
              <span className="font-semibold text-gray-900 dark:text-white">{timeline}</span>
            </div>
            <div className="py-2 flex items-start gap-2 text-sm">
              <span className="w-32 shrink-0 text-gray-500 dark:text-gray-400">Workers Needed</span>
              <span className="font-semibold text-gray-900 dark:text-white">{workersNeeded}</span>
            </div>
            <div className="py-2 flex items-start gap-2 text-sm">
              <span className="w-32 shrink-0 text-gray-500 dark:text-gray-400">Can Apply</span>
              <span className="font-semibold text-gray-900 dark:text-white capitalize">{target}</span>
            </div>
            <div className="py-2 flex items-start gap-2 text-sm">
              <span className="w-32 shrink-0 text-gray-500 dark:text-gray-400">Budget</span>
              <span className="font-semibold text-gray-900 dark:text-white">{budget}</span>
            </div>
          </div>

          <div className="rounded-lg border border-gray-100 dark:border-gray-700 px-3 py-2.5">
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-0.5">Work Details</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{workDetails}</p>
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {skills.slice(0, 8).map((skill: string, idx: number) => (
                <span
                  key={`${skill}-${idx}`}
                  className="px-2 py-0.5 text-[11px] rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 sm:px-5 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 grid grid-cols-2 gap-2">
          <button
            onClick={() => onConnect?.(jobId)}
            className="w-full px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
          >
            Get Connect
          </button>
          <button
            onClick={onClose}
            className="w-full px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
