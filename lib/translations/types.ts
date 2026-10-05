// lib/translations/types.ts

export const locales = ["en", "hi", "mr"] as const;
export type Locale = (typeof locales)[number];

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isComingSoon?: boolean;
}

export const ALL_LANGUAGES: LanguageInfo[] = [
  // Active Supported Languages
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },

  // Coming Soon (Disabled)
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳", isComingSoon: true },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳", isComingSoon: true },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳", isComingSoon: true },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳", isComingSoon: true },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳", isComingSoon: true },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳", isComingSoon: true },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳", isComingSoon: true },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", flag: "🇮🇳", isComingSoon: true },
];

export const SUPPORTED_LOCALES: Locale[] = ["en", "hi", "mr"];

export type TranslationDictionary = Record<string, any>;

