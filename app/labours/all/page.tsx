"use client";
import { useEffect, useState } from "react";
import AadharLabourCard from "@/app/components/AadharLabourCard";
import { labourApi } from "@/lib/api-endpoints";

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
};

export default function AllLaboursPage() {
  const [labours, setLabours] = useState<Labour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 md:pt-32 pb-8 md:pb-16 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 dark:text-white mb-3">All Labours</h1>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl">Browse all available skilled labourers in our network. Find verified professionals for your project needs.</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-600 dark:text-gray-300">Loading labours...</div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-red-600 dark:text-red-400">Error: {error}</div>
          </div>
        )}

        {/* Labours Grid */}
        {!loading && !error && labours.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {labours.map((l) => (
              <div key={l._id} className="h-full">
                <AadharLabourCard labour={l} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && labours.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-300">No labours found.</p>
          </div>
        )}
      </div>
    </main>
  );
}
