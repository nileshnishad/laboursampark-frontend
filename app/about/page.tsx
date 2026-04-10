import AboutSection from "../components/AboutSection";
import SEOHead from "../components/SEOHead";
import { metaDescriptions } from "@/lib/seo-config";

export default function AboutPage() {
  return (
    <>
      <SEOHead
        section="about"
        title="About Us - LabourSampark | Our Mission & Vision"
        description={metaDescriptions.about || "Learn about LabourSampark and our mission to connect labourers and contractors."}
      />
      <div className="py-8">
        <AboutSection />
      </div>
    </>
  );
}
