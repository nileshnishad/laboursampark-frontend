"use client";
import { useEffect, useState } from "react";
import AadharContractorCard from "@/app/components/AadharContractorCard";
import { contractorApi } from "@/lib/api-endpoints";
import Skeleton from "@/app/components/Skeleton";

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

export default function AllContractorsPage() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 md:pt-32 pb-8 md:pb-16 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-900 dark:text-white mb-3">All Contractors</h1>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl">Browse all available contractors in our network. Find verified professionals for your construction and project needs.</p>
        </div>

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
        {!loading && !error && contractors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contractors.map((c) => (
              <div key={c._id} className="h-full">
                <AadharContractorCard contractor={c} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && contractors.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-300">No contractors found.</p>
          </div>
        )}
      </div>
    </main>
  );
}
