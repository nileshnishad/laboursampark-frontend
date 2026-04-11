"use client";

import { ShieldCheck, Star, BadgeCheck, Users, CheckCircle2, Zap } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { t } from "@/lib/i18n";

export default function TrustSection() {
  const { locale } = useLanguage();

  return (
    <section className="relative px-4 py-20 bg-white dark:bg-black overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-400/10 blur-[100px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-4 border border-blue-100 dark:border-blue-800">
            <ShieldCheck className="w-4 h-4" />
            {t(locale, "home.trustSection.badge")}
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
            {t(locale, "home.trustSection.title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg md:text-xl font-medium">
            {t(locale, "home.trustSection.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Card 1: Aadhaar Verified */}
          <div className="relative group p-8 bg-zinc-50 dark:bg-zinc-900/40 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              {t(locale, "home.trustSection.card1Title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
              {t(locale, "home.trustSection.card1Desc")}
            </p>
            <div className="mt-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-bold">
              <Zap className="w-4 h-4 fill-current" />
              {t(locale, "home.trustSection.card1Footer")}
            </div>
          </div>

          {/* Card 2: No Middleman */}
          <div className="relative group p-8 bg-zinc-50 dark:bg-zinc-900/40 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              {t(locale, "home.trustSection.card2Title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
              {t(locale, "home.trustSection.card2Desc")}
            </p>
            <div className="mt-4 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
              <CheckCircle2 className="w-4 h-4" />
              {t(locale, "home.trustSection.card2Footer")}
            </div>
          </div>

          {/* Card 3: Ratings and Quality */}
          <div className="relative group p-8 bg-zinc-50 dark:bg-zinc-900/40 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-500/10 hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/20 group-hover:scale-110 transition-transform">
              <Star className="w-7 h-7 text-white fill-current" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              {t(locale, "home.trustSection.card3Title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
              {t(locale, "home.trustSection.card3Desc")}
            </p>
            <div className="mt-4 flex items-center gap-2 text-yellow-600 dark:text-yellow-500 text-sm font-bold">
              <BadgeCheck className="w-4 h-4" />
              {t(locale, "home.trustSection.card3Footer")}
            </div>
          </div>
        </div>

        {/* Dynamic Counter Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[3rem] p-10 md:p-14 text-white text-center shadow-2xl shadow-blue-900/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-3xl rounded-full -ml-32 -mb-32"></div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black">50K+</div>
              <div className="text-blue-100 text-sm md:text-base font-medium opacity-80">{t(locale, "home.trustSection.stat1Label")}</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black">1.2K+</div>
              <div className="text-blue-100 text-sm md:text-base font-medium opacity-80">{t(locale, "home.trustSection.stat2Label")}</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black">25+</div>
              <div className="text-blue-100 text-sm md:text-base font-medium opacity-80">{t(locale, "home.trustSection.stat3Label")}</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-black">100%</div>
              <div className="text-blue-100 text-sm md:text-base font-medium opacity-80">{t(locale, "home.trustSection.stat4Label")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}