// lib/i18n.ts
export const defaultLocale = "en";
export const locales = ["en", "hi", "mr"] as const;
export type Locale = (typeof locales)[number];

export const translations = {
  en: {
    common: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      location: "Location",
      skills: "Skills",
      experience: "Experience",
      rating: "Rating",
      jobs: "Jobs",
      bio: "Bio",
      connected: "Connected",
      pending: "Pending",
      available: "Available",
      unavailable: "Unavailable",
      settings: "Settings",
      language: "Language",
    },
    labour: {
      title: "Labour",
      joinAs: "Join as Labour",
      myProfile: "My Profile",
      findWork: "Find Work",
    },
    contractor: {
      title: "Contractor",
      joinAs: "Join as Contractor",
      myProfile: "My Profile",
      findLabour: "Find Labour",
    },
    home: {
      title: "LabourSampark",
      subtitle: "Connecting Skilled Labourers with Trusted Contractors",
      heroHeading: "Find Skilled Workers or Grow Your Business",
      heroDesc: "Connect with verified labourers and contractors across India. Fast, reliable, and transparent hiring.",
      cta1: "Join as Labour",
      cta2: "Join as Contractor",
      exploreLabours: "Search",
      exploreContractors: "Search",
      aboutTitle: "About LabourSampark",
      aboutDesc: "We bridge the gap between skilled labourers and trusted contractors. Our platform ensures safe, transparent, and verified connections.",
      contactTitle: "Get in Touch",
      contactDesc: "Have questions? We're here to help!",
      footerText: "© 2024 LabourSampark. All rights reserved.",
    },
  },
  hi: {
    common: {
      name: "नाम",
      email: "ईमेल",
      phone: "फोन",
      location: "स्थान",
      skills: "कौशल",
      experience: "अनुभव",
      rating: "रेटिंग",
      jobs: "काम",
      bio: "परिचय",
      connected: "जुड़ा हुआ",
      pending: "लंबित",
      available: "उपलब्ध",
      unavailable: "अनुपलब्ध",
      settings: "सेटिंग्स",
      language: "भाषा",
    },
    labour: {
      title: "मजदूर",
      joinAs: "मजदूर के रूप में शामिल हों",
      myProfile: "मेरी प्रोफाइल",
      findWork: "काम खोजें",
    },
    contractor: {
      title: "ठेकेदार",
      joinAs: "ठेकेदार के रूप में शामिल हों",
      myProfile: "मेरी प्रोफाइल",
      findLabour: "मजदूर खोजें",
    },
    home: {
      title: "लेबरसमपार्क",
      subtitle: "कुशल मजदूरों को विश्वसनीय ठेकेदारों से जोड़ना",
      heroHeading: "कुशल कर्मचारी खोजें या अपना व्यवसाय बढ़ाएं",
      heroDesc: "पूरे भारत में सत्यापित मजदूरों और ठेकेदारों से जुड़ें। तेज़, विश्वसनीय और स्वच्छ भर्ती।",
      cta1: "मजदूर के रूप में शामिल हों",
      cta2: "ठेकेदार के रूप में शामिल हों",
      exploreLabours: "उपलब्ध मजदूरों को देखें",
      exploreContractors: "उपलब्ध ठेकेदारों को देखें",
      aboutTitle: "लेबरसमपार्क के बारे में",
      aboutDesc: "हम कुशल मजदूरों और विश्वसनीय ठेकेदारों के बीच की खाई को पाटते हैं। हमारा प्लेटफॉर्म सुरक्षित, पारदर्शी और सत्यापित कनेक्शन सुनिश्चित करता है।",
      contactTitle: "हमसे संपर्क करें",
      contactDesc: "कोई सवाल है? हम यहाँ मदद के लिए हैं!",
      footerText: "© 2024 लेबरसमपार्क। सर्वाधिकार सुरक्षित।",
    },
  },
  mr: {
    common: {
      name: "नाव",
      email: "ईमेल",
      phone: "फोन",
      location: "स्थान",
      skills: "कौशल्य",
      experience: "अनुभव",
      rating: "रेटिंग",
      jobs: "नोकरी",
      bio: "बायो",
      connected: "जोडलेले",
      pending: "प्रलंबित",
      available: "उपलब्ध",
      unavailable: "अनुपलब्ध",
      settings: "सेटिंग्स",
      language: "भाषा",
    },
    labour: {
      title: "मजूर",
      joinAs: "मजूर म्हणून सामील व्हा",
      myProfile: "माझी प्रोफाईल",
      findWork: "काम शोधा",
    },
    contractor: {
      title: "कंत्राटर",
      joinAs: "कंत्राटर म्हणून सामील व्हा",
      myProfile: "माझी प्रोफाईल",
      findLabour: "मजूर शोधा",
    },
    home: {
      title: "लेबरसमपार्क",
      subtitle: "कुशल मजूरांना विश्वासार्ह कंत्राटरांशी जोडणे",
      heroHeading: "कुशल कामगार शोधा किंवा आपला व्यवसाय वाढवा",
      heroDesc: "संपूर्ण भारतातील सत्यापित मजूर आणि कंत्राटरांशी कनेक्ट करा। वेगवान, विश्वासार्ह आणि पारदर्शक भर्ती।",
      cta1: "मजूर म्हणून सामील व्हा",
      cta2: "कंत्राटर म्हणून सामील व्हा",
      exploreLabours: "उपलब्ध मजूर पाहा",
      exploreContractors: "उपलब्ध कंत्राटर पाहा",
      aboutTitle: "लेबरसमपार्क बद्दल",
      aboutDesc: "आम्ही कुशल मजूर आणि विश्वासार्ह कंत्राटरांच्या दरम्यान होना कमी करतो। आमचा प्लेटफॉर्म सुरक्षित, पारदर्शक आणि सत्यापित कनेक्शन सुनिश्चित करतो।",
      contactTitle: "आमच्याशी संपर्क करा",
      contactDesc: "काही प्रश्न आहेत? आम्ही मदत करण्यासाठी येथे आहोत!",
      footerText: "© 2024 लेबरसमपार्क। सर्व अधिकार सुरक्षित।",
    },
  },
};

export function t(
  locale: Locale,
  key: string,
  defaultText?: string
): string {
  const keys = key.split(".");
  let value: any = translations[locale];

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      return defaultText || key;
    }
  }

  return typeof value === "string" ? value : key;
}
