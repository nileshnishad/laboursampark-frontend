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
          className="px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[9px] font-semibold border border-indigo-100 dark:border-indigo-800/30"
        >
          {s}
        </span>
      ))}
      {skills.length > maxVisible && (
        <span className="px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[9px] font-semibold">
          +{skills.length - maxVisible}
        </span>
      )}
    </div>
  );
}
