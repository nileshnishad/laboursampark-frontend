"use client";

import React from "react";

const ClearDataError: React.FC = () => {
  const handleClearAndRetry = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      // Attempt to clear cookies (best effort, only accessible cookies)
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    } catch (e) {}
    // Redirect to login or home page
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4">
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 max-w-md w-full flex flex-col items-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 text-center">Session Error</h2>
        <p className="text-zinc-600 dark:text-zinc-300 mb-6 text-center">
          We detected a problem with your session or device data. This can happen if your browser has outdated cookies or storage. Please clear your data and try again.
        </p>
        <button
          onClick={handleClearAndRetry}
          className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow transition-all active:scale-95"
        >
          Clear Data & Retry
        </button>
      </div>
    </div>
  );
};

export default ClearDataError;
