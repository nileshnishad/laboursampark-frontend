"use client";

import React from "react";
import { StarRatingDisplay } from "./StarRating";

interface FeedbackCardProps {
  label: string;
  rating: number;
  feedback?: string | null;
  variant?: "indigo" | "amber";
}

export default function FeedbackCard({ label, rating, feedback, variant = "indigo" }: FeedbackCardProps) {
  const styles = variant === "amber"
    ? { bg: "bg-amber-50/60 dark:bg-amber-900/10", border: "border-amber-100 dark:border-amber-800/20", label: "text-amber-500 dark:text-amber-400" }
    : { bg: "bg-indigo-50/60 dark:bg-indigo-900/10", border: "border-indigo-100 dark:border-indigo-800/20", label: "text-indigo-500 dark:text-indigo-400" };

  return (
    <div className={`px-2 py-1.5 rounded-lg ${styles.bg} border ${styles.border}`}>
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className={`text-[9px] font-semibold uppercase tracking-wider ${styles.label}`}>{label}</span>
        <div className="ml-auto">
          <StarRatingDisplay rating={rating} size={10} />
        </div>
      </div>
      {feedback && (
        <p className="text-[10px] sm:text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-1">
          &ldquo;{feedback}&rdquo;
        </p>
      )}
    </div>
  );
}
