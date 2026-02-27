"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";

interface ContractorCardProps {
  contractor: any;
  isConnected?: boolean;
  isPending?: boolean;
  onConnect?: (contractorId: string) => void;
}

export default function ContractorCard({
  contractor,
  isConnected = false,
  isPending = false,
  onConnect,
}: ContractorCardProps) {
  const [sending, setSending] = useState(false);

  // Determine connection status based on contractor.status
  const isActuallyConnected = contractor.status === "connected";
  const isActuallyPending = contractor.status === "pending";

  const handleConnect = async () => {
    if (onConnect) {
      setSending(true);
      await onConnect(contractor.id);
      setSending(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-indigo-600 to-indigo-700 p-3 sm:p-4">
        <h4 className="text-base sm:text-lg font-semibold text-white truncate">{contractor.businessName}</h4>
        <p className="text-indigo-100 text-xs sm:text-sm">{contractor.registrationNumber}</p>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 space-y-3">
        {/* Owner Name */}
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Owner</p>
          <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
            {contractor.fullName}
          </p>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Mobile</p>
            <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
              {contractor.mobile}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Email</p>
            <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
              {contractor.email}
            </p>
          </div>
        </div>

        {/* Experience & Team */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Experience</p>
            <p className="text-xs font-semibold text-gray-900 dark:text-white">
              {contractor.experienceRange}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Team</p>
            <p className="text-xs font-semibold text-gray-900 dark:text-white">
              {contractor.teamSize}
            </p>
          </div>
        </div>

        {/* Services */}
        {contractor.servicesOffered && contractor.servicesOffered.length > 0 && (
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Services</p>
            <div className="flex flex-wrap gap-1">
              {contractor.servicesOffered.slice(0, 3).map((service: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium"
                >
                  {service}
                </span>
              ))}
              {contractor.servicesOffered.length > 3 && (
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                  +{contractor.servicesOffered.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Coverage Area */}
        {contractor.coverageArea && contractor.coverageArea.length > 0 && (
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Coverage</p>
            <div className="flex flex-wrap gap-1">
              {contractor.coverageArea.slice(0, 2).map((area: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs font-medium"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
            <p className="text-sm font-semibold text-yellow-600">
              {contractor.rating}/5 ⭐
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Jobs</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {contractor.completedJobs}
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
        {isActuallyConnected ? (
          <button
            disabled
            className="w-full px-3 sm:px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg font-semibold text-xs sm:text-sm cursor-default"
          >
            ✓ Connected
          </button>
        ) : isActuallyPending ? (
          <button
            disabled
            className="w-full px-3 sm:px-4 py-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg font-semibold text-xs sm:text-sm cursor-default"
          >
            ⏳ Pending
          </button>
        ) : (
          <button
            onClick={handleConnect}
            disabled={sending}
            className="w-full px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs sm:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? "Sending..." : "Connect"}
          </button>
        )}
      </div>
    </div>
  );
}
