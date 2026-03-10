"use client";

import React from "react";
import ContractorCard from "../ContractorCard";
import type { TabContentProps } from "../TabValueContentMap";

export default function SubContractorsTabContent(props: TabContentProps) {
  const { usersLoading, usersError, filteredData, onConnect } = props;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Sub-Contractors</h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
          View your connected sub-contractors.
        </p>
      </div>

      {usersLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading...</p>
        </div>
      ) : usersError ? (
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400 text-lg">{usersError}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredData.length > 0 ? (
            filteredData.map((contractor: any) => (
              <ContractorCard key={contractor.id} contractor={contractor} onConnect={onConnect} />
            ))
          ) : (
            <div className="sm:col-span-2 lg:col-span-3 text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No sub-contractors found right now.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
