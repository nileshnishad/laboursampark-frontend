"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";
import { fetchBusinesses, businessIdToLabel } from "@/store/slices/businessesSlice";

interface BusinessPickerProps {
  /** Currently selected business type IDs */
  selectedIds: string[];
  /** Called with new array of IDs when selection changes */
  onChange: (ids: string[]) => void;
  /** Optional CSS class for the outer wrapper div */
  className?: string;
  /** z-index class for the dropdown panel — override if stacking issues */
  dropdownZIndex?: string;
}

/**
 * Reusable bilingual business type picker for contractors / sub-contractors.
 * - Fetches business types from Redux (once per session).
 * - Manages its own open/close and search state.
 * - Shows selected business type chips below the trigger button.
 */
export default function BusinessPicker({
  selectedIds,
  onChange,
  className = "",
  dropdownZIndex = "z-50",
}: BusinessPickerProps) {
  const dispatch = useAppDispatch();
  const { businesses: allBusinesses, loading: businessesLoading } = useSelector(
    (state: RootState) => state.businesses
  );

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch once
  useEffect(() => {
    dispatch(fetchBusinesses());
  }, [dispatch]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    onChange(next);
  };

  const filtered = allBusinesses.filter(
    (b) =>
      !search ||
      b.enName.toLowerCase().includes(search.toLowerCase()) ||
      b.hiName.includes(search) ||
      b.category.toLowerCase().includes(search.toLowerCase())
  );

  // Group by category for display
  const categories = Array.from(new Set(filtered.map((b) => b.category)));

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => { setOpen((v) => !v); setSearch(""); }}
        className={`w-full px-3 py-2 text-sm rounded-lg border text-left flex justify-between items-center transition-colors ${
          open
            ? "border-blue-400 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-500"
            : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700"
        }`}
      >
        <span className={open ? "text-blue-700 dark:text-blue-300 font-semibold" : "text-gray-700 dark:text-gray-300"}>
          {businessesLoading
            ? "Loading business types..."
            : open
            ? "✕  Band karo (Close)"
            : selectedIds.length > 0
            ? `✓  ${selectedIds.length} type${selectedIds.length > 1 ? "s" : ""} selected — tap to change`
            : "🏗️  Business type chuniye (Select types)"}
        </span>
        <svg
          className={`w-4 h-4 flex-shrink-0 transition-transform ${open ? "rotate-180 text-blue-600" : "text-gray-400"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className={`absolute ${dropdownZIndex} w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl`}
        >
          {/* Search */}
          <div className="p-2 border-b border-gray-100 dark:border-gray-700">
            <input
              autoFocus
              type="text"
              placeholder="Search business types..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full px-3 py-1.5 text-sm rounded border border-gray-200 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Options */}
          <div className="max-h-60 overflow-y-auto py-1">
            {businessesLoading ? (
              <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin inline-block" />
                Loading business types...
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-4">No types found</p>
            ) : (
              categories.map((category) => (
                <div key={category}>
                  <p className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/30">
                    {category}
                  </p>
                  {filtered
                    .filter((b) => b.category === category)
                    .map((biz) => (
                      <label
                        key={biz.id}
                        className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors ${
                          selectedIds.includes(biz.id) ? "bg-blue-50 dark:bg-blue-900/30" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(biz.id)}
                          onChange={() => toggle(biz.id)}
                          className="w-4 h-4 rounded accent-blue-600 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                            {biz.enName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {biz.hiName}
                          </p>
                        </div>
                      </label>
                    ))}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-700 flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setOpen(false); setSearch(""); }}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              ✓ Ho gaya (Done)
            </button>
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="px-3 py-2 text-xs text-red-500 hover:text-red-700 font-medium border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      )}

      {/* Selected chips */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selectedIds.map((id) => (
            <span
              key={id}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-100 dark:border-blue-800/40"
            >
              {businessIdToLabel(id, allBusinesses)}
              <button
                type="button"
                onClick={() => toggle(id)}
                className="ml-0.5 text-blue-400 hover:text-blue-700 leading-none"
                aria-label={`Remove ${businessIdToLabel(id, allBusinesses)}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
