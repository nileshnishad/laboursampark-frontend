"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { buildUserDashboardPath } from "@/lib/user-route";
import Menu from "./components/Menu";
import HeroSection from "./components/HeroSection";
import LaboursSection from "./components/LaboursSection";
import ContractorsSection from "./components/ContractorsSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import LanguageSelector from "./components/LanguageSelector";
import { primaryKeywords, secondaryKeywords, metaDescriptions } from "@/lib/seo-config";
import SEOHead from "./components/SEOHead";

export default function Home() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      router.replace(buildUserDashboardPath(user));
    }
  }, [user, router]);

  // Combine primary and secondary keywords for maximum coverage
  const allHomeKeywords = [...primaryKeywords, ...secondaryKeywords];

  return (
    <>
      <SEOHead
        section="home"
        title="LabourSampark - Find Skilled Labourers & Trusted Contractors in India | Hire Workers Online"
        description={metaDescriptions.home}
        keywords={allHomeKeywords}
        ogImage="https://laboursampark.com/images/logo.jpg"
        ogUrl="https://laboursampark.com"
      />
      <main className="bg-zinc-50 dark:bg-black min-h-screen w-full font-sans">
        {/* Language Selector - Floating in Top Right */}
        <div className="hidden md:block fixed top-4 right-4 z-50">
          <LanguageSelector />
        </div>
        
        <Menu />
        <HeroSection />
        <LaboursSection />
        <ContractorsSection />
        <AboutSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
