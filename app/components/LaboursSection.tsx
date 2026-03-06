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
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section id="labours" className="py-10 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-900 dark:text-white">Labours</h2>
        <a
          href="/labours/all"
          className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow"
        >
           Labours List
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
      
      {/* Labours Carousel */}
      {!loading && !error && labours.length > 0 ? (
        <Slider {...slickSettings}>
          {labours.map((l) => (
            <div key={l._id} className="px-2">
              <IDCard
                labour={l}
                onConnect={async (id) => {
                  console.log("Connecting with labour:", id);
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
            <p className="text-gray-600 dark:text-gray-300">No labours available at the moment.</p>
          </div>
        )
      )}
    </section>
  );
}
