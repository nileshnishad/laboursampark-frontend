import Menu from "./components/Menu";
import HeroSection from "./components/HeroSection";
import LaboursSection from "./components/LaboursSection";
import ContractorsSection from "./components/ContractorsSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import SEOHead from "./components/SEOHead";
import { primaryKeywords, secondaryKeywords, metaDescriptions } from "@/lib/seo-config";

export default function Home() {
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
