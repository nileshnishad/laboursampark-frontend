// app/components/LanguageSelector.tsx
"use client";

import React from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import type { Locale } from "@/lib/i18n";

interface LanguageSelectorProps {
  compact?: boolean;
}

export default function LanguageSelector({ compact = false }: LanguageSelectorProps) {
  const { locale, setLocale } = useLanguage();

  const languages: { code: Locale; name: string; shortName: string; flag: string }[] = [
    { code: "en", name: "En", shortName: "En", flag: "🇬🇧" },
    { code: "hi", name: "हिन्दी", shortName: "Hi", flag: "🇮🇳" },
    { code: "mr", name: "मराठी", shortName: "Mr", flag: "🇮🇳" },
  ];

  if (compact) {
    // Compact version for header
    return (
      <div className="flex items-center gap-1">
        {languages.map(({ code, name, shortName, flag }) => (
          <button
            key={code}
            onClick={() => setLocale(code)}
            className={`sm:px-2 sm:py-1.5 p-1 rounded text-xs font-medium transition-all whitespace-nowrap ${
              locale === code
                ? "bg-linear-to-br from-green-400 to-green-600 text-white shadow-md"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            title={name}
          >
            <span className="hidden sm:inline">{flag} {name}</span>
            <span className="sm:hidden">{flag} {shortName}</span>
          </button>
        ))}
      </div>
    );
  }

  // Full version (for floating selector on landing page)
  return (
    <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
        Language:
      </span>
      <div className="flex gap-1">
        {languages.map(({ code, name, flag }) => (
          <button
            key={code}
            onClick={() => setLocale(code)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
              locale === code
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            title={name}
          >
            <span className="mr-1">{flag}</span>
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
