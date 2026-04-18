"use client";

import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { DashboardUserType } from "./dashboard-tabs-config";

export type JobCardKey =
  | "available"
  | "applied"
  | "pending"
  | "accepted"
  | "completed"
  | "rejected"
  | "posted"
  | "applications";

interface StatCard {
  cardKey: JobCardKey;
  label: string;
  count: number;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  accentClass: string;
  ringClass: string;
}

interface JobStatCardsProps {
  userType: DashboardUserType;
  /** For labour: total available jobs count from pagination */
  totalAvailableJobs?: number;
  /** For contractor: total posted jobs count */
  totalPostedJobs?: number;
  /** Accepted jobs count from dedicated API */
  totalAcceptedJobs?: number;
  /** Completed jobs count from dedicated API */
  totalCompletedJobs?: number;
  activeCardKey?: JobCardKey | null;
  onCardClick?: (key: JobCardKey) => void;
}

export default function JobStatCards({
  userType,
  totalAvailableJobs = 0,
  totalPostedJobs = 0,
  totalAcceptedJobs = 0,
  totalCompletedJobs = 0,
  activeCardKey = null,
  onCardClick,
}: JobStatCardsProps) {
  const { appliedJobs, jobEnquiries } = useSelector(
    (state: RootState) => state.jobEnquiry
  );

  let cards: StatCard[] = [];

  if (userType === "labour") {
    const all = appliedJobs.jobs;
    const applied = all.length;

    cards = [
       
      {
        cardKey: "available" as JobCardKey,
        label: "Jobs Available",
        count: totalAvailableJobs,
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a8 8 0 00-8 8v1H2v2h20v-2h-2v-1a8 8 0 00-8-8zm0 2c3.309 0 6 2.691 6 6v1H6v-1c0-3.309 2.691-6 6-6zM2 15v2a2 2 0 002 2h16a2 2 0 002-2v-2H2z" />
          </svg>
        ),
        colorClass: "text-blue-600 dark:text-blue-400",
        bgClass: "bg-blue-50 dark:bg-blue-900/30",
        borderClass: "border-blue-200 dark:border-blue-700",
        accentClass: "bg-blue-500",
        ringClass: "ring-2 ring-blue-500",
      },
      {
        cardKey: "applied" as JobCardKey,
        label: "Applied",
        count: applied,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        ),
        colorClass: "text-violet-600 dark:text-violet-400",
        bgClass: "bg-violet-50 dark:bg-violet-900/30",
        borderClass: "border-violet-200 dark:border-violet-700",
        accentClass: "bg-violet-500",
        ringClass: "ring-2 ring-violet-500",
      },
      {
        cardKey: "accepted" as JobCardKey,
        label: "Accepted",
        count: totalAcceptedJobs,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        colorClass: "text-green-600 dark:text-green-400",
        bgClass: "bg-green-50 dark:bg-green-900/30",
        borderClass: "border-green-200 dark:border-green-700",
        accentClass: "bg-green-500",
        ringClass: "ring-2 ring-green-500",
      },
      {
        cardKey: "completed" as JobCardKey,
        label: "Completed",
        count: totalCompletedJobs,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
        colorClass: "text-teal-600 dark:text-teal-400",
        bgClass: "bg-teal-50 dark:bg-teal-900/30",
        borderClass: "border-teal-200 dark:border-teal-700",
        accentClass: "bg-teal-500",
        ringClass: "ring-2 ring-teal-500",
      },
    ];
  } else if (userType === "sub_contractor") {
    const all = appliedJobs.jobs;
    const applied = all.length;

    cards = [
      {
        cardKey: "available" as JobCardKey,
        label: "Jobs Available",
        count: totalAvailableJobs,
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a8 8 0 00-8 8v1H2v2h20v-2h-2v-1a8 8 0 00-8-8zm0 2c3.309 0 6 2.691 6 6v1H6v-1c0-3.309 2.691-6 6-6zM2 15v2a2 2 0 002 2h16a2 2 0 002-2v-2H2z" />
          </svg>
        ),
        colorClass: "text-blue-600 dark:text-blue-400",
        bgClass: "bg-blue-50 dark:bg-blue-900/30",
        borderClass: "border-blue-200 dark:border-blue-700",
        accentClass: "bg-blue-500",
        ringClass: "ring-2 ring-blue-500",
      },
      {
        cardKey: "posted" as JobCardKey,
        label: "Jobs Posted",
        count: totalPostedJobs,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        ),
        colorClass: "text-emerald-600 dark:text-emerald-400",
        bgClass: "bg-emerald-50 dark:bg-emerald-900/30",
        borderClass: "border-emerald-200 dark:border-emerald-700",
        accentClass: "bg-emerald-500",
        ringClass: "ring-2 ring-emerald-500",
      },
      {
        cardKey: "applied" as JobCardKey,
        label: "Applied",
        count: applied,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        ),
        colorClass: "text-violet-600 dark:text-violet-400",
        bgClass: "bg-violet-50 dark:bg-violet-900/30",
        borderClass: "border-violet-200 dark:border-violet-700",
        accentClass: "bg-violet-500",
        ringClass: "ring-2 ring-violet-500",
      },
      {
        cardKey: "accepted" as JobCardKey,
        label: "Accepted",
        count: totalAcceptedJobs,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        colorClass: "text-green-600 dark:text-green-400",
        bgClass: "bg-green-50 dark:bg-green-900/30",
        borderClass: "border-green-200 dark:border-green-700",
        accentClass: "bg-green-500",
        ringClass: "ring-2 ring-green-500",
      },
      {
        cardKey: "completed" as JobCardKey,
        label: "Completed",
        count: totalCompletedJobs,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
        colorClass: "text-teal-600 dark:text-teal-400",
        bgClass: "bg-teal-50 dark:bg-teal-900/30",
        borderClass: "border-teal-200 dark:border-teal-700",
        accentClass: "bg-teal-500",
        ringClass: "ring-2 ring-teal-500",
      },
    ];
  } else {
    // contractor
    const allEnquiries: any[] = Object.values(jobEnquiries.enquiries).flat();
    const total = allEnquiries.length;
    const pending = allEnquiries.filter((e: any) => {
      const s = (e?.status || "pending").toLowerCase();
      return s === "pending";
    }).length;
    const accepted = allEnquiries.filter((e: any) =>
      (e?.status || "").toLowerCase() === "accepted"
    ).length;
    const completed = allEnquiries.filter((e: any) =>
      (e?.status || "").toLowerCase() === "completed"
    ).length;
    const rejected = allEnquiries.filter((e: any) =>
      (e?.status || "").toLowerCase() === "rejected"
    ).length;

    cards = [
      {
        cardKey: "posted" as JobCardKey,
        label: "Jobs Posted",
        count: totalPostedJobs,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        ),
        colorClass: "text-blue-600 dark:text-blue-400",
        bgClass: "bg-blue-50 dark:bg-blue-900/30",
        borderClass: "border-blue-200 dark:border-blue-700",
        accentClass: "bg-blue-500",
        ringClass: "ring-2 ring-blue-500",
      },
      {
        cardKey: "applications" as JobCardKey,
        label: "Applications",
        count: total,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
          </svg>
        ),
        colorClass: "text-violet-600 dark:text-violet-400",
        bgClass: "bg-violet-50 dark:bg-violet-900/30",
        borderClass: "border-violet-200 dark:border-violet-700",
        accentClass: "bg-violet-500",
        ringClass: "ring-2 ring-violet-500",
      },
      {
        cardKey: "pending" as JobCardKey,
        label: "Req. Received",
        count: pending,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        ),
        colorClass: "text-amber-600 dark:text-amber-400",
        bgClass: "bg-amber-50 dark:bg-amber-900/30",
        borderClass: "border-amber-200 dark:border-amber-700",
        accentClass: "bg-amber-500",
        ringClass: "ring-2 ring-amber-500",
      },
      {
        cardKey: "accepted" as JobCardKey,
        label: "Accepted",
        count: accepted,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        colorClass: "text-green-600 dark:text-green-400",
        bgClass: "bg-green-50 dark:bg-green-900/30",
        borderClass: "border-green-200 dark:border-green-700",
        accentClass: "bg-green-500",
        ringClass: "ring-2 ring-green-500",
      },
      {
        cardKey: "completed" as JobCardKey,
        label: "Completed",
        count: completed,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
        colorClass: "text-teal-600 dark:text-teal-400",
        bgClass: "bg-teal-50 dark:bg-teal-900/30",
        borderClass: "border-teal-200 dark:border-teal-700",
        accentClass: "bg-teal-500",
        ringClass: "ring-2 ring-teal-500",
      },
      {
        cardKey: "rejected" as JobCardKey,
        label: "Rejected",
        count: rejected,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        ),
        colorClass: "text-red-600 dark:text-red-400",
        bgClass: "bg-red-50 dark:bg-red-900/30",
        borderClass: "border-red-200 dark:border-red-700",
        accentClass: "bg-red-500",
        ringClass: "ring-2 ring-red-500",
      },
    ];
  }

  return (
    <div className="mb-6">
      {/* Section header — construction site style */}
      <div className="flex items-center gap-3 mb-3 px-0.5">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1 h-5 rounded-full bg-yellow-400" />
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a8 8 0 00-8 8v1H2v2h20v-2h-2v-1a8 8 0 00-8-8zm0 2c3.309 0 6 2.691 6 6v1H6v-1c0-3.309 2.691-6 6-6zM2 15v2a2 2 0 002 2h16a2 2 0 002-2v-2H2z" />
          </svg>
          <span className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">
            Job Overview
          </span>
        </div>
        <div
          className="flex-1 h-px opacity-50"
          style={{ background: "repeating-linear-gradient(90deg, #fbbf24 0px, #fbbf24 8px, transparent 8px, transparent 16px)" }}
        />
      </div>

      <div className={`grid gap-3 ${userType === "sub_contractor" ? "grid-cols-2 sm:grid-cols-4 lg:grid-cols-7" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"}`}>
        {cards.map((card) => {
          const isActive = activeCardKey === card.cardKey;
          return (
            <button
              key={card.cardKey}
              type="button"
              onClick={() => onCardClick?.(card.cardKey)}
              className={`relative text-left bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border transition-all duration-150
                ${isActive
                  ? `${card.ringClass} border-transparent scale-[1.03] shadow-md`
                  : "border-gray-100 dark:border-gray-700 hover:scale-[1.02] hover:shadow-md"
                }
              `}
            >
              {/* Colored top status bar */}
              <div className={`h-1 w-full ${card.accentClass}`} />

              <div className="p-3.5">
                {/* Icon + count */}
                <div className="flex items-start justify-between mb-2.5">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center border ${card.bgClass} ${card.borderClass} ${card.colorClass}`}
                  >
                    {card.icon}
                  </div>
                  <span className={`text-2xl font-black tabular-nums leading-none mt-1 ${card.colorClass}`}>
                    {card.count}
                  </span>
                </div>
                {/* Label with rivet/bolt diamond indicator */}
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rotate-45 rounded-sm shrink-0 ${card.accentClass}`} />
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 leading-tight truncate">
                    {card.label}
                  </p>
                </div>
              </div>

              {/* Caution-tape corner accent */}
              <div
                className="absolute bottom-0 right-0 w-8 h-8 opacity-[0.07]"
                style={{ background: "repeating-linear-gradient(45deg, #1f2937 0px, #1f2937 3px, #fbbf24 3px, #fbbf24 7px)" }}
              />

              {/* Active indicator arrow */}
              {isActive && (
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0
                  border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent ${card.accentClass.replace("bg-", "border-t-")}`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
