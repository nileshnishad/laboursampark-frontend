import Menu from "./components/Menu";
import HeroSection from "./components/HeroSection";
import LaboursSection from "./components/LaboursSection";
import ContractorsSection from "./components/ContractorsSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="bg-zinc-50 dark:bg-black min-h-screen w-full font-sans">
      <Menu />
      <HeroSection />
      <LaboursSection />
      <ContractorsSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
