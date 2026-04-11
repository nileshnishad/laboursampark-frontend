"use client";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { contractorApi } from "@/lib/api-endpoints";
import { getToken } from "@/lib/api-service";
import { showInfoToast } from "@/lib/toast-utils";
import Skeleton from "./Skeleton";
import VisitingCard from "./common/VisitingCard";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { t } from "@/lib/i18n";

type Contractor = {
  _id: string;
  fullName: string;
  email: string;
  userType: string;
  companyLogoUrl: string;
  rating: number;
  totalReviews: number;
  completedJobs: number;
  experienceRange: string;
  availability: boolean;
  serviceCategories: string[];
  coverageArea: string[];
  certifications: string[];
  mobile: string;
  workTypes?: string[];
  location?: {
    coordinates?: {
      coordinates?: [number, number];
      type?: string;
    };
  };
  skills?: string[];
};

export default function ContractorsSection() {
  const router = useRouter();
  const { locale } = useLanguage();
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLoggedIn = Boolean(getToken());

  const handleGuestViewAttempt = () => {
    showInfoToast("For viewing profile details, please login first.");
    router.push("/login");
  };

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        setLoading(true);
        const response = await contractorApi.getAll();
        
        if (response.success && response.data) {
          // Extract contractors from nested response structure
          const contractors = response.data?.data?.users || response.data?.users || (Array.isArray(response.data) ? response.data : []);
          setContractors(Array.isArray(contractors) ? contractors : []);
          setError(null);
        } else {
          setError(response.error || "Failed to fetch contractors");
          setContractors([]);
        }
      } catch (err) {
        console.error("Error fetching contractors:", err);
        setError("Error fetching contractors");
        setContractors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContractors();
  }, []);

  const slickSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 468,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section id="contractors" className="py-20 bg-zinc-950/5 dark:bg-zinc-900/20 overflow-hidden rounded-[3rem]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Modern Header for Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
              {t(locale, "home.contractorsSection.titlePart1")} <span className="text-green-600">{t(locale, "home.contractorsSection.titlePart2")}</span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              {t(locale, "home.contractorsSection.subtitle")}
            </p>
          </div>
          <button 
            onClick={() => router.push("/contractors")}
            className="group flex items-center gap-2 px-8 py-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl font-bold shadow-sm hover:shadow-xl transition-all active:scale-95"
          >
            {t(locale, "home.contractorsSection.viewAll")}
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} type="card" />
            ))}
          </div>
        )}
      
        {/* Error State */}
        {error && !loading && (
          <div className="flex justify-center items-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-red-100 dark:border-red-900/20">
            <div className="text-red-600 dark:text-red-400 font-medium tracking-tight">Error: {error}</div>
          </div>
        )}
      
        {/* Contractors Carousel */}
        {!loading && !error && contractors.length > 0 && (
          <div className="relative -mx-4 group/slider">
            <Slider {...slickSettings}>
              {contractors.map((c) => (
                <div key={c._id} className="px-4 py-8">
                  <div className="transform transition-all duration-300 hover:-translate-y-2">
                    <VisitingCard
                      contractor={c}
                      onConnect={async (id) => {
                        // Connection logic
                      }}
                      onViewProfile={isLoggedIn ? undefined : () => handleGuestViewAttempt()}
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        )}

        {!loading && !error && contractors.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800">
            <p className="text-gray-500 font-medium font-sans">{t(locale, "home.contractorsSection.noData")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
