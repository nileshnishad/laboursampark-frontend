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
    <section id="contractors" className="py-10 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-900 dark:text-white">Contractors</h2>
        <a
          href="/contractors/all"
          className="px-2 py-2 text-sm bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition shadow"
        >
          Contractors List
        </a>
      </div>
      
      {/* Loading State - Show Skeleton Carousel */}
      {loading && (
        <Slider {...slickSettings}>
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} type="card" />
          ))}
        </Slider>
      )}
      
      {/* Error State */}
      {error && !loading && (
        <div className="flex justify-center items-center py-20">
          <div className="text-red-600 dark:text-red-400">Error: {error}</div>
        </div>
      )}
      
      {/* Contractors Carousel */}
      {!loading && !error && contractors.length > 0 ? (
        <Slider {...slickSettings}>
          {contractors.map((c) => (
            <div key={c._id} className="px-1.5 sm:px-2">
              <VisitingCard
                contractor={c}
                onConnect={async (id) => {
                  // Add your connection logic here
                }}
                onViewProfile={isLoggedIn ? undefined : () => handleGuestViewAttempt()}
              />
            </div>
          ))}
        </Slider>
      ) : (
        !loading && !error && (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-300">No contractors available at the moment.</p>
          </div>
        )
      )}
    </section>
  );
}
