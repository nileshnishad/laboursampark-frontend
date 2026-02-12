"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const [searchType, setSearchType] = useState<"labour" | "contractor">("labour");
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    // Redirect to the appropriate page based on search type
    if (searchType === "labour") {
      router.push(`/labours/all${query ? `?search=${encodeURIComponent(query)}` : ""}`);
    } else {
      router.push(`/contractors/all${query ? `?search=${encodeURIComponent(query)}` : ""}`);
    }
  };

  return (
    <section id="hero" className="flex flex-col items-center justify-center min-h-[70vh] bg-linear-to-br from-blue-100 to-blue-300 dark:from-blue-900 dark:to-blue-700 w-full pt-24 pb-12">
      <h1 className="text-2xl md:text-5xl font-extrabold text-blue-900 dark:text-white mb-4 text-center">
        Connect Labours & Contractors
      </h1>
      <p className="text-mf md:text-xl text-blue-800 dark:text-blue-200 mb-8 text-center max-w-2xl">
        Find skilled labours or trusted contractors easily. Create your profile and get connected instantly.
      </p>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 m-1 flex flex-col md:flex-row items-center gap-4 w-full max-w-2xl">
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <button
            className={`px-4 py-2 rounded-l-lg font-semibold border border-blue-500 focus:outline-none transition-all ${searchType === "labour" ? "bg-blue-500 text-white" : "bg-white text-blue-500 dark:bg-gray-900 dark:text-blue-300"}`}
            onClick={() => setSearchType("labour")}
          >
            Labour
          </button>
          <button
            className={`px-4 py-2 rounded-r-lg font-semibold border border-blue-500 focus:outline-none transition-all ${searchType === "contractor" ? "bg-blue-500 text-white" : "bg-white text-blue-500 dark:bg-gray-900 dark:text-blue-300"}`}
            onClick={() => setSearchType("contractor")}
          >
            Contractor
          </button>
        </div>
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none dark:bg-gray-900 dark:text-white"
          placeholder={`Search for ${searchType}...`}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
        />
        <button 
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition transform hover:scale-105 active:scale-95"
        >
          Search
        </button>
      </div>
    </section>
  );
}
