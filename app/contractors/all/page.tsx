"use client";
import { useEffect, useState } from "react";
import AadharContractorCard from "@/app/components/AadharContractorCard";

type Contractor = {
  id: number;
  name: string;
  type: string;
  location: string;
  projects: number;
  specialization: string[];
  phone: string;
  email: string;
  rating: number;
  languages: string[];
  available: boolean;
  profilePic: string;
  bio: string;
  verified: boolean;
  workTypes: string[];
  workStyle: string;
  feedback: { from: string; role: string; comment: string; rating: number }[];
};

export default function AllContractorsPage() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/contractors.json")
      .then((res) => res.json())
      .then((data) => {
        setContractors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching contractors:", err);
        setLoading(false);
      });
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
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-600 dark:text-gray-300">Loading contractors...</div>
          </div>
        )}

        {/* Contractors Grid */}
        {!loading && contractors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contractors.map((c) => (
              <div key={c.id} className="h-full">
                <AadharContractorCard contractor={c} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && contractors.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-300">No contractors found.</p>
          </div>
        )}
      </div>
    </main>
  );
}
