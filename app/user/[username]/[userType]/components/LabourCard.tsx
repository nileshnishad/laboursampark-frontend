"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";

interface LabourCardProps {
  labour: any;
  isConnected?: boolean;
  isPending?: boolean;
  onConnect?: (labourId: string) => void;
}

export default function LabourCard({
  labour,
  isConnected = false,
  isPending = false,
  onConnect,
}: LabourCardProps) {
  const [sending, setSending] = useState(false);

  // Determine connection status based on labour.status
  const isActuallyConnected = labour.status === "connected";
  const isActuallyPending = labour.status === "pending";

  const handleConnect = async () => {
    if (onConnect) {
      setSending(true);
      await onConnect(labour.id);
      setSending(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 p-3 sm:p-4">
        <h4 className="text-base sm:text-lg font-semibold text-white truncate">{labour.fullName}</h4>
        <p className="text-blue-100 text-xs sm:text-sm">{labour.experience || "Experience not specified"}</p>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 space-y-3">
        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Mobile</p>
            <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
              {labour.mobile}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Email</p>
            <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
              {labour.email}
            </p>
          </div>
        </div>

        {/* Location & Hours */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Location</p>
            <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
              {typeof labour.location === "string" ? labour.location : "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Hours</p>
            <p className="text-xs font-semibold text-gray-900 dark:text-white">
              {labour.preferredWorkingHours || "Flexible"}
            </p>
          </div>
        </div>

        {/* Skills */}
        {labour.skills && labour.skills.length > 0 && (
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Skills</p>
            <div className="flex flex-wrap gap-1">
              {labour.skills.slice(0, 3).map((skill: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
              {labour.skills.length > 3 && (
                <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                  +{labour.skills.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Work Types */}
        {labour.workTypes && labour.workTypes.length > 0 && (
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Work Types</p>
            <div className="flex flex-wrap gap-1">
              {labour.workTypes.slice(0, 2).map((type: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs font-medium"
                >
                  {type}
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
              {labour.rating}/5 ⭐
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Jobs</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {labour.completedJobs}
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
            className="w-full px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs sm:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? "Sending..." : "Connect"}
          </button>
        )}
      </div>
    </div>
  );
}
