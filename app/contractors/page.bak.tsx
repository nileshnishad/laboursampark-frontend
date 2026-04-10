import ContractorsSection from "../components/ContractorsSection";
import SEOHead from "../components/SEOHead";
import { metaDescriptions, primaryKeywords, serviceKeywords } from "@/lib/seo-config";

export default function ContractorsPage() {
  const contractorKeywords = [
    ...serviceKeywords.contractors,
    "find building contractors",
    "trusted house contractors",
    "home architecture services",
    "verified contractors India",
    ...primaryKeywords.slice(6, 11)
  ];

  return (
    <>
      <SEOHead
        section="contractors"
        title="Verified Contractors - Construction & Renovation Expert | LabourSampark"
        description={metaDescriptions.contractors}
        keywords={contractorKeywords}
      />
      <div className="py-8">
        <ContractorsSection />
      </div>
    </>
  );
}
