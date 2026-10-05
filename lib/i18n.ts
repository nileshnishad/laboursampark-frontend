// lib/i18n.ts
import { en } from "./translations/en";
import { hi } from "./translations/hi";
import { mr } from "./translations/mr";
import { ALL_LANGUAGES, locales, type Locale } from "./translations/types";

export { ALL_LANGUAGES, locales, type Locale };
export const defaultLocale: Locale = "en";

export const translations = {
  en,
  hi,
  mr,
};

function humanizeKey(key: string): string {
  const lastPart = key.split(".").pop() || key;
  const words = lastPart
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
  if (!words) return "";
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function resolveKeyValue(dict: any, key: string): any {
  if (!dict || typeof dict !== "object") return undefined;

  // 1. Direct key match (flat key e.g. "welcome_back" or "home.heroHeading")
  if (key in dict) {
    return dict[key];
  }

  // 2. Nested key path (e.g. "home.aboutSection.title")
  if (key.includes(".")) {
    const parts = key.split(".");
    let current = dict;
    for (const part of parts) {
      if (current && typeof current === "object" && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }
    return current;
  }

  return undefined;
}

export function t(
  locale: Locale,
  key: string,
  paramsOrDefault?: Record<string, any> | string,
  defaultText?: string
): string {
  const params: Record<string, any> | undefined =
    typeof paramsOrDefault === "object" && paramsOrDefault !== null
      ? paramsOrDefault
      : undefined;

  const fallbackText: string | undefined =
    typeof paramsOrDefault === "string" ? paramsOrDefault : defaultText;

  const currentDict = translations[locale] || translations.en;
  const enDict = translations.en;

  // 1. Try specified locale
  let rawValue = resolveKeyValue(currentDict, key);

  // 2. Fallback to English if not found or empty
  if (rawValue === undefined && locale !== "en") {
    rawValue = resolveKeyValue(enDict, key);
  }

  // 3. Fallback to provided default text
  if (rawValue === undefined) {
    if (fallbackText !== undefined && fallbackText !== null) {
      rawValue = fallbackText;
    } else {
      rawValue = humanizeKey(key);
    }
  }

  // Ensure string
  let result = typeof rawValue === "string" ? rawValue : String(rawValue ?? "");

  // 4. Parameter interpolation: replace {param} or {{param}}
  if (params && typeof params === "object") {
    result = result.replace(/\{+(\w+)\}+/g, (match, paramName) => {
      if (paramName in params) {
        const val = params[paramName];
        return val !== undefined && val !== null ? String(val) : "";
      }
      return match;
    });
  }

  return result;
}
