"use client";

import React from "react";
import { MapPin, Users, MessageSquare, ImageIcon } from "lucide-react";
import StatusBadge, { type StatusBadgeConfig } from "./StatusBadge";
import SkillPills from "./SkillPills";
import PosterInfo from "./PosterInfo";
import JobTimeline from "./JobTimeline";
import FeedbackCard from "./FeedbackCard";

export function formatJobDate(d: string | null | undefined): string | null {
  return d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null;
}

export function extractJobCardData(item: any) {
  const jobData = item?.job || item?.jobDetails || item;
  const title = jobData?.workTitle || jobData?.jobTitle || "Untitled Job";
  const loc = jobData?.location;
  const locText = typeof loc === "string" ? loc : [loc?.area, loc?.city].filter(Boolean).join(", ") || "Not specified";
  const skills: string[] = Array.isArray(jobData?.requiredSkills) ? jobData.requiredSkills : Array.isArray(jobData?.skills) ? jobData.skills : [];
  const images: string[] = Array.isArray(jobData?.images) ? jobData.images : [];
  const poster = item?.postedBy || jobData?.createdBy;
  const posterName = poster?.fullName || poster?.name || "Contractor";
  const posterPhoto = poster?.profilePhoto || poster?.profileImage || null;
  const posterType = poster?.userType || "contractor";
  const posterMobile = poster?.mobile || poster?.phone || null;
  const appliedDate = formatJobDate(item?.appliedAt);
  const acceptedDate = formatJobDate(item?.acceptedAt);
  const completedDate = formatJobDate(item?.completedAt);
  const cardKey = item.enquiryId || item._id || item.id || jobData?.jobId || jobData?.id || jobData?._id;

  return {
    jobData, title, locText, skills, images, poster,
    posterName, posterPhoto, posterType, posterMobile,
    appliedDate, acceptedDate, completedDate, cardKey,
  };
}

interface JobStatusCardProps {
  item: any;
  statusConfig: StatusBadgeConfig;
  children?: React.ReactNode;
}

export default function JobStatusCard({ item, statusConfig, children }: JobStatusCardProps) {
  const {
    jobData, title, locText, skills, images,
    posterName, posterPhoto, posterType, posterMobile,
    appliedDate, acceptedDate, completedDate, cardKey,
  } = extractJobCardData(item);

  return (
    <div
      key={cardKey}
      className="group rounded-xl border-2 border-indigo-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Image Banner or Plain Header */}
      {images.length > 0 ? (
        <div className="relative h-32 sm:h-32 overflow-hidden">
          <img src={images[0]} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2 flex-1 mr-2">{title}</h3>
            <StatusBadge config={statusConfig} withBackdrop />
          </div>
          {images.length > 1 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/40 backdrop-blur-sm">
              <ImageIcon size={10} className="text-white/80" />
              <span className="text-xs font-bold text-white/90">{images.length}</span>
            </div>
          )}
          
        </div>
      ) : (
        <div className="px-3 pt-3 pb-2 flex items-start justify-between gap-2">
          <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white leading-snug line-clamp-2 flex-1">{title}</h3>
          <StatusBadge config={statusConfig} />
        </div>
      )}
      

      {/* Body */}
      <div className="px-3 py-2.5 space-y-2">
        {/* Meta Row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="flex items-center gap-1 text-xs sm:text-sm text-zinc-500">
            <MapPin size={11} className="text-indigo-400 shrink-0" />
            <span className="truncate max-w-[120px]">{locText}</span>
          </span>
          <span className="flex items-center gap-1 text-xs sm:text-sm text-zinc-500">
            <Users size={11} className="text-blue-400 shrink-0" />
            {jobData?.workersNeeded || "—"} workers
          </span>
        </div>

        {/* Skills */}
        <SkillPills skills={skills} />

        {/* Message */}
        {item?.message && (
          <div className="flex items-start gap-1.5 px-2 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
            <MessageSquare size={11} className="text-zinc-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 italic line-clamp-2 leading-relaxed">&ldquo;{item.message}&rdquo;</p>
          </div>
        )}

        {/* Posted By */}
        <PosterInfo
          name={posterName}
          photo={posterPhoto}
          userType={posterType}
          mobile={posterMobile}
        />

        {/* Timeline */}
        <JobTimeline
          appliedDate={appliedDate}
          acceptedDate={acceptedDate}
          completedDate={completedDate}
        />

        {/* Review from contractor */}
        {item?.review && (
          <FeedbackCard
            label="Contractor Review"
            rating={item.review.rating}
            feedback={item.review.feedback}
            variant="indigo"
          />
        )}

        {/* My feedback */}
        {item?.myFeedback && (
          <FeedbackCard
            label="My Feedback"
            rating={item.myFeedback.rating}
            feedback={item.myFeedback.feedback}
            variant="amber"
          />
        )}

        {/* Extra content (e.g., Submit Feedback button) */}
        {children}
      </div>
    </div>
  );
}
