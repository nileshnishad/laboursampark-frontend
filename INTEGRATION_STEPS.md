// INTEGRATION_STEPS.md

# Step-by-Step Integration में LabourCard & ContractorCard को Update करना

## **Current Status:**
- ✅ `lib/i18n.ts` - Static strings translations ready
- ✅ `lib/api-translator.ts` - API field translations ready
- ✅ `app/context/LanguageContext.tsx` - Language state management ready
- ✅ `app/components/LanguageSelector.tsx` - Selector UI ready
- ⏳ अब actual components को update करना बाकी है

---

## **Step 1: Update Root Layout**

**File:** `app/layout.tsx`

```tsx
import { LanguageProvider } from "@/app/context/LanguageContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ... existing head ... */}
      </head>
      <body>
        <LanguageProvider>
          {/* Existing providers/components */}
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
```

---

## **Step 2: Update LabourCard Component**

**File:** `app/user/[username]/[userType]/components/LabourCard.tsx`

**Changes को करने के:**

```tsx
// Import add करो (top में)
import { useLanguage } from "@/app/context/LanguageContext";
import { t } from "@/lib/i18n";
import { translateUserData, translationGroups } from "@/lib/api-translator";

// Component में
export default function LabourCard({
  labour,
  onConnect,
}: LabourCardProps) {
  const { locale } = useLanguage();  // ← Add करो
  const [sending, setSending] = React.useState(false);

  // Translate API data
  const translatedLabour = translateUserData(
    labour,
    locale,
    translationGroups.labour
  );

  // अब use करो translatedLabour.status जहाँ पहले labour.status था
  // और static strings के लिए t() function use करो
}
```

**Specific Changes:**

```tsx
// BEFORE:
const experience = labour.experience || labour.experienceRange || "Not specified";

// AFTER:
const experience = translatedLabour.experienceRange || t(locale, "common.experience");

---

// BEFORE:
<button>Connect</button>

// AFTER:
<button>
  {isActuallyConnected 
    ? t(locale, "common.connected")
    : isActuallyPending
      ? t(locale, "common.pending")
      : "Connect"
  }
</button>

---

// BEFORE:
<span className="text-blue-500 text-xs">✔️</span>

// AFTER:
<span title={t(locale, "common.verified")} className="text-blue-500 text-xs">
  ✔️
</span>
```

---

## **Step 3: Update ContractorCard Component**

**File:** `app/user/[username]/[userType]/components/ContractorCard.tsx`

Same pattern as LabourCard - just use `translationGroups.contractor` instead:

```tsx
const translatedContractor = translateUserData(
  contractor,
  locale,
  translationGroups.contractor  // ← यह अलग है
);
```

---

## **Step 4: Add LanguageSelector to Header (Optional)**

**File:** `app/user/[username]/[userType]/page.tsx`

```tsx
import LanguageSelector from "@/app/components/LanguageSelector";

export default function UserDashboardPage() {
  // ... existing code ...

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Left side existing content */}
            <div>
              <h1>Dashboard</h1>
            </div>
            
            {/* Right side: Add Language Selector */}
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Rest of the page ... */}
    </div>
  );
}
```

---

## **Step 5: Test करना**

```tsx
// Simple test component
"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { t } from "@/lib/i18n";
import { translateField } from "@/lib/api-translator";

export default function TestPage() {
  const { locale } = useLanguage();

  return (
    <div className="p-4">
      <h1>Current Language: {locale}</h1>
      
      <p>Static: {t(locale, "common.name")}</p>
      
      <p>Dynamic: {translateField("status", "active", locale)}</p>
      
      <p>Field Group: {translateField("experienceRange", "1-3 years", locale)}</p>
    </div>
  );
}
```

---

## **Translations जो अभी Available हैं:**

### Static Strings (via `t()` function):
- `common.name`, `common.email`, `common.phone`, `common.location`
- `common.skills`, `common.experience`, `common.rating`, `common.jobs`
- `common.bio`, `common.connected`, `common.pending`
- `common.available`, `common.unavailable`, `common.settings`, `common.language`
- `labour.title`, `labour.joinAs`, `labour.myProfile`, `labour.findWork`
- `contractor.title`, `contractor.joinAs`, `contractor.myProfile`, `contractor.findLabour`

### API Field Values (via `translateField()`):
- **status**: active, inactive, blocked, pending, connected, miscalls, available, unavailable
- **experienceRange**: 0-1 years, 1-3 years, 3-5 years, 5-10 years, 10+ years
- **workType**: fulltime, parttime, contract, freelance, temporary, permanent
- **businessType**: construction, plumbing, electrical, carpentry, painting, cleaning, landscaping
- **coverageArea**: local-only, within-city, state-wide, all-india

---

## **Adding More Translations:**

### 1. New Static String:
```tsx
// lib/i18n.ts
export const translations = {
  en: {
    myFeature: {
      label: "My Label",
      description: "My Description"
    }
  },
  hi: {
    myFeature: {
      label: "मेरा लेबल",
      description: "मेरा विवरण"
    }
  },
  mr: {
    myFeature: {
      label: "माझे लेबल",
      description: "माझे वर्णन"
    }
  }
}

// Use करो:
t(locale, "myFeature.label")
```

### 2. New API Field Values:
```tsx
// lib/api-translator.ts
const fieldTranslations = {
  myStatus: {
    en: { pending: "Pending", approved: "Approved" },
    hi: { pending: "लंबित", approved: "मंजूर" },
    mr: { pending: "प्रलंबित", approved: "मंजूर" }
  }
}

// Use करो:
translateField("myStatus", "pending", locale)
```

---

## **Advanced: Language Preference in User Profile**

### Database में नया field add करो:
```json
{
  "_id": "user123",
  "profile": {
    "language": "hi"
  }
}
```

### लोग करने में preference load करो:
```tsx
// LanguageContext.tsx में
useEffect(() => {
  // First: localStorage से पढ़ो
  const savedLocale = localStorage.getItem("language") as Locale | null;
  
  // Second: अगर user logged in है तो profile से पढ़ो
  if (user?.profile?.language) {
    setLocaleState(user.profile.language);
  } else if (savedLocale) {
    setLocaleState(savedLocale);
  }
  
  setIsLoading(false);
}, [user]);
```

---

## **Performance Tips:**

1. **Translation को Memoize करो** - अगर same data बार-बार translate हो रहा है:
```tsx
import { useMemo } from "react";

const translatedLabour = useMemo(
  () => translateUserData(labour, locale, translationGroups.labour),
  [labour, locale]
);
```

2. **Cache करो translations** - server-side या client cache में

3. **Lazy load करो** - अगर बहुत सारे locales हैं तो dynamic import करो

---

## **Checklist:**

- [ ] Root layout में LanguageProvider add किया
- [ ] LabourCard को update किया
- [ ] ContractorCard को update किया
- [ ] Header में LanguageSelector add किया
- [ ] Translations को test किया
- [ ] User profile में language field add किया
- [ ] localStorage में persistence add किया
