"use client";

import { useRouter } from "next/navigation";
import { Briefcase, Users } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { t } from "@/lib/i18n";

export default function QuickActions() {
  const router = useRouter();
  const { locale } = useLanguage();

  return (
    <section className="px-4 mt-12 bg-zinc-50 dark:bg-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        <button
          onClick={() => router.push("/jobs")}
          className="group relative overflow-hidden p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-green-500/20 text-left"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          
          <div className="relative flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">
                {t(locale, "home.quickActions.findJobTitle")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t(locale, "home.quickActions.findJobDesc")}
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => router.push("/labours")}
          className="group relative overflow-hidden p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-blue-500/20 text-left"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-500"></div>

          <div className="relative flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                {t(locale, "home.quickActions.hireLabourTitle")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t(locale, "home.quickActions.hireLabourDesc")}
              </p>
            </div>
          </div>
        </button>

      </div>
    </section>
  );
}