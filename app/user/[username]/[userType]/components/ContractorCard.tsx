"use client";

import React from "react";

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
  const [sending, setSending] = React.useState(false);
  // Determine connection status based on contractor.status
  const isActuallyConnected = contractor.status === "connected";
  const isActuallyPending = contractor.status === "pending";
  const name = contractor.fullName || contractor.businessName || contractor.name || "Business";
  const type = contractor.userType || contractor.type || "Contractor";
  const city = typeof contractor.city === "string" ? contractor.city : contractor.location?.city || "Not specified";
  const rating = contractor.rating || 0;
  const projects = contractor.completedJobs || contractor.projects || 0;
  const phone = contractor.mobile || contractor.phone || "N/A";
  const email = contractor.email || "N/A";
  const available = contractor.availability !== undefined ? contractor.availability : (contractor.available !== undefined ? contractor.available : true);
  const verified = contractor.certifications && contractor.certifications.length > 0;
  const profilePic = contractor.companyLogoUrl || contractor.profilePic || "";
  const specialization = contractor.serviceCategories || contractor.servicesOffered || contractor.specialization || [];
  const feedback = contractor.feedback || [];
  const bio = contractor.about || "";
  const experience = contractor.experienceRange || "Not specified";

  const handleConnect = async () => {
    if (onConnect) {
      setSending(true);
      await onConnect(contractor._id || contractor.id);
      setSending(false);
    }
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };



  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-green-200 dark:border-green-700 flex flex-col">
      {/* Header Bar */}
      <div className="h-1 bg-linear-to-r from-green-600 to-green-400"></div>

      {/* ID Card Style Content */}
      <div className="p-3 sm:p-2 space-y-2">
        
        {/* Top Row - Info and Photo */}
        <div className="flex gap-3 items-start">
          {/* Left Side - Name, Contact, Status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="text-sm font-bold text-gray-800 dark:text-white truncate">
                {name}
              </h3>
              {verified && (
                <span title="Verified" className="text-green-500 text-xs shrink-0">
                  ✔️
                </span>
              )}
            </div>
            
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 space-y-0.5">
              <div className="truncate">
                <span className="font-semibold">📧</span> {email}
              </div>
              <div className="truncate">
                <span className="font-semibold">📱</span> {phone}
              </div>
              <div className="text-xs">
                <span className={`font-semibold ${available ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  {available ? "✓ Available" : "✗ Unavailable"} {type && `- ${type}`}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Profile Photo */}
          <div className="shrink-0">
            {profilePic ? (
              <img
                src={profilePic}
                alt={name}
                className="w-16 h-16 rounded-lg object-cover border border-green-300 shadow-md"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg border border-green-300 shadow-md">
                {getInitials(name)}
              </div>
            )}
          </div>
        </div>

        {/* Specialization Row */}
        {specialization.length > 0 && (
          <div className="pt-1">
            <div className="flex flex-wrap gap-1">
              {specialization.slice(0, 3).map((s: string) => (
                <span
                  key={s}
                  className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-2 py-0.5 rounded text-xs font-medium truncate"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        
        {bio && (
          <div className="pt-1">
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 overflow-hidden text-ellipsis">{bio}</p>
          </div>
        )}
        {experience && (
          <div className="pt-1">
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 overflow-hidden text-ellipsis">{experience}</p>
          </div>
        )}

        {/* Stats Row */}
        <div className="flex gap-3 pt-1 text-xs">
          <div className="flex-1">
            <span className="text-gray-600 dark:text-gray-400">Rating:</span>
            <span className="text-yellow-600 dark:text-yellow-400 font-bold ml-1">★ {rating}</span>
          </div>
          <div className="flex-1">
            <span className="text-gray-600 dark:text-gray-400">Projects:</span>
            <span className="text-gray-800 dark:text-gray-200 font-medium ml-1">{projects}</span>
          </div>
          {city && (
            <div className="flex-1">
              <span className="text-gray-600 dark:text-gray-400">City:</span>
              <span className="text-gray-800 dark:text-gray-200 font-medium ml-1 truncate">{city}</span>
            </div>
          )}
        </div>

        {/* Feedback */}
        {feedback.length > 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded p-2 text-xs">
            <span className="text-green-700 dark:text-green-300 font-semibold">{feedback[0].from}</span>
            <span className="text-yellow-500 ml-1">★{feedback[0].rating}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-1">
          {isActuallyConnected ? (
            <button
              disabled
              className="w-full px-3 py-1.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded font-semibold text-xs cursor-default transition-all"
            >
              ✓ Connected
            </button>
          ) : isActuallyPending ? (
            <button
              disabled
              className="w-full px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded font-semibold text-xs cursor-default transition-all"
            >
              ⏳ Pending
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={sending}
              className="w-full px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded font-semibold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "Sending..." : "Connect"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
