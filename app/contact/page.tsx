import ContactSection from "../components/ContactSection";
import SEOHead from "../components/SEOHead";
import { metaDescriptions } from "@/lib/seo-config";

export default function ContactPage() {
  return (
    <>
      <SEOHead
        section="contact"
        title="Contact Us - LabourSampark | Get in Touch"
        description={metaDescriptions.contact || "Contact LabourSampark for any queries or support."}
      />
      <div className="py-8">
        <ContactSection />
      </div>
    </>
  );
}
