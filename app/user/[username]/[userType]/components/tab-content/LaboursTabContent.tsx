"use client";

import React from "react";
import LabourCard from "../LabourCard";
import type { TabContentProps } from "../TabValueContentMap";

export default function LaboursTabContent(props: TabContentProps) {
  const { usersLoading, usersError, filteredData, onConnect } = props;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Labours</h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
          Browse labour profiles available for your requirements.
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
            filteredData.map((labour: any) => (
              <LabourCard key={labour.id} labour={labour} onConnect={onConnect} />
            ))
          ) : (
            <div className="sm:col-span-2 lg:col-span-3 text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No labour profiles found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
