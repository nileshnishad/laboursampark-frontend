"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4v2m0 4v2M7.08 6.06A9 9 0 1020.94 19.94M7.08 6.06l11.86 11.88"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Oops! Something went wrong
        </h1>

        <p className="text-slate-600 dark:text-slate-300 mb-2">
          We apologize for the inconvenience. An unexpected error occurred.
        </p>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-left">
            <p className="text-sm font-mono text-red-700 dark:text-red-400 break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            Try Again
          </button>

          <a
            href="/"
            className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
          >
            Go Home
          </a>
        </div>

        <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
          Error ID: {error.digest || "unknown"}
        </p>
      </div>
    </div>
  );
}
