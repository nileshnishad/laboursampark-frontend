// app/components/LanguageSelector.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { ALL_LANGUAGES, type Locale } from "@/lib/i18n";
import { Globe, ChevronDown, Check } from "lucide-react";

interface LanguageSelectorProps {
  compact?: boolean;
}

export default function LanguageSelector({ compact = false }: LanguageSelectorProps) {
  const { locale, setLocale, t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  const activeLanguages = ALL_LANGUAGES.filter((lang) => !lang.isComingSoon);
  const comingSoonLanguages = ALL_LANGUAGES.filter((lang) => lang.isComingSoon);

  const handleSelectActive = (code: string) => {
    setLocale(code as Locale);
    setDropdownOpen(false);
  };

  const comingSoonText = t("coming_soon", "Coming soon");

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      {compact ? (
        // Compact version for Header/Menu: show only the selected language
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          aria-expanded={dropdownOpen}
          aria-haspopup="listbox"
          aria-label={t("select_language", "Select language")}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all whitespace-nowrap cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="hidden sm:inline">
            {ALL_LANGUAGES.find((l) => l.code === locale)?.flag}
          </span>
          <span>{ALL_LANGUAGES.find((l) => l.code === locale)?.nativeName || "English"}</span>
          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>
      ) : (
        // Full standard button
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/60 shadow-sm transition-all"
        >
          <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>{ALL_LANGUAGES.find((l) => l.code === locale)?.nativeName || "English"}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>
      )}

      {/* Dropdown Menu showing all 11 languages (Active + Coming Soon) */}
      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 pb-2 mb-2 border-b border-gray-100 dark:border-gray-800">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {t("select_language", "Select language")}
            </p>
          </div>

          {/* Active Languages */}
          <div className="px-1.5 space-y-0.5">
            {activeLanguages.map((lang) => {
              const isSelected = locale === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectActive(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                    <span className="text-[11px] font-normal text-gray-500 dark:text-gray-400">
                      ({lang.name})
                    </span>
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                </button>
              );
            })}
          </div>

          {/* Divider & Coming Soon Section */}
          <div className="px-3 pt-3 pb-1.5 mt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {comingSoonText}
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full font-medium">
              8 Languages
            </span>
          </div>

          {/* Coming Soon Languages (Strictly Disabled) */}
          <div className="px-1.5 max-h-56 overflow-y-auto space-y-0.5">
            {comingSoonLanguages.map((lang) => (
              <div
                key={lang.code}
                aria-disabled="true"
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-gray-400 dark:text-gray-500 opacity-60 cursor-not-allowed select-none bg-gray-50/50 dark:bg-gray-800/30"
              >
                <span className="flex items-center gap-2">
                  <span className="text-base grayscale opacity-75">{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                  <span className="text-[11px]">({lang.name})</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-tight px-1.5 py-0.5 rounded bg-gray-200/70 dark:bg-gray-700/70 text-gray-500 dark:text-gray-400">
                  {comingSoonText}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
