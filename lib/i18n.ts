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

function isLeafValue(val: any): boolean {
  return typeof val === "string" || typeof val === "number" || typeof val === "boolean";
}

function extractLeafFromObject(val: any): string | undefined {
  if (!val || typeof val !== "object") return undefined;
  if (typeof val.title === "string") return val.title;
  if (typeof val.name === "string") return val.name;
  if (typeof val.label === "string") return val.label;
  if (typeof val.text === "string") return val.text;
  return undefined;
}

function resolveKeyValue(dict: any, key: string): any {
  if (!dict || typeof dict !== "object") return undefined;

  // 1. Direct key match (flat key e.g. "welcome_back" or "home.heroHeading")
  if (key in dict) {
    const val = dict[key];
    if (isLeafValue(val)) return val;
    const leaf = extractLeafFromObject(val);
    if (leaf !== undefined) return leaf;
    return undefined;
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
    if (isLeafValue(current)) return current;
    const leaf = extractLeafFromObject(current);
    if (leaf !== undefined) return leaf;
    return undefined;
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

  // 2. Fallback to English if not found or empty or not a leaf
  if ((rawValue === undefined || rawValue === null || typeof rawValue === "object") && locale !== "en") {
    rawValue = resolveKeyValue(enDict, key);
  }

  // 3. Fallback to provided default text or humanized key
  if (rawValue === undefined || rawValue === null || typeof rawValue === "object") {
    if (fallbackText !== undefined && fallbackText !== null && typeof fallbackText === "string") {
      rawValue = fallbackText;
    } else {
      rawValue = humanizeKey(key);
    }
  }

  // 4. Ensure string - NEVER stringify an object to "[object Object]"
  let result = "";
  if (typeof rawValue === "string") {
    result = rawValue;
  } else if (typeof rawValue === "number" || typeof rawValue === "boolean") {
    result = String(rawValue);
  } else if (typeof fallbackText === "string") {
    result = fallbackText;
  } else {
    result = humanizeKey(key);
  }

  // 5. Parameter interpolation: replace {param} or {{param}}
  if (params && typeof params === "object") {
    result = result.replace(/\{+(\w+)\}+/g, (match, paramName) => {
      if (paramName in params) {
        const val = params[paramName];
        if (val !== undefined && val !== null) {
          if (typeof val === "object") {
            // NEVER let an object param produce "[object Object]"
            return val.title || val.name || val.label || val.id || "";
          }
          return String(val);
        }
        return "";
      }
      return match;
    });
  }

  return result;
}
