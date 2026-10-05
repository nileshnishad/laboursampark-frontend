"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import IDCard from "@/app/components/common/IdCard";
import UnifiedSearchInput from "@/app/components/common/UnifiedSearchInput";
import { labourApi } from "@/lib/api-endpoints";
import Skeleton from "@/app/components/Skeleton";
import { getToken } from "@/lib/api-service";
import { showInfoToast } from "@/lib/toast-utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSkills, skillIdsToSearchText } from "@/store/slices/skillsSlice";
import { useLanguage } from "@/app/context/LanguageContext";

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

function AllLaboursContent() {
  const { t } = useLanguage();
  const [labours, setLabours] = useState<Labour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const isLoggedIn = Boolean(getToken());
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { skills: allSkills } = useAppSelector((state) => state.skills);

  // Ensure skills are loaded for ID → name resolution
  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

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
    showInfoToast(t("labour.guestViewPrompt", {}, "For viewing profile details, please login first."));
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
    // Resolve skill IDs to names (all 3 languages) for search
    const skills = skillIdsToSearchText(labour.skills || [], allSkills);

    return (
      name.includes(query) || location.includes(query) || skills.includes(query)
    );
  });

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 pb-4 px-2 sm:px-3">
      <div className="max-w-7xl mx-auto h-[calc(100vh-7rem)] md:h-[calc(100vh-8rem)]">
        <div className="dark:bg-zinc-900/50 rounded-3xl md:p-4 dark:border-zinc-800  h-full flex flex-col overflow-hidden">
          <div className="sticky top-0 z-20 bg-zinc-50/95 dark:bg-zinc-900/90 backdrop-blur-sm px-1 md:px-2 py-3 border-b border-zinc-200/80 dark:border-zinc-800/80 mb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
            <div className="flex items-start gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center justify-center w-6 h-6 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all shadow-sm active:scale-95"
                aria-label="Go back"
              >
                <span className="text-md">←</span>
              </button>
              <div className="">
                <h1 className="text-md md:text-2xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
                  {t("labour.skilledLabours", {}, "Skilled Labours")}
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1">
                  {t("labour.laboursSubtitle", {}, "Connect with verified and rated labourers.")}
                </p>
              </div>
            </div>

            <div className="w-full md:w-96">
                <UnifiedSearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder={t("labour.searchPlaceholder", {}, "Search name, location, or skills...")}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-3">
            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
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
                <div className="text-red-600 dark:text-red-400">{t("common.error", {}, "Error")}: {error}</div>
              </div>
            )}

            {/* Labours Grid */}
            {!loading && !error && filteredLabours.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 justify-items-center">
                {filteredLabours.map((l) => (
                  <div key={l._id} className="w-full max-w-none sm:max-w-[330px]">
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
              <div className="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                <p className="text-zinc-500 font-medium">
                  {searchQuery.trim()
                    ? t("labour.noLaboursMatch", {}, "No labours match your search.")
                    : t("labour.noLaboursFound", {}, "No labours found.")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AllLaboursPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-18 md:pt-20 pb-4 px-2 sm:px-3">
        <div className="max-w-7xl mx-auto h-[calc(100vh-7rem)] md:h-[calc(100vh-8rem)] flex flex-col">
          <div className="sticky top-0 z-20 bg-gray-50 dark:bg-gray-900 pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 pt-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} type="card" />
            ))}
          </div>
        </div>
      </main>
    }>
      <AllLaboursContent />
    </Suspense>
  );
}
