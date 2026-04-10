"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { t } from "@/lib/i18n";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { buildUserDashboardPath } from "@/lib/user-route";

export default function HeroSection() {
  const { locale } = useLanguage();
  const [searchType, setSearchType] = useState<"labour" | "contractor">("labour");
  const [query, setQuery] = useState("");
  const [useFixedBackground, setUseFixedBackground] = useState(true);
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    // Mobile/touch browsers can have tap issues with background-attachment: fixed.
    const media = window.matchMedia("(hover: none), (pointer: coarse)");
    setUseFixedBackground(!media.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setUseFixedBackground(!event.matches);
    };

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    }

    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  const handleSearch = () => {
    // Redirect to the appropriate page based on search type
    if (searchType === "labour") {
      router.push(`/labours${query ? `?search=${encodeURIComponent(query)}` : ""}`);
    } else {
      router.push(`/contractors${query ? `?search=${encodeURIComponent(query)}` : ""}`);
    }
  };

  const handleRegisterClick = (type: "labour" | "contractor") => {
    if (user) {
      router.push(buildUserDashboardPath(user, type));
      return;
    }

    router.push(`/register?type=${type}`);
  };

  return (
    <section 
      id="hero" 
      className="flex flex-col items-center justify-center min-h-[90vh] w-full  pt-16 md:pt-14 relative overflow-hidden"
      style={{
        backgroundImage: 'url(/images/heroimg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: useFixedBackground ? "fixed" : "scroll"
      }}
    >
      {/* Background overlay with dynamic gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-indigo-950/85 to-black/90 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-20"></div>
      </div>
      
      {/* Content wrapper */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center max-w-7xl mx-auto px-2">
        {/* Header Section */}
        <div className="w-full text-center mb-2 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-300 text-sm font-semibold mb-6 animate-fade-in">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            India's #1 Labour Platform
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-center tracking-tight text-white mb-6 leading-tight">
            {t(locale, "home.heroHeading").split(" ").map((word, i) => (
              <span key={i} className={i > 2 ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400" : ""}>
                {word}{" "}
              </span>
            ))}
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-300 text-center max-w-3xl mx-auto mb-10 font-medium leading-relaxed">
            {t(locale, "home.heroDesc")}
          </p>

          {/* Search Section */}
          <div className="max-w-4xl mx-auto w-full bg-white/10 backdrop-blur-xl rounded-[2rem] p-1 border border-white/20 shadow-2xl">
            <div className="bg-white dark:bg-zinc-900 rounded-[1.5rem] p-2 md:p-4 flex flex-col md:flex-row gap-3">
              <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-2xl p-1.5 flex-1 min-w-[280px]">
                <button
                  className={`flex-1 px-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                    searchType === "labour"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-500 hover:text-blue-600"
                  }`}
                  onClick={() => setSearchType("labour")}
                >
                  {t(locale, "labour.findWork")}
                </button>
                <button
                  className={`flex-1 px-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                    searchType === "contractor"
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-500 hover:text-blue-600"
                  }`}
                  onClick={() => setSearchType("contractor")}
                >
                  {t(locale, "contractor.findLabour")}
                </button>
              </div>
              
              <div className="flex-[2] relative">
                <input
                  type="text"
                  placeholder={searchType === "labour" ? "Kaun sa kaam chahiye? (e.g. Mason, Plumber)" : "Kaisa contractor chahiye?"}
                  className="w-full h-full min-h-[56px] px-2 text-sm bg-transparent text-gray-900 dark:text-white font-medium focus:outline-none placeholder:text-gray-600"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-0 top-1/2 -translate-y-1/2 h-[42px] px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md active:scale-95"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6 text-white/60 font-medium">
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span> 
              Aadhaar Verified Workers
            </span>
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> 
              Trusted Contractors
            </span>
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span> 
              100% Direct Connection
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
