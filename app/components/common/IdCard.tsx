"use client";

import React from "react";
import UserProfileModal from "./UserProfileModal";

interface IDCardProps {
  labour: any;
  isConnected?: boolean;
  isPending?: boolean;
  onConnect?: (labourId: string) => void;
  onViewProfile?: (labourId: string) => void;
  className?: string;
}

export default function IDCard({
  labour,
  onConnect,
  onViewProfile,
  className = "",
}: IDCardProps) {

  const [sending, setSending] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const name = labour.fullName || labour.name || "Labour";
  const experience =
    labour.experience || labour.experienceRange || "Not specified";
  const phone = labour.mobile || labour.phone || "N/A";
  const email = labour.email || "N/A";
  const rawLocation = labour.location || labour.address || labour.city || "N/A";
  const location =
    typeof rawLocation === "string"
      ? rawLocation
      : rawLocation?.address || rawLocation?.city || "N/A";
  const rating = labour.rating || 4.5;
  const completedJobs = labour.completedJobs || labour.projects || 0;
  const skills = labour.skills || [];
  const available =
    labour.availability !== undefined
      ? labour.availability
      : labour.available !== undefined
        ? labour.available
        : true;
  const verified = labour.aadharVerified || labour.verified || false;
  const profilePic = labour.profilePic || labour.profilePhotoUrl || "";
  const feedback = labour.feedback || [];

  const handleConnect = async () => {
    if (onConnect) {
      setSending(true);
      await onConnect(labour._id || labour.id);
      setSending(false);
    }
  };

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(labour._id || labour.id);
      return;
    }
    setIsModalOpen(true);
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className={`w-full bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-blue-200 dark:border-blue-700 flex flex-col ${className}`}
    >
      {/* Header Bar */}
      <div className="h-1 bg-linear-to-r from-blue-600 to-blue-400"></div>

      {/* ID Card Style Content - Vertical Layout - Compact */}
      <div className="p-1 sm:p-1 flex flex-col items-center space-y-1">
        {/* Photo Section */}
        <div className="shrink-0">
          {profilePic ? (
            <img
              src={profilePic}
              alt={name}
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-300 shadow-md"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg border-2 border-blue-300 shadow-md">
              {getInitials(name)}
            </div>
          )}
        </div>

        {/* Name and Verification */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-0.5">
            <h3 className="text-xs font-bold text-gray-800 dark:text-white truncate">
              {name}
            </h3>
            {verified && (
              <span title="Verified" className="text-blue-500 text-xs shrink-0">
                ✔️
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200 dark:bg-gray-700"></div>

        {/* Contact Info */}
        <div className="w-full text-xs text-gray-600 dark:text-gray-400 space-y-0.5 text-center">
          <div className="truncate">
            <span className="font-semibold">📧</span> {email}
          </div>
          <div className="truncate">
            <span className="font-semibold">📱</span> {phone}
          </div>
          <div className="truncate">
            <span className="font-semibold">📍</span> {location}
          </div>
          <div className="truncate text-xs">
            <span
              className={`font-semibold ${available ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              {available ? "✓" : "✗"}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200 dark:bg-gray-700"></div>

        {/* Skills Row */}
        {skills.length > 0 && (
          <div className="w-full">
            <div className="text-xs font-bold text-blue-700 dark:text-blue-300 text-center">Skills</div>
            <div className="flex flex-wrap gap-0.5 justify-center">
              {skills.slice(0, 2).map((s: string) => (
                <span
                  key={s}
                  className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs font-medium truncate"
                >
                  {s}
                </span>
              ))}
              {skills.length > 2 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">+{skills.length - 2}</span>
              )}
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="w-full grid grid-cols-3 gap-1 text-xs text-center py-1 bg-gray-50 dark:bg-gray-900/30 rounded px-1">
          <div>
            <div className="text-gray-600 dark:text-gray-400 font-semibold text-xs">Rating</div>
            <div className="text-yellow-600 dark:text-yellow-400 font-bold text-xs">★ {rating}</div>
          </div>
          <div>
            <div className="text-gray-600 dark:text-gray-400 font-semibold text-xs">Jobs</div>
            <div className="text-gray-800 dark:text-gray-200 font-medium text-xs">{completedJobs}</div>
          </div>
          <div>
            <div className="text-gray-600 dark:text-gray-400 font-semibold text-xs">Exp</div>
            <div className="text-gray-800 dark:text-gray-200 font-medium text-xs truncate">{experience.split(" ")[0]}</div>
          </div>
        </div>

        {/* Feedback */}
        {feedback.length > 0 && (
          <div className="w-full bg-blue-50 dark:bg-blue-900/20 rounded p-1.5 text-xs text-center">
            <span className="text-blue-700 dark:text-blue-300 font-semibold text-xs">
              {feedback[0].from}
            </span>
            <span className="text-yellow-500 ml-0.5 text-xs">★{feedback[0].rating}</span>
          </div>
        )}

       
          <div className="w-full pt-1">
            <button
              onClick={handleViewProfile}
              className="w-full px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-xs transition-all"
            >
              View
            </button>
          </div>
       
      </div>

      {/* User Profile Modal */}
      <UserProfileModal 
        user={labour} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
