"use client";

import { PhoneCall } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="px-4 mt-16 pb-8">
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white rounded-3xl p-8 md:p-14 shadow-2xl text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 bg-white/20 p-4 rounded-full animate-bounce">
            <PhoneCall className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            App nahi aata? Call karo – kaam pao! 📞
          </h2>

          <p className="max-w-2xl text-lg md:text-xl font-medium text-emerald-50 opacity-90 leading-relaxed mb-10">
            Ab kaam dhundhne ke liye bhatakna nahi padega. Hamare helpline number par call karein aur direct sahi kaam ya labour payein.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <a
              href="tel:+918956271911"
              className="flex items-center justify-center gap-3 bg-white text-green-700 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <PhoneCall className="w-5 h-5" />
              +91 8956271911
            </a>

            <button 
              onClick={() => document.getElementById('labours')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-transparent border-2 border-white/40 hover:border-white hover:bg-white/10 rounded-2xl font-bold text-lg transition-all"
            >
              Kaam Dekho
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}