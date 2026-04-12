"use client";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { labourApi } from "@/lib/api-endpoints";
import { getToken } from "@/lib/api-service";
import { showInfoToast } from "@/lib/toast-utils";
import Skeleton from "./Skeleton";
import IDCard from "./common/IdCard";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { t } from "@/lib/i18n";

type Labour = {
  _id: string;
  fullName: string;
  email: string;
  userType: string;
  profilePhotoUrl: string;
  bio: string;
  skills: string[];
  mobile: string;
  rating: number;
  totalReviews: number;
  completedJobs: number;
  experience: string;
  availability: boolean;
  workTypes: string[];
  aadharVerified: boolean;
  location?: {
    coordinates?: {
      coordinates?: [number, number];
      type?: string;
    };
  };
  serviceCategories?: string[];
  coverageArea?: string[];
  certifications?: string[];
};

export default function LaboursSection() {
  const router = useRouter();
  const { locale } = useLanguage();
  const [labours, setLabours] = useState<Labour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLoggedIn = Boolean(getToken());

  const handleGuestViewAttempt = () => {
    showInfoToast("For viewing profile details, please login first.");
    router.push("/login");
  };

  useEffect(() => {
    const fetchLabours = async () => {
      try {
        setLoading(true);
        const response = await labourApi.getAll();
        
        if (response.success && response.data) {
          // Extract users from nested response structure
          const users = response.data?.data?.users || response.data?.users || (Array.isArray(response.data) ? response.data : []);
          setLabours(Array.isArray(users) ? users : []);
          setError(null);
        } else {
          setError(response.error || "Failed to fetch labours");
          setLabours([]);
        }
      } catch (err) {
        console.error("Error fetching labours:", err);
        setError("Error fetching labours");
        setLabours([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLabours();
  }, []);

  const loadingSlickSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    // slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const labourCount = labours.length;
  const desktopSlides = Math.min(Math.max(labourCount, 1), 4);
  const tabletSlides = Math.min(Math.max(labourCount, 1), 2);
  const mobileSlides = 1;

  const slickSettings = {
    dots: labourCount > 1,
    infinite: labourCount > desktopSlides,
    speed: 500,
    slidesToShow: desktopSlides,
    slidesToScroll: 1,
    autoplay: labourCount > 1,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(labourCount, 3),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(labourCount, 2),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "0px",
        },
      },
    ],
  };

  return (
    <section id="labours" className="py-20 bg-zinc-50 dark:bg-black overflow-hidden rounded-[3rem]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Modern Header for Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
              {t(locale, "home.laboursSection.titlePart1")} <span className="text-blue-600">{t(locale, "home.laboursSection.titlePart2")}</span> {t(locale, "home.laboursSection.titlePart3")}
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              {t(locale, "home.laboursSection.subtitle")}
            </p>
          </div>
          <button 
            onClick={() => router.push("/labours")}
            className="group flex items-center gap-2 px-8 py-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl font-bold shadow-sm hover:shadow-xl transition-all active:scale-95"
          >
            {t(locale, "home.laboursSection.viewAll")}
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
      
        {/* Labours Carousel */}
        {!loading && !error && labours.length > 0 && (
          <div className="relative -mx-4 group/slider">
            <Slider {...slickSettings}>
              {labours.map((l) => (
                <div key={l._id} className="px-4 py-8">
                  <div className="transform transition-all duration-300 hover:-translate-y-2">
                    <IDCard
                      labour={l}
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

        {!loading && !error && labours.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800">
            <p className="text-gray-500 font-medium">{t(locale, "home.laboursSection.noData")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
