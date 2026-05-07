"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { buildUserDashboardPath } from "@/lib/user-route";
import { getToken as getStoredToken } from "@/lib/api-service";
import { setUser } from "@/store/slices/authSlice";
import type { AppDispatch } from "@/store/store";
import HeroSection from "./components/HeroSection";
import LaboursSection from "./components/LaboursSection";
import ContractorsSection from "./components/ContractorsSection";
import AboutSection from "./components/AboutSection";
import { primaryKeywords, secondaryKeywords, metaDescriptions } from "@/lib/seo-config";
import SEOHead from "./components/SEOHead";
import QuickActions from "./components/QuickActions";
import CallToAction from "./components/CallToAction";
import TrustSection from "./components/TrustSection";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const hasAuthToken = Boolean(getStoredToken());

    if (user && hasAuthToken) {
      router.replace(buildUserDashboardPath(user));
      return;
    }

    // Clear stale local user to avoid being stuck between home and protected routes.
    if (user && !hasAuthToken) {
      dispatch(setUser(null));
    }
  }, [user, router, dispatch]);

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
      <main className="bg-zinc-50 dark:bg-black w-full font-sans">
        <HeroSection />
        <div className="max-w-7xl mx-auto space-y-16 pb-20">
          <QuickActions />
          <CallToAction />
          <TrustSection />
          
          <div className="px-4">
            <LaboursSection />
          </div>
          
          <div className="px-4">
            <ContractorsSection />
          </div>
          
          <div className="px-4">
            <AboutSection />
          </div>
        </div>
      </main>
    </>
  );
}
