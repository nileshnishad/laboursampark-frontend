"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, loading = false, onPageChange }: PaginationProps) {
  return (
    <div className="mt-2 px-4 sm:px-6 flex items-center justify-between">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1 || loading}
        className="text-xs px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-50"
      >
        Previous
      </button>
      <p className="text-xs text-gray-600 dark:text-gray-300">Page {currentPage} of {totalPages}</p>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages || loading}
        className="text-xs px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
