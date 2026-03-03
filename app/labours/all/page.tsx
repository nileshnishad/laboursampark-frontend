"use client";
import { useEffect, useState } from "react";
import AadharLabourCard from "@/app/components/AadharLabourCard";

type Labour = {
  id: number;
  name: string;
  trade: string;
  location: string;
  experience: number;
  skills: string[];
  phone: string;
  email: string;
  languages: string[];
  profilePic: string;
  verified: boolean;
  workNature: string;
  feedback: { from: string; role: string; comment: string; rating: number }[];
};

export default function AllLaboursPage() {
  const [labours, setLabours] = useState<Labour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/labours.json")
      .then((res) => res.json())
      .then((data) => {
        setLabours(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching labours:", err);
        setLoading(false);
      });
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

        {/* Labours Grid */}
        {!loading && labours.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {labours.map((l) => (
              <div key={l.id} className="h-full">
                <AadharLabourCard labour={l} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && labours.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-300">No labours found.</p>
          </div>
        )}
      </div>
    </main>
  );
}
