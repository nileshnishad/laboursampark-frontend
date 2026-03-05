// lib/api-translator.ts
import { Locale } from "./i18n";

/**
 * Translation mapping for API field values
 * Ye common fields hain jinhe aap API se translate karte ho
 */
const fieldTranslations: Record<string, Record<Locale, Record<string, string>>> = {
  // Status translations
  status: {
    en: {
      active: "Active",
      inactive: "Inactive",
      blocked: "Blocked",
      pending: "Pending",
      connected: "Connected",
      miscalls: "Miscalls",
      available: "Available",
      unavailable: "Unavailable",
    },
    hi: {
      active: "सक्रिय",
      inactive: "निष्क्रिय",
      blocked: "अवरुद्ध",
      pending: "लंबित",
      connected: "जुड़ा",
      miscalls: "गलत कॉल",
      available: "उपलब्ध",
      unavailable: "अनुपलब्ध",
    },
    mr: {
      active: "सक्रिय",
      inactive: "निष्क्रिय",
      blocked: "अवरुद्ध",
      pending: "प्रलंबित",
      connected: "जोडलेल",
      miscalls: "चुकीच्या कॉल",
      available: "उपलब्ध",
      unavailable: "अनुपलब्ध",
    },
  },

  // Experience Range translations
  experienceRange: {
    en: {
      "0-1 years": "0-1 Years",
      "1-3 years": "1-3 Years",
      "3-5 years": "3-5 Years",
      "5-10 years": "5-10 Years",
      "10+ years": "10+ Years",
    },
    hi: {
      "0-1 years": "0-1 साल",
      "1-3 years": "1-3 साल",
      "3-5 years": "3-5 साल",
      "5-10 years": "5-10 साल",
      "10+ years": "10+ साल",
    },
    mr: {
      "0-1 years": "0-1 वर्ष",
      "1-3 years": "1-3 वर्ष",
      "3-5 years": "3-5 वर्ष",
      "5-10 years": "5-10 वर्ष",
      "10+ years": "10+ वर्ष",
    },
  },

  // Work Type translations
  workType: {
    en: {
      fulltime: "Full Time",
      parttime: "Part Time",
      contract: "Contract",
      freelance: "Freelance",
      temporary: "Temporary",
      permanent: "Permanent",
    },
    hi: {
      fulltime: "पूर्णकालिक",
      parttime: "अंशकालिक",
      contract: "अनुबंध",
      freelance: "स्वतंत्र",
      temporary: "अस्थायी",
      permanent: "स्थायी",
    },
    mr: {
      fulltime: "पूर्णवेळ",
      parttime: "अर्धवेळ",
      contract: "अनुबंध",
      freelance: "फ्रीलान्स",
      temporary: "तात्पुरती",
      permanent: "स्थायी",
    },
  },

  // Business Type translations
  businessType: {
    en: {
      construction: "Construction",
      plumbing: "Plumbing",
      electrical: "Electrical",
      carpentry: "Carpentry",
      painting: "Painting",
      cleaning: "Cleaning",
      landscaping: "Landscaping",
    },
    hi: {
      construction: "निर्माण",
      plumbing: "नल का काम",
      electrical: "विद्युत",
      carpentry: "बढ़ईगीरी",
      painting: "पेंटिंग",
      cleaning: "सफाई",
      landscaping: "भूनिर्माण",
    },
    mr: {
      construction: "बांधकाम",
      plumbing: "नळांचे काम",
      electrical: "विद्युत",
      carpentry: "सुतारकाम",
      painting: "पेंटिंग",
      cleaning: "स्वच्छता",
      landscaping: "लँडस्केपिंग",
    },
  },

  // Coverage Area translations
  coverageArea: {
    en: {
      "local-only": "Local Only",
      "within-city": "Within City",
      "state-wide": "State Wide",
      "all-india": "All India",
    },
    hi: {
      "local-only": "केवल स्थानीय",
      "within-city": "शहर के भीतर",
      "state-wide": "राज्य भर में",
      "all-india": "पूरे भारत में",
    },
    mr: {
      "local-only": "फक्त स्थानिक",
      "within-city": "शहर मध्ये",
      "state-wide": "राज्य व्यापी",
      "all-india": "संपूर्ण भारत",
    },
  },
};

/**
 * Translate API field value to selected language
 * Usage: translateField("status", "active", "hi")
 */
export function translateField(
  fieldName: string,
  value: string,
  locale: Locale
): string {
  const fieldMap = fieldTranslations[fieldName];
  if (!fieldMap || !fieldMap[locale]) {
    return value; // Return original if translation not found
  }
  return fieldMap[locale][value] || value; // Fallback to original value
}

/**
 * Translate array of values (like skills, work types, etc.)
 */
export function translateArray(
  fieldName: string,
  values: string[],
  locale: Locale
): string[] {
  return values.map((val) => translateField(fieldName, val, locale));
}

/**
 * Translate entire user card/object with dynamic mapping
 * Usage: translateUserData(userObj, "hi", ["experience", "status", "workTypes"])
 */
export function translateUserData(
  data: Record<string, any>,
  locale: Locale,
  fieldsToTranslate: string[]
): Record<string, any> {
  const translated = { ...data };

  for (const field of fieldsToTranslate) {
    if (field in translated) {
      const value = translated[field];

      // Handle arrays (skills, workTypes, etc.)
      if (Array.isArray(value)) {
        translated[field] = translateArray(field, value, locale);
      }
      // Handle single strings (status, experience, etc.)
      else if (typeof value === "string") {
        translated[field] = translateField(field, value, locale);
      }
    }
  }

  return translated;
}

/**
 * Pre-defined field groups for common translations
 */
export const translationGroups = {
  labour: [
    "status",
    "experienceRange",
    "workType",
    "skills",
    "availability",
  ],
  contractor: [
    "status",
    "businessType",
    "workType",
    "coverageArea",
    "serviceCategories",
  ],
  common: ["status"],
};
