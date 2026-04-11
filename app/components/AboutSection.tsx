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
    <section id="about" className="py-24 bg-white dark:bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header - Premium Alignment */}
        <div className="text-center mb-20">
          <span className="text-blue-600 font-bold tracking-widest text-sm uppercase mb-4 block">{t(locale, "home.aboutSection.badge")}</span>
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-gray-900 dark:text-white tracking-tight">
            {t(locale, "home.aboutSection.title")}
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed">
            {t(locale, "home.aboutSection.subtitle")}
          </p>
        </div>

        {/* Main Content Grid - Elegant Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-24">
          {/* Left Content - Mission Card */}
          <div className="p-10 md:p-14 bg-blue-50/50 dark:bg-blue-900/10 rounded-[3rem] border border-blue-100/50 dark:border-blue-800/20 relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/5 rounded-full group-hover:scale-110 transition-transform duration-700"></div>
            <h3 className="text-3xl font-black text-blue-900 dark:text-blue-100 mb-8 relative z-10">
              {t(locale, "home.aboutSection.missionTitle")}
            </h3>
            <div className="space-y-6 relative z-10 text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              <p>{t(locale, "home.aboutSection.missionPara1")}</p>
              <p>{t(locale, "home.aboutSection.missionPara2")}</p>
            </div>
          </div>

          {/* Right Content - Why Choose Us Card */}
          <div className="p-10 md:p-14 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-[3rem] border border-emerald-100/50 dark:border-emerald-800/20 relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-600/5 rounded-full group-hover:scale-110 transition-transform duration-700"></div>
            <h3 className="text-3xl font-black text-emerald-900 dark:text-emerald-100 mb-8 relative z-10">
              {t(locale, "home.aboutSection.whyTitle")}
            </h3>
            <ul className="space-y-6 relative z-10">
              {reasons.map((item, idx) => (
                <li key={idx} className="flex gap-5 items-start group/item">
                  <div className="shrink-0 w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg group-hover/item:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-xl text-gray-900 dark:text-white mb-1">{item.title}</div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium leading-snug">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Features Grid - Clean & Sharp */}
        <div className="mb-24">
          <h3 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-12 text-center">
            {t(locale, "home.aboutSection.featuresTitle")}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="group p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 hover:border-blue-500/30 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="text-5xl mb-6 transform group-hover:scale-125 transition-transform duration-300 inline-block">{feature.icon}</div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h4>
                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section - Power Closer */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-800 dark:from-blue-700 dark:to-indigo-950 rounded-[3rem] p-10 md:p-20 text-center text-white relative overflow-hidden shadow-2xl group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="relative z-10">
            <h3 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
              {t(locale, "home.aboutSection.ctaTitle")}
            </h3>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => router.push("/register")}
                className="px-10 py-5 bg-white text-blue-700 rounded-2xl font-black text-lg hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                {t(locale, "home.aboutSection.ctaStart")}
              </button>
              <button 
                onClick={() => router.push("/contact")}
                className="px-10 py-5 bg-blue-500/20 backdrop-blur-md border-2 border-white/30 hover:border-white rounded-2xl font-black text-lg transition-all"
              >
                {t(locale, "home.aboutSection.ctaContact")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
