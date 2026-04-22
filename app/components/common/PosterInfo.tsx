"use client";

import React from "react";
import { Phone } from "lucide-react";

interface PosterInfoProps {
  name: string;
  photo: string | null;
  userType: string;
  mobile?: string | null;
}

export default function PosterInfo({ name, photo, userType, mobile }: PosterInfoProps) {
  const displayType = userType === "sub_contractor" ? "Sub-Contractor" : userType;
  return (
    <div className="flex items-center gap-2 pt-1">
      <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0">
        {photo ? (
          <img src={photo} className="w-full h-full object-cover" alt={name} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-black text-zinc-400 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
            {(name || "C")[0]?.toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 truncate">{name}</p>
        <p className="text-xs text-zinc-400 capitalize">{displayType}</p>
      </div>
      {mobile && (
        <a
          href={`tel:+91${mobile}`}
          className="p-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
        >
          <Phone size={14} />
        </a>
      )}
    </div>
  );
}
