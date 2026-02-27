"use client";

import React from "react";

type FilterType = "active" | "pending" | "miscalls" | "connected";

interface FilterMenuProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  userType: "labour" | "contractor";
}

export default function FilterMenu({ activeFilter, onFilterChange, userType }: FilterMenuProps) {
  const otherType = userType === "labour" ? "Contractors" : "Labourers";

  const filters: { type: FilterType; label: string }[] = [
    { type: "active", label: `Active ${otherType}` },
    { type: "pending", label: "Pending Requests" },
    { type: "connected", label: "Connected" },
    { type: "miscalls", label: "Miscalls" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-3 sm:p-4 mb-6 sm:mb-8 sticky top-20 sm:top-24 z-40">
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 font-semibold uppercase tracking-wide">
        Filter
      </p>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.type}
            onClick={() => onFilterChange(filter.type)}
            className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
              activeFilter === filter.type
                ? userType === "labour"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
