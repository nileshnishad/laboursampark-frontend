// app/context/LanguageContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Locale } from "@/lib/i18n";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language preference from localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem("language") as Locale | null;
    if (savedLocale) {
      setLocaleState(savedLocale);
    }
    setIsLoading(false);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("language", newLocale);
    // Optional: Save to user profile in backend
    // await updateUserLanguagePreference(newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (undefined === context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
