"use client";
import { useEffect, useState } from "react";
import IDCard from "@/app/components/common/IdCard";
import UnifiedSearchInput from "@/app/components/common/UnifiedSearchInput";
import { labourApi } from "@/lib/api-endpoints";
import Skeleton from "@/app/components/Skeleton";
import { getToken } from "@/lib/api-service";
import { showInfoToast } from "@/lib/toast-utils";
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

    return name.includes(query) || location.includes(query) || skills.includes(query);
  });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 md:pt-32 pb-8 md:pb-16 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-900 dark:text-white mb-3">All Labours</h1>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl">Browse all available skilled labourers in our network. Find verified professionals for your project needs.</p>

          <div className="mt-5 max-w-2xl">
            <UnifiedSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              label="Search by Name, Location, or Skills"
              placeholder="Type to search... (e.g., 'Ravi', 'Pune', 'Masonry')"
            />
          </div>
        </div>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLabours.map((l) => (
              <div key={l._id} className="h-full">
                <IDCard labour={l} onViewProfile={isLoggedIn ? undefined : () => handleGuestViewAttempt()}  />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredLabours.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-300">
              {searchQuery.trim() ? "No labours match your search." : "No labours found."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
