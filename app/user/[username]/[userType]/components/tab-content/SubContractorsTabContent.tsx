"use client";

import React, { useEffect, useState } from "react";
import ContractorCard from "../ContractorCard";
import type { TabContentProps } from "../TabValueContentMap";
import { contractorApi } from "@/lib/api-endpoints";

export default function ContractorsTabContent(props: TabContentProps) {
  const [contractors, setContractors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContractors = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await contractorApi.getAll();
        if (response.success && response.data) {
          const users =
            response.data?.data?.users ||
            response.data?.users ||
            (Array.isArray(response.data) ? response.data : []);
          setContractors(Array.isArray(users) ? users : []);
        } else {
          setError(response.error || "Failed to fetch contractors");
        }
      } catch (err) {
        setError("Error fetching contractors");
      } finally {
        setLoading(false);
      }
    };
    fetchContractors();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Contractors</h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
          Browse and connect with contractors relevant to your work.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {contractors.length > 0 ? (
            contractors.map((contractor: any) => (
              <ContractorCard key={contractor.id || contractor._id} contractor={contractor} />
            ))
          ) : (
            <div className="sm:col-span-2 lg:col-span-3 text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No contractor profiles found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
