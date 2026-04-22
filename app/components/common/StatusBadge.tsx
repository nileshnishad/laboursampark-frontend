"use client";

import React from "react";

interface StatusBadgeConfig {
  bg: string;
  text: string;
  border: string;
  icon: React.ReactNode;
  label: string;
}

interface StatusBadgeProps {
  config: StatusBadgeConfig;
  withBackdrop?: boolean;
}

export default function StatusBadge({ config, withBackdrop = false }: StatusBadgeProps) {
  return (
    <span
      className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${config.bg} ${config.text} border ${config.border}${withBackdrop ? " backdrop-blur-sm" : ""}`}
    >
      {config.icon} {config.label}
    </span>
  );
}

export type { StatusBadgeConfig };
