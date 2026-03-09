"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { t } from "@/lib/i18n";

export default function AboutSection() {
  const router = useRouter();
  const { locale } = useLanguage();

  const reasons = [0, 1, 2, 3].map((idx) => ({
    title: t(locale, `home.aboutSection.reasons.${idx}.title`),
    desc: t(locale, `home.aboutSection.reasons.${idx}.desc`),
  }));

  const stats = [0, 1, 2, 3].map((idx) => ({
    number: t(locale, `home.aboutSection.stats.${idx}.number`),
    label: t(locale, `home.aboutSection.stats.${idx}.label`),
  }));

  const features = [0, 1, 2, 3, 4, 5].map((idx) => ({
    icon: t(locale, `home.aboutSection.features.${idx}.icon`),
    title: t(locale, `home.aboutSection.features.${idx}.title`),
    desc: t(locale, `home.aboutSection.features.${idx}.desc`),
  }));

  return (
    <section id="about" className="py-20 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-2xl sm:text-5xl font-bold mb-4 text-blue-900 dark:text-white">
          {t(locale, "home.aboutSection.title")}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t(locale, "home.aboutSection.subtitle")}
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Left Content */}
        <div>
          <h3 className="text-2xl font-bold text-blue-900 dark:text-white mb-4">
            {t(locale, "home.aboutSection.missionTitle")}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {t(locale, "home.aboutSection.missionPara1")}
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t(locale, "home.aboutSection.missionPara2")}
          </p>
        </div>

        {/* Right Content */}
        <div>
          <h3 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-4">
            {t(locale, "home.aboutSection.whyTitle")}
          </h3>
          <ul className="space-y-3">
            {reasons.map((item, idx) => (
              <li key={idx} className="flex gap-3">
                <div className="shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">✓</div>
                <div>
                  <div className="font-bold text-gray-800 dark:text-white">{item.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 py-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl px-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-300 mb-2">{stat.number}</div>
            <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div>
        <h3 className="text-2xl font-bold text-blue-900 dark:text-white mb-8 text-center">
          {t(locale, "home.aboutSection.featuresTitle")}
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-linear-to-r from-blue-600 to-blue-400 dark:from-blue-800 dark:to-blue-600 rounded-xl p-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-4">{t(locale, "home.aboutSection.ctaTitle")}</h3>
        <p className="mb-6 text-blue-100">{t(locale, "home.aboutSection.ctaDesc")}</p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition shadow-lg" onClick={()=> router.push("/register?type=contractor")}>
          {t(locale, "home.aboutSection.ctaButton")}
        </button>
      </div>
    </section>
  );
}
