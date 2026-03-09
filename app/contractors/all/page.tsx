"use client";
import { useEffect, useState } from "react";
import VisitingCard from "@/app/components/common/VisitingCard";
import UnifiedSearchInput from "@/app/components/common/UnifiedSearchInput";
import { contractorApi } from "@/lib/api-endpoints";
import { getToken } from "@/lib/api-service";
import { showInfoToast } from "@/lib/toast-utils";
import Skeleton from "@/app/components/Skeleton";
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
    city?: string;
    address?: string;
    coordinates?: {
      coordinates?: [number, number];
      type?: string;
    };
  };
  skills?: string[];
  locationText?: string;
};

export default function AllContractorsPage() {
  const router = useRouter();
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredContractors = contractors.filter((contractor) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const name = (contractor.fullName || "").toLowerCase();
    const rawLocation = contractor.location || contractor.locationText || "";
    const location =
      typeof rawLocation === "string"
        ? rawLocation.toLowerCase()
        : `${rawLocation?.city || ""} ${rawLocation?.address || ""}`.toLowerCase();
    const skills = (contractor.skills || []).join(" ").toLowerCase();
    const services = (contractor.serviceCategories || []).join(" ").toLowerCase();

    return (
      name.includes(query) ||
      location.includes(query) ||
      skills.includes(query) ||
      services.includes(query)
    );
  });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-18 md:pt-20 pb-4 px-2 sm:px-3">
      <div className="max-w-7xl mx-auto h-[calc(100vh-7rem)] md:h-[calc(100vh-8rem)] flex flex-col">
        <div className="sticky top-0 z-20 bg-gray-50 dark:bg-gray-900 pb-3 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-green-900 dark:text-white mb-1">
            All Contractors
          </h1>
          <p className="text-gray-700 text-xs dark:text-gray-300">
            Browse all available contractors in our network. Find verified professionals for your construction and project needs.
          </p>

          <div className="mt-3 max-w-2xl">
            <UnifiedSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              label="Search by Name, Location, Skills, or Services"
              placeholder="Type to search... (e.g., 'Sharma', 'Mumbai', 'Civil', 'Plumbing')"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pt-4 pr-1">
          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-full">
                  <Skeleton type="card" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-red-600 dark:text-red-400">Error: {error}</div>
            </div>
          )}

          {/* Contractors Grid */}
          {!loading && !error && filteredContractors.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContractors.map((c) => (
                <div key={c._id} className="h-full">
                  <VisitingCard
                    contractor={c}
                    onViewProfile={isLoggedIn ? undefined : () => handleGuestViewAttempt()}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredContractors.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-600 dark:text-gray-300">
                {searchQuery.trim() ? "No contractors match your search." : "No contractors found."}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
