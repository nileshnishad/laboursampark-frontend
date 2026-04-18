"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";
import { submitJobEnquiry, resetJobEnquiryState } from "@/store/slices/jobEnquirySlice";
import { showSuccessToast, showErrorToast } from "@/lib/toast-utils";
import { MapPin, Users, Calendar, CheckCircle, ImageIcon, Send, Eye, X, Briefcase } from "lucide-react";

interface CreateJobCardProps {
  job: any;
  onApply?: (jobId: string) => void;
  onView?: (jobId: string) => void;
  onSuccess?: () => void;
}

export default function CreateJobCard({ job, onApply, onView, onSuccess }: CreateJobCardProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading: enquiryLoading, success: enquirySuccess, error: enquiryError, appliedJobs } = useSelector(
    (state: RootState) => state.jobEnquiry
  );
  const dispatch = useAppDispatch();

  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (enquirySuccess && isEnquiryModalOpen) {
      showSuccessToast("Application sent successfully!");
      setIsEnquiryModalOpen(false);
      setEnquiryMessage("");
      dispatch(resetJobEnquiryState());
      onSuccess?.();
    }
  }, [enquirySuccess, isEnquiryModalOpen, dispatch, onSuccess]);

  useEffect(() => {
    if (enquiryError && isEnquiryModalOpen) {
      showErrorToast(enquiryError);
      dispatch(resetJobEnquiryState());
    }
  }, [enquiryError, isEnquiryModalOpen, dispatch]);

  useEffect(() => {
    if (isEnquiryModalOpen) {
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [isEnquiryModalOpen]);

  const workTitle = job?.workTitle || job?.jobTitle || "Construction Work Available";
  const workersNeeded = job?.workersNeeded || job?.teamSize || "—";
  const poster = job?.createdBy || job?.postedBy;
  const posterName = poster?.fullName || poster?.name || job?.fullName || job?.businessName || "Contractor";
  const posterPhoto = poster?.profilePhoto || poster?.profileImage || null;
  const posterType = poster?.userType || "contractor";
  const location = job?.location;
  const locText =
    typeof location === "string"
      ? location
      : [location?.area, location?.city].filter(Boolean).join(", ") || job?.city || "Not specified";
  const skills: string[] = Array.isArray(job?.requiredSkills)
    ? job.requiredSkills
    : Array.isArray(job?.skills)
      ? job.skills
      : [];
  const images: string[] = Array.isArray(job?.images) ? job.images : [];
  const description = job?.description || "";
  const postedAt = job?.createdAt || job?.postedAt;
  const postedDate = postedAt ? new Date(postedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
  const jobId = job?.jobId || job?.id || job?._id || "";
  const isProfileHidden = user?.display === false;
  const hasAlreadyApplied = jobId && appliedJobs.jobIds.includes(String(jobId));

  const handleApplyClick = () => {
    if (isProfileHidden || !jobId || hasAlreadyApplied) return;
    setEnquiryMessage("");
    dispatch(resetJobEnquiryState());
    setIsEnquiryModalOpen(true);
  };

  const handleSendEnquiry = () => {
    const trimmed = enquiryMessage.trim();
    if (!trimmed) return;
    dispatch(submitJobEnquiry({ jobId: String(jobId), message: trimmed }));
    onApply?.(String(jobId));
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
    <div className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      {/* Image Banner or Gradient Header */}
      {images.length > 0 ? (
        <div className="relative h-28 sm:h-32 overflow-hidden">
          <img src={images[0]} alt={workTitle} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <h3 className="absolute bottom-2.5 left-3 right-3 text-[13px] sm:text-sm font-bold text-white leading-snug line-clamp-2">
            {workTitle}
          </h3>
          {images.length > 1 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/40 backdrop-blur-sm">
              <ImageIcon size={10} className="text-white/80" />
              <span className="text-[9px] font-bold text-white/90">{images.length}</span>
            </div>
          )}
          {hasAlreadyApplied && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/90 backdrop-blur-sm">
              <CheckCircle size={10} className="text-white" />
              <span className="text-[9px] font-bold text-white">Applied</span>
            </div>
          )}
        </div>
      ) : (
        <div className="relative px-3 pt-3 pb-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[13px] sm:text-sm font-bold text-zinc-900 dark:text-white leading-snug line-clamp-2 flex-1">
              {workTitle}
            </h3>
            {hasAlreadyApplied && (
              <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-green-50 dark:bg-green-900/15 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800/30">
                <CheckCircle size={10} /> Applied
              </span>
            )}
          </div>
        </div>
      )}

      {/* Body */}
      <div className="px-3 py-2.5 space-y-2 flex-1 flex flex-col">
        {/* Meta Row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-zinc-500">
            <MapPin size={11} className="text-indigo-400 shrink-0" />
            <span className="truncate max-w-[120px]">{locText}</span>
          </span>
          <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-zinc-500">
            <Users size={11} className="text-blue-400 shrink-0" />
            {workersNeeded} workers
          </span>
          {postedDate && (
            <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-zinc-400">
              <Calendar size={10} className="shrink-0" />
              {postedDate}
            </span>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">{description}</p>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 4).map((s, i) => (
              <span key={i} className="px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[9px] font-semibold border border-indigo-100 dark:border-indigo-800/30">
                {s}
              </span>
            ))}
            {skills.length > 4 && <span className="px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[9px] font-semibold">+{skills.length - 4}</span>}
          </div>
        )}

        {/* Posted By */}
        <div className="flex items-center gap-2 pt-1 mt-auto">
          <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0">
            {posterPhoto ? (
              <img src={posterPhoto} className="w-full h-full object-cover" alt={posterName} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-zinc-400 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                {posterName[0]?.toUpperCase() || "C"}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 truncate">{posterName}</p>
            <p className="text-[9px] text-zinc-400 capitalize">{posterType === "sub_contractor" ? "Sub-Contractor" : posterType}</p>
          </div>
        </div>

        {isProfileHidden && (
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30">
            <span className="text-[9px] font-bold text-orange-600 dark:text-orange-400">Make profile visible to apply</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={handleApplyClick}
            disabled={isProfileHidden || !jobId || !!hasAlreadyApplied}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all active:scale-[0.97] ${
              hasAlreadyApplied
                ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/30 cursor-default"
                : "bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            {hasAlreadyApplied ? <><CheckCircle size={12} /> Applied</> : <><Send size={12} /> Apply</>}
          </button>
          <button
            onClick={handleViewClick}
            disabled={isProfileHidden || !jobId}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-[11px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]"
          >
            <Eye size={12} /> View
          </button>
        </div>
      </div>

      {/* Apply Modal */}
      {isEnquiryModalOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-0 sm:px-4 animate-in fade-in duration-200"
          onClick={(e) => { if (e.target === e.currentTarget) handleCloseEnquiry(); }}
        >
          <div className="w-full sm:max-w-md bg-white dark:bg-zinc-900 sm:rounded-2xl rounded-t-2xl shadow-2xl sm:border sm:border-zinc-200 dark:sm:border-zinc-800 overflow-hidden">
            {/* Header */}
            <div className="px-4 sm:px-5 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white flex items-center justify-between">
              <div className="min-w-0">
                <h3 className="text-sm font-bold">Apply for Job</h3>
                <p className="text-[11px] opacity-80 mt-0.5 truncate">{workTitle}</p>
              </div>
              <button onClick={handleCloseEnquiry} disabled={enquiryLoading} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-3">
              {/* Job Summary */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Briefcase size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                    <span className="flex items-center gap-1"><MapPin size={10} />{locText}</span>
                    <span className="flex items-center gap-1"><Users size={10} />{workersNeeded} workers</span>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Your Message *</label>
                <textarea
                  ref={textareaRef}
                  value={enquiryMessage}
                  onChange={(e) => setEnquiryMessage(e.target.value)}
                  disabled={enquiryLoading}
                  rows={3}
                  placeholder="Introduce yourself... (e.g., I have 5 years of experience in plastering)"
                  className="mt-1 w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none disabled:opacity-60"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleCloseEnquiry}
                  disabled={enquiryLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEnquiry}
                  disabled={enquiryLoading || !enquiryMessage.trim()}
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  {enquiryLoading ? (
                    <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
                  ) : (
                    <><Send size={12} /> Apply Now</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
