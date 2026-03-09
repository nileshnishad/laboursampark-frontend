"use client";

import React, { useEffect, useRef, useState } from "react";

type FilterType = "active" | "pending" | "miscalls" | "connected" | "profile";

interface FilterMenuProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  userType: "labour" | "contractor" | "sub_contractor";
}

export default function FilterMenu({ activeFilter, onFilterChange, userType }: FilterMenuProps) {
  const otherType = userType === "labour" ? "Contractors" : "Labourers";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftIndicator, setShowLeftIndicator] = useState(false);
  const [showRightIndicator, setShowRightIndicator] = useState(false);

  const filters: { type: FilterType; label: string }[] = [
    { type: "active", label: `Active ${otherType}` },
    { type: "pending", label: "Pending Requests" },
    { type: "connected", label: "Connected" },
    { type: "miscalls", label: "Miscalls" },
    { type: "profile", label: "Profile" },
  ];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const updateIndicators = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeftIndicator(scrollLeft > 2);
      setShowRightIndicator(scrollLeft + clientWidth < scrollWidth - 2);
    };

    updateIndicators();
    container.addEventListener("scroll", updateIndicators, { passive: true });
    window.addEventListener("resize", updateIndicators);

    return () => {
      container.removeEventListener("scroll", updateIndicators);
      window.removeEventListener("resize", updateIndicators);
    };
  }, [filters.length]);

  return (
    <div className="relative max-w-7xl mx-auto">
      {showLeftIndicator && (
        <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 z-10 text-xs font-bold text-blue-600 dark:text-gray-300 bg-white dark:bg-gray-800/80 p-2 rounded">
          {'<<'}
        </div>
      )}

      {showRightIndicator && (
        <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 z-10 text-xs font-bold text-blue-600 dark:text-gray-300 bg-white dark:bg-gray-800/80 p-2 rounded">
          {'>>'}
        </div>
      )}

      <div
        ref={scrollRef}
        className="filter-scroll flex overflow-x-auto overflow-y-hidden items-start sm:items-center gap-2 sm:gap-3 sm:px-8"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
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

      <style jsx>{`
        .filter-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
