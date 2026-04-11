"use client";

import { PhoneCall, Volume2 } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { t } from "@/lib/i18n";
import { useState } from "react";

export default function CallToAction() {
  const { locale } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;

    if (locale === "hi") {
      utterance.lang = "hi-IN";
      selectedVoice = voices.find(v => v.lang.includes("hi") || v.lang.includes("HI"));
    } else if (locale === "mr") {
      utterance.lang = "mr-IN";
      selectedVoice = voices.find(v => v.lang.includes("mr") || v.lang.includes("MR"));
    } else {
      utterance.lang = "en-IN";
      selectedVoice = voices.find(v => v.lang.includes("en-IN") || v.lang.includes("en-GB"));
    }

    if (selectedVoice) utterance.voice = selectedVoice;
    
    // Clarity settings
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <section className="px-4 mt-16 pb-8">
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white rounded-3xl p-8 md:p-14 shadow-2xl text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white/20 p-4 rounded-full animate-bounce">
              <PhoneCall className="w-8 h-8 text-white" />
            </div>
            <button 
              onClick={() => handleSpeak(`${t(locale, "home.callToAction.title")}. ${t(locale, "home.callToAction.subtitle")}`)}
              className={`p-3 rounded-full transition-all active:scale-95 ${isSpeaking ? 'bg-emerald-400 rotate-12 scale-110' : 'bg-white/10 hover:bg-white/20'}`}
              title="Listen in your language"
            >
              <Volume2 className={`w-6 h-6 ${isSpeaking ? 'text-green-900' : 'text-white'}`} />
            </button>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            {t(locale, "home.callToAction.title")}
          </h2>

          <p className="max-w-2xl text-lg md:text-xl font-medium text-emerald-50 opacity-90 leading-relaxed mb-10">
            {t(locale, "home.callToAction.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <a
              href="tel:+919172272305"
              className="flex items-center justify-center gap-3 bg-white text-green-700 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <PhoneCall className="w-5 h-5" />
              {t(locale, "home.callToAction.callButton")}
            </a>

            <button 
              onClick={() => document.getElementById('labours')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-transparent border-2 border-white/40 hover:border-white hover:bg-white/10 rounded-2xl font-bold text-lg transition-all"
            >
              {t(locale, "home.callToAction.viewWorkButton")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}