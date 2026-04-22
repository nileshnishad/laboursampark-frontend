"use client";

import React from "react";

interface SkillPillsProps {
  skills: string[];
  maxVisible?: number;
}

export default function SkillPills({ skills, maxVisible = 4 }: SkillPillsProps) {
  if (skills.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {skills.slice(0, maxVisible).map((s, i) => (
        <span
          key={i}
<<<<<<< HEAD
          className="px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[9px] font-semibold border border-indigo-100 dark:border-indigo-800/30"
=======
          className="px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-100 dark:border-indigo-800/30"
>>>>>>> d6c7435ebd80a31c1d6b101adec6d17acdd13d62
        >
          {s}
        </span>
      ))}
      {skills.length > maxVisible && (
<<<<<<< HEAD
        <span className="px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[9px] font-semibold">
=======
        <span className="px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-xs font-semibold">
>>>>>>> d6c7435ebd80a31c1d6b101adec6d17acdd13d62
          +{skills.length - maxVisible}
        </span>
      )}
    </div>
  );
}
