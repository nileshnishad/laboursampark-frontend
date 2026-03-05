// MULTI-LANGUAGE_SETUP.md

# Multi-Language (i18n) Implementation Guide

## **3 तरीके API Data को Translate करने के:**

### **Option 1: Backend से ही Translation (Best)**
```
Database:
{
  _id: "123",
  fullName: "John Doe",
  skills: {
    en: ["Plumbing", "Electrician"],
    hi: ["नल का काम", "विद्युत"],
    mr: ["नळांचे काम", "विद्युत"]
  },
  status: {
    en: "active",
    hi: "सक्रिय",
    mr: "सक्रिय"
  }
}
```
✅ Pros: सबसे टेक़दार, एक बार data store हो गया तो सब lang ready
❌ Cons: Backend में more work, database size बढ़ता है

---

### **Option 2: Frontend Translation (हम करेंगे) ✅ RECOMMENDED**
```
API Response (सिर्फ English/Original):
{
  _id: "123",
  fullName: "John Doe",
  skills: ["Plumbing", "Electrician"],
  status: "active"
}

Frontend पर Translate:
const translatedLabour = translateUserData(labour, "hi", ["skills", "status"])
// Result: { skills: ["नल का काम", "विद्युत"], status: "सक्रिय" }
```
✅ Pros: Simple setup, no backend changes, flexible
❌ Cons: हर बार API से data आए तो translate करना पड़े

---

### **Option 3: Translation API (Google Translate / Manual)**
```
// Real-time translation
const translated = await translateAPI(text, "en", "hi")

// या manual mapping use करो हमारे जैसे
translateField("status", "active", "hi") // → "सक्रिय"
```

---

## **Setup Steps:**

### **Step 1: Add LanguageProvider to Root Layout**
```tsx
// app/layout.tsx
import { LanguageProvider } from "@/app/context/LanguageContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <LanguageProvider>
          {children}
          <LanguageSelector /> {/* साथ में language selector */}
        </LanguageProvider>
      </body>
    </html>
  );
}
```

### **Step 2: Use Language in Any Component**
```tsx
"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { t } from "@/lib/i18n";
import { translateUserData } from "@/lib/api-translator";

export default function MyComponent() {
  const { locale } = useLanguage();

  // Static strings के लिए:
  const label = t(locale, "common.name") // → "नाम" (अगर Hindi selected है)

  // API data के लिए:
  const translatedUser = translateUserData(
    apiUser,
    locale,
    ["status", "experience"]
  );
}
```

### **Step 3: Add New Translations**

**Static Strings के लिए (app/lib/i18n.ts में):**
```tsx
export const translations = {
  en: {
    labels: {
      newField: "My Field",
    }
  },
  hi: {
    labels: {
      newField: "मेरा फील्ड",
    }
  }
}

// Use करो:
t(locale, "labels.newField")
```

**API Field Values के लिए (lib/api-translator.ts में):**
```tsx
const fieldTranslations = {
  myStatus: {
    en: {
      newValue: "New Value"
    },
    hi: {
      newValue: "नई वैल्यू"
    }
  }
}

// Use करो:
translateField("myStatus", "newValue", locale)
```

---

## **Quick Reference:**

```tsx
// 1. Static Strings
t(locale, "common.name")  // → "नाम"

// 2. Single Field Value
translateField("status", "active", locale)  // → "सक्रिय"

// 3. Array of Values
translateArray("skills", ["Plumbing", "Electrician"], locale)
// → ["नल का काम", "विद्युत"]

// 4. Entire Object
translateUserData(user, locale, ["status", "skills", "experience"])
// अपने आप सब translate हो जाएगा
```

---

## **File Structure:**

```
lib/
  ├── i18n.ts                    ← Static strings translations
  └── api-translator.ts          ← API field value translations

app/
  ├── context/
  │   └── LanguageContext.tsx     ← Language state management
  └── components/
      └── LanguageSelector.tsx    ← Language switcher UI

store/
  └── slices/
      └── userSlice.ts           ← Save language preference
```

---

## **Adding User Language Preference to Redux:**

```tsx
// store/slices/userSlice.ts (नया)
const userSlice = createSlice({
  name: 'user',
  initialState: {
    language: 'en'
  },
  reducers: {
    setUserLanguage: (state, action) => {
      state.language = action.payload
    }
  }
})

// LanguageContext में sync करो:
const saveUserLanguagePref = async (locale: Locale) => {
  await updateUserProfile({ language: locale })
  dispatch(setUserLanguage(locale))
}
```

---

## **Real World Example - ContractorCard:**

```tsx
"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { t } from "@/lib/i18n";
import { translateUserData } from "@/lib/api-translator";

export default function ContractorCard({ contractor }) {
  const { locale } = useLanguage();

  // API Data translate करो
  const translatedContractor = translateUserData(
    contractor,
    locale,
    ["status", "businessType", "coverageArea", "serviceCategories"]
  );

  return (
    <div>
      {/* Heading */}
      <h2>{translatedContractor.businessName}</h2>
      
      {/* Status - Translated */}
      <p>{translatedContractor.status}</p>
      
      {/* Business Types - Translated Array */}
      <div>
        {translatedContractor.serviceCategories?.map(cat => (
          <span key={cat}>{cat}</span>
        ))}
      </div>
      
      {/* Static Label */}
      <label>{t(locale, "common.rating")}: {translator.rating}</label>
      
      {/* Coverage - Translated Array */}
      <div>
        {translatedContractor.coverageArea?.map(area => (
          <span key={area}>{area}</span>
        ))}
      </div>
    </div>
  );
}
```

---

## **Important Notes:**

1. **Database में original values store करो** - translation frontend पर करो
2. **API response हमेशा English/English form में send करो** - translation करने के लिए data होना चाहिए
3. **User preference save करो localStorage/DB में** - ताकि refresh के बाद selected language persist हो
4. **Translations को organize रखो** - scalable रखने के लिए अलग files में

---

## **Advanced: RTL Support (अरबी, उर्दू के लिए)**

```tsx
// lib/i18n.ts में add करो
export const isRTL = (locale: Locale) => ["ar", "ur"].includes(locale)

// Component में:
<div dir={isRTL(locale) ? "rtl" : "ltr"}>
  <p>{content}</p>
</div>
```
