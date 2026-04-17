"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";
import { submitJobEnquiry, resetJobEnquiryState } from "@/store/slices/jobEnquirySlice";
import { showSuccessToast, showErrorToast } from "@/lib/toast-utils";

interface CreateJobCardProps {
  job: any;
  onApply?: (jobId: string) => void;
  onView?: (jobId: string) => void;
}

export default function CreateJobCard({ job, onApply, onView }: CreateJobCardProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading: enquiryLoading, success: enquirySuccess, error: enquiryError, appliedJobs } = useSelector(
    (state: RootState) => state.jobEnquiry
  );
  const dispatch = useAppDispatch();

  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle success/error after dispatch
  useEffect(() => {
    if (enquirySuccess && isEnquiryModalOpen) {
      showSuccessToast("Enquiry sent successfully!");
      setIsEnquiryModalOpen(false);
      setEnquiryMessage("");
      dispatch(resetJobEnquiryState());
    }
  }, [enquirySuccess, isEnquiryModalOpen, dispatch]);

  useEffect(() => {
    if (enquiryError && isEnquiryModalOpen) {
      showErrorToast(enquiryError);
      dispatch(resetJobEnquiryState());
    }
  }, [enquiryError, isEnquiryModalOpen, dispatch]);

  // Focus textarea when modal opens
  useEffect(() => {
    if (isEnquiryModalOpen) {
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [isEnquiryModalOpen]);

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
  
  // Check if user has already applied for this job from Redux state
  const hasAlreadyApplied = jobId && appliedJobs.jobIds.includes(jobId);

  const handleApplyClick  = () => {
    if (isProfileHidden || !jobId || hasAlreadyApplied) return;
    setEnquiryMessage("");
    dispatch(resetJobEnquiryState());
    setIsEnquiryModalOpen(true);
  };

  const handleSendEnquiry = () => {
    const trimmed = enquiryMessage.trim();
    if (!trimmed) return;
    dispatch(submitJobEnquiry({ jobId, message: trimmed }));
    onApply?.(jobId);
  };

  const handleCloseEnquiry = () => {
    if (enquiryLoading) return;
    setIsEnquiryModalOpen(false);
    setEnquiryMessage("");
    dispatch(resetJobEnquiryState());
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

      {hasAlreadyApplied && (
        <p className="mt-2 text-[11px] text-green-700 dark:text-green-300">
          ✓ You have already applied for this job
        </p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-1.5">
        <button
          onClick={handleApplyClick}
          disabled={isProfileHidden || !jobId || hasAlreadyApplied}
          className={`w-full px-3 py-2 rounded-md text-white text-sm font-semibold transition-colors ${
            hasAlreadyApplied
              ? "bg-green-600 hover:bg-green-700 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
          }`}
        >
          {hasAlreadyApplied ? "✓ Applied" : "Get Connect"}
        </button>
        <button
          onClick={handleViewClick}
          disabled={isProfileHidden || !jobId}
          className="w-full px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-60 disabled:cursor-not-allowed text-gray-900 dark:text-white text-sm font-semibold transition-colors"
        >
          View
        </button>
      </div>

      {/* Enquiry Modal */}
      {isEnquiryModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) handleCloseEnquiry(); }}
        >
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Send Enquiry</h3>
              <button
                onClick={handleCloseEnquiry}
                disabled={enquiryLoading}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Applying for: <span className="font-semibold text-gray-700 dark:text-gray-200">{workTitle}</span>
            </p>

            <textarea
              ref={textareaRef}
              value={enquiryMessage}
              onChange={(e) => setEnquiryMessage(e.target.value)}
              disabled={enquiryLoading}
              rows={4}
              placeholder="Write your message here... (e.g. I have 5 years of experience in plastering)"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-60"
            />

            <div className="mt-3 flex gap-2 justify-end">
              <button
                onClick={handleCloseEnquiry}
                disabled={enquiryLoading}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEnquiry}
                disabled={enquiryLoading || !enquiryMessage.trim()}
                className="px-5 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold transition-colors flex items-center gap-2"
              >
                {enquiryLoading && (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                )}
                {enquiryLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
