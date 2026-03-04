"use client";

import React from "react";

interface LabourCardProps {
  labour: any;
  isConnected?: boolean;
  isPending?: boolean;
  onConnect?: (labourId: string) => void;
}

export default function LabourCard({
  labour,
  onConnect,
}: LabourCardProps) {
  const [sending, setSending] = React.useState(false);

  // Determine connection status based on labour.status
  const isActuallyConnected = labour.status === "connected";
  const isActuallyPending = labour.status === "pending";

  const name = labour.fullName || labour.name || "Labour";
  const userType = labour.userType || "Not specified";

  const experience = labour.experience || labour.experienceRange || "Not specified";
  const phone = labour.mobile || labour.phone || "N/A";
  const email = labour.email || "N/A";
  const rating = labour.rating || 4.5;
  const completedJobs = labour.completedJobs || labour.projects || 0;
  const skills = labour.skills || [];
  const available = labour.availability !== undefined ? labour.availability : (labour.available !== undefined ? labour.available : true);
  const verified = labour.aadharVerified || labour.verified || false;
  const profilePic = labour.profilePic || labour.profilePhotoUrl || "";
  const feedback = labour.feedback || [];
  const bio = labour.bio || "";

  const handleConnect = async () => {
    if (onConnect) {
      setSending(true);
      await onConnect(labour._id || labour.id);
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
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-blue-200 dark:border-blue-700 flex flex-col">
      {/* Header Bar */}
      <div className="h-1 bg-linear-to-r from-blue-600 to-blue-400"></div>

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
                <span title="Verified" className="text-blue-500 text-xs shrink-0">
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
                  {available ? "✓ Available" : "✗ Unavailable"} {userType && `- ${userType}`}
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
                className="w-16 h-16 rounded-lg object-cover border border-blue-300 shadow-md"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg border border-blue-300 shadow-md">
                {getInitials(name)}
              </div>
            )}
          </div>
        </div>

        {/* Skills Row */}
        {skills.length > 0 && (
          <div className="pt-1">
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 3).map((s: string) => (
                <span
                  key={s}
                  className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs font-medium truncate"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bio Row */}
        {bio && (
          <div className="pt-1">
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 overflow-hidden text-ellipsis">{bio}</p>
          </div>
        )}

        {/* Stats Row */}
        <div className="flex gap-1 pt-1 text-xs">
          <div className="flex-1">
            <span className="text-gray-600 dark:text-gray-400">Rating:</span>
            <span className="text-yellow-600 dark:text-yellow-400 font-bold ml-1">★ {rating}</span>
          </div>
          <div className="flex-1">
            <span className="text-gray-600 dark:text-gray-400">Jobs:</span>
            <span className="text-gray-800 dark:text-gray-200 font-medium ml-1">{completedJobs}</span>
          </div>
          <div className="flex-1">
            <span className="text-gray-600 dark:text-gray-400">Exp:</span>
            <span className="text-gray-800 dark:text-gray-200 font-medium ml-1 truncate">{experience}</span>
          </div>
        </div>

        {/* Feedback */}
        {feedback.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2 text-xs">
            <span className="text-blue-700 dark:text-blue-300 font-semibold">{feedback[0].from}</span>
            <span className="text-yellow-500 ml-1">★{feedback[0].rating}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-1">
          {isActuallyConnected ? (
            <button
              disabled
              className="w-full px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded font-semibold text-xs cursor-default transition-all"
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
              className="w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "Sending..." : "Connect"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
