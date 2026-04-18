"use client";

import React from "react";
import { Calendar, CheckCircle } from "lucide-react";

interface JobTimelineProps {
  appliedDate?: string | null;
  acceptedDate?: string | null;
  completedDate?: string | null;
}

export default function JobTimeline({ appliedDate, acceptedDate, completedDate }: JobTimelineProps) {
  if (!appliedDate && !acceptedDate && !completedDate) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 pt-1 border-t border-zinc-100 dark:border-zinc-800">
      {appliedDate && (
        <span className="flex items-center gap-1 text-[9px] sm:text-[10px] text-zinc-400">
          <Calendar size={10} className="shrink-0" />
          Applied {appliedDate}
        </span>
      )}
      {acceptedDate && (
        <span className="flex items-center gap-1 text-[9px] sm:text-[10px] text-green-500">
          <CheckCircle size={10} className="shrink-0" />
          Accepted {acceptedDate}
        </span>
      )}
      {completedDate && (
        <span className="flex items-center gap-1 text-[9px] sm:text-[10px] text-teal-500">
          <CheckCircle size={10} className="shrink-0" />
          Completed {completedDate}
        </span>
      )}
    </div>
  );
}
