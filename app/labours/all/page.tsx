"use client";
import { useEffect, useState } from "react";
import IDCard from "@/app/components/common/IdCard";
import UnifiedSearchInput from "@/app/components/common/UnifiedSearchInput";
import { labourApi } from "@/lib/api-endpoints";
import Skeleton from "@/app/components/Skeleton";
import { getToken } from "@/lib/api-service";
import { showInfoToast } from "@/lib/toast-utils";
import { useRouter, useSearchParams } from "next/navigation";

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
  city?: string;
  location?: string | { city?: string; address?: string };
};

export default function AllLaboursPage() {
  const [labours, setLabours] = useState<Labour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const isLoggedIn = Boolean(getToken());
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize searchQuery from URL search parameter
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearchQuery(decodeURIComponent(urlSearch));
    }
  }, [searchParams]);
  
  

  useEffect(() => {
    const fetchLabours = async () => {
      try {
        setLoading(true);
        const response = await labourApi.getAll();

        if (response.success && response.data) {
          // Extract users from nested response structure
          const users =
            response.data?.data?.users ||
            response.data?.users ||
            (Array.isArray(response.data) ? response.data : []);
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
  const handleGuestViewAttempt = () => {
    showInfoToast("For viewing profile details, please login first.");
    router.push("/login");
  };

  const filteredLabours = labours.filter((labour) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const name = (labour.fullName || "").toLowerCase();
    const rawLocation = labour.location || labour.city || "";
    const location =
      typeof rawLocation === "string"
        ? rawLocation.toLowerCase()
        : `${rawLocation?.city || ""} ${rawLocation?.address || ""}`.toLowerCase();
    const skills = (labour.skills || []).join(" ").toLowerCase();

    return (
      name.includes(query) || location.includes(query) || skills.includes(query)
    );
  });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-18 md:pt-20 pb-4 px-2 sm:px-3">
      <div className="max-w-7xl mx-auto h-[calc(100vh-7rem)] md:h-[calc(100vh-8rem)] flex flex-col">
        <div className="sticky top-0 z-20 bg-gray-50 dark:bg-gray-900 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Go back"
              title="Go back"
            >
              <span aria-hidden="true">&larr;</span>
            </button>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-green-900 dark:text-white">
              All Labours
            </h1>
          </div>
          <p className="text-gray-700 text-xs dark:text-gray-300">
            Browse all available skilled labourers in our network. Find verified
            professionals for your project needs.
          </p>

          <div className="mt-3 max-w-2xl">
            <UnifiedSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              label="Search by Name, Location, or Skills"
              placeholder="Type to search... (e.g., 'Ravi', 'Pune', 'Masonry')"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pt-4 pr-1">
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

          {/* Labours Grid */}
          {!loading && !error && filteredLabours.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredLabours.map((l) => (
                <div key={l._id} className="h-full">
                  <IDCard
                    labour={l}
                    onViewProfile={
                      isLoggedIn ? undefined : () => handleGuestViewAttempt()
                    }
                  />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredLabours.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-600 dark:text-gray-300">
                {searchQuery.trim()
                  ? "No labours match your search."
                  : "No labours found."}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
