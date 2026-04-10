import LaboursSection from "../components/LaboursSection";
import SEOHead from "../components/SEOHead";
import { metaDescriptions, primaryKeywords, serviceKeywords } from "@/lib/seo-config";

export default function LaboursPage() {
  const labourKeywords = [
    ...serviceKeywords.labours,
    "labour jobs",
    "skilled worker hire",
    "daily wage labourer",
    "construction worker India",
    ...primaryKeywords.slice(0, 5)
  ];

  return (
    <>
      <SEOHead
        section="labours"
        title="Find & Hire Skilled Labourers - LabourSampark"
        description={metaDescriptions.labours}
        keywords={labourKeywords}
      />
      <div className="py-8">
        <LaboursSection />
      </div>
    </>
  );
}
