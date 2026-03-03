"use client";

import React, { useState } from "react";

interface SharedContractorCardProps {
  contractor: any;
  onConnect?: (contractorId: string | number) => void;
}

export default function SharedContractorCard({
  contractor,
  onConnect,
}: SharedContractorCardProps) {
  const [sending, setSending] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Support both data structures
  const name =
    contractor.businessName || contractor.name || "Business";
  const ownerName = contractor.fullName || "";
  const phone = contractor.mobile || contractor.phone || "N/A";
  const email = contractor.email || "N/A";
  const rating = contractor.rating || 4.8;
  const companyLogo =
    contractor.companyLogoUrl || contractor.profilePic || "";
  const experienceRange = contractor.experienceRange || "";
  const teamSize = contractor.teamSize || "";
  const completedJobs = contractor.completedJobs || contractor.projects || 0;
  const servicesOffered =
    contractor.servicesOffered || contractor.specialization || [];
  const coverageArea = contractor.coverageArea || [];
  const isVerified = contractor.verified || false;

  const handleConnect = async () => {
    if (onConnect) {
      setSending(true);
      await onConnect(contractor.id);
      setSending(false);
    }
  };

  return (
    <div
      className="h-full transition-all duration-300 ease-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium Business Card - Compact */}
      <div
        className={`relative h-full bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-gray-100 dark:border-slate-700 transition-all duration-300 flex flex-col ${
          isHovered ? "shadow-xl -translate-y-0.5" : "shadow-md"
        }`}
      >
        {/* Left Accent Stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-linear-to-b from-indigo-600 via-purple-600 to-pink-600"></div>

        {/* Top Background Strip - Compact */}
        <div className="h-20 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 relative overflow-hidden flex items-end justify-between px-3 pb-2">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1 right-2 w-16 h-16 bg-indigo-400 rounded-full filter blur-2xl"></div>
          </div>

          {/* Rating */}
          <div className="relative flex items-center gap-0.5">
            <div className="text-lg font-bold text-white">{rating}</div>
            <div className="text-xs text-yellow-300">★★★★★</div>
          </div>

          {/* Verification Badge */}
          {isVerified && (
            <div className="relative bg-indigo-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-0.5 shadow-lg">
              ✓
            </div>
          )}
        </div>

        {/* Profile Section - Compact */}
        <div className="relative px-3 -mt-8 mb-1">
          <div className="flex gap-2 items-end">
            {/* Avatar - Smaller */}
            <img
              src={
                companyLogo ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  name
                )}&background=4f46e5&color=fff&rounded=true&size=80`
              }
              alt={name}
              className="w-16 h-16 rounded-lg object-cover border-3 border-white dark:border-slate-900 shadow-lg shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  name
                )}&background=4f46e5&color=fff&rounded=true&size=80`;
              }}
            />

            <div className="flex-1 min-w-0 pb-0.5">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                {name}
              </h2>
              {ownerName && (
                <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 truncate">
                  {ownerName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-3 h-px bg-linear-to-r from-transparent via-gray-200 dark:via-slate-600 to-transparent my-1"></div>

        {/* Key Metrics - Compact */}
        <div className="px-3 pb-1.5">
          <div className="grid grid-cols-3 gap-1">
            {experienceRange && (
              <div className="text-center p-1.5 rounded bg-slate-50 dark:bg-slate-800/50">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  EXP
                </div>
                <div className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                  {experienceRange}
                </div>
              </div>
            )}
            {teamSize && (
              <div className="text-center p-1.5 rounded bg-slate-50 dark:bg-slate-800/50">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  TEAM
                </div>
                <div className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                  {teamSize}
                </div>
              </div>
            )}
            <div className="text-center p-1.5 rounded bg-slate-50 dark:bg-slate-800/50">
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                JOBS
              </div>
              <div className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">
                {completedJobs}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Compact */}
        <div className="flex-1 px-3 space-y-1.5 overflow-y-auto">
          {/* Contact Details */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-indigo-600 dark:text-indigo-400">📱</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                  {phone}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-indigo-600 dark:text-indigo-400">✉️</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                  {email}
                </p>
              </div>
            </div>
          </div>

          {/* Services */}
          {servicesOffered && servicesOffered.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-0.5 uppercase tracking-wide">
                Services
              </p>
              <div className="flex flex-wrap gap-1">
                {servicesOffered.slice(0, 3).map((service: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 rounded text-xs font-semibold border border-indigo-200 dark:border-indigo-700/50"
                  >
                    {service}
                  </span>
                ))}
                {servicesOffered.length > 3 && (
                  <span className="inline-flex px-1.5 py-0.5 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded text-xs font-semibold">
                    +{servicesOffered.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Coverage */}
          {coverageArea && coverageArea.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-0.5 uppercase tracking-wide">
                Areas
              </p>
              <div className="flex flex-wrap gap-1">
                {coverageArea.slice(0, 2).map((area: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex px-1.5 py-0.5 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 rounded text-xs font-semibold border border-green-200 dark:border-green-700/50"
                  >
                    📍 {area}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        {onConnect && (
          <div className="px-3 py-2 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
            <button
              onClick={handleConnect}
              disabled={sending}
              className="w-full px-3 py-1.5 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded font-bold text-xs transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {sending ? "⚙️ Connecting..." : "Connect"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
