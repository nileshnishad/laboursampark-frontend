// app/context/LanguageContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { t as translate, type Locale, defaultLocale, locales } from "@/lib/i18n";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isLoading: boolean;
  t: (key: string, paramsOrDefault?: Record<string, any> | string, defaultText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language preference from localStorage
  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem("language") as Locale | null;
      if (savedLocale && locales.includes(savedLocale)) {
        setLocaleState(savedLocale);
      }
    } catch {
      // localStorage may fail in restricted/private browsing modes
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    if (!locales.includes(newLocale)) return;
    setLocaleState(newLocale);
    try {
      localStorage.setItem("language", newLocale);
      document.documentElement.lang = newLocale;
    } catch {
      // ignore storage failure
    }
  }, []);

  const t = useCallback(
    (key: string, paramsOrDefault?: Record<string, any> | string, defaultText?: string) => {
      return translate(locale, key, paramsOrDefault, defaultText);
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, isLoading, t }}>
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

export function useTranslation() {
  return useLanguage();
}
