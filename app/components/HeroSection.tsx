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

  const handleRegisterClick = (type: "labour" | "contractor") => {
    router.push(`/register?type=${type}`);
  };

  return (
    <section 
      id="hero" 
      className="flex flex-col items-center justify-center min-h-screen w-full px-4 pt-20 relative overflow-hidden"
      style={{
        backgroundImage: 'url(/images/heroimg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay with 0.3 opacity */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 opacity-80 z-0"></div>
      
      {/* Content wrapper */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
      {/* Header Section */}
      <div className="w-full max-w-3xl mb-8 sm:mb-12 md:mb-16">
        <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-5xl font-extrabold text-center bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4 sm:mb-6">
          Connect Labours & Contractors
        </h1>
        <p className="text-base sm:text-md md:text-md text-gray-700 dark:text-gray-300 text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          Find skilled plumbers, construction workers, painters, electricians & more. Connect with experienced contractors for all your project needs.
        </p>

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2 sm:p-6 md:p-8 flex flex-col gap-4 w-full">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="flex items-center text-xs gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 w-full sm:w-auto">
              <button
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  searchType === "labour"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                onClick={() => setSearchType("labour")}
              >
                Find Labour
              </button>
              <button
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  searchType === "contractor"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                onClick={() => setSearchType("contractor")}
              >
                Find Contractor
              </button>
            </div>
            <input
              type="text"
              className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white text-sm sm:text-base transition-all"
              placeholder={`Search by skills, name, location...`}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="px-6 sm:px-8 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Create Profile Section */}
      <div className="w-full max-w-6xl mt-4 sm:mt-12 md:mt-10">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Don't Have an Account Yet?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Join thousands of professionals and get access to exclusive opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Labour Profile Card */}
          <button
            onClick={() => handleRegisterClick("labour")}
            className="group hover:shadow-2xl transition-all duration-300 cursor-pointer"
          >
            <div className="bg-linear-to-r from-blue-500 to-blue-600 p-6 sm:p-8 text-center rounded-2xl shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white bg-opacity-20 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl sm:text-4xl">👷</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Join as Labour
              </h3>
            </div>
          </button>

          {/* Contractor Profile Card */}
          <button
            onClick={() => handleRegisterClick("contractor")}
            className="group hover:shadow-2xl transition-all duration-300 cursor-pointer"
          >
            <div className="bg-linear-to-r from-indigo-500 to-indigo-600 p-6 sm:p-8 text-center rounded-2xl shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white bg-opacity-20 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl sm:text-4xl">🏢</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Join as Contractor
              </h3>
            </div>
          </button>
        </div>
      </div>
      </div>
    </section>
  );
}
