"use client";

import React from "react";

interface AadharLabourCardProps {
  labour: any;
}

export default function AadharLabourCard({ labour }: AadharLabourCardProps) {
  const name = labour.fullName || labour.name || "Labour";
  const experience = labour.experience || labour.experienceRange || "Not specified";
  const phone = labour.mobile || labour.phone || "N/A";
  const email = labour.email || "N/A";
  const location = typeof labour.location === "string" ? labour.location : labour.location?.address || "Not specified";
  const workingHours = labour.preferredWorkingHours || labour.workingHours || "Flexible";
  const rating = labour.rating || 4.5;
  const completedJobs = labour.completedJobs || labour.projects || 0;
  const skills = labour.skills || [];
  const workTypes = labour.workTypes || labour.workType || [];
  const available = labour.availability !== undefined ? labour.availability : (labour.available !== undefined ? labour.available : true);
  const verified = labour.aadharVerified || labour.verified || false;
  const profilePic = labour.profilePic || labour.profilePhotoUrl || "";
  const feedback = labour.feedback || [];
  const bio = labour.bio || "";

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-blue-200 sm:border-2 dark:border-blue-700 h-full flex flex-col">
      {/* Header Bar */}
      <div className="h-1 sm:h-2 bg-linear-to-r from-blue-600 to-blue-400"></div>

      {/* Card Content */}
      <div className="p-3 sm:p-6 flex flex-col h-full">
        {/* Top Section - Avatar and Main Info */}
        <div className="flex gap-3 sm:gap-5 mb-3 sm:mb-5">
          {/* Avatar */}
          <div className="shrink-0">
            {profilePic ? (
              <img
                src={profilePic}
                alt={name}
                className="w-14 sm:w-20 h-14 sm:h-20 rounded-lg object-cover border border-blue-300 sm:border-2 shadow-md"
              />
            ) : (
              <div className="w-14 sm:w-20 h-14 sm:h-20 rounded-lg bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl sm:text-2xl border border-blue-300 sm:border-2 shadow-md">
                {getInitials(name)}
              </div>
            )}
          </div>

          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 sm:gap-2 mb-0.5">
              <h3 className="text-sm sm:text-lg font-bold text-gray-800 dark:text-white truncate">
                {name}
              </h3>
              {verified && (
                <span title="Verified" className="text-blue-500 text-sm sm:text-lg shrink-0">
                  ✔️
                </span>
              )}
            </div>
            <div className="text-blue-700 dark:text-blue-300 font-semibold text-xs sm:text-sm mb-0.5 truncate">
              {experience}
            </div>
            {location && (
              <div className="text-gray-500 dark:text-gray-400 text-xs truncate">
                {location}
              </div>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">
              <strong>Rating:</strong>
            </span>
            <span className="text-yellow-600 dark:text-yellow-400 font-bold">★ {rating}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">
              <strong>Jobs Done:</strong>
            </span>
            <span className="text-gray-800 dark:text-gray-200 font-medium">{completedJobs}</span>
          </div>
        </div>

        {/* Bio */}
        {bio && (
          <div className="mb-3 sm:mb-4">
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{bio}</p>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <div className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-1 sm:mb-2">
              Skills
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {skills.slice(0, 2).map((s: string) => (
                <span
                  key={s}
                  className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Work Types */}
        {workTypes.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              Work Types
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {workTypes.slice(0, 2).map((w: string) => (
                <span
                  key={w}
                  className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium"
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-0.5 sm:space-y-1 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="text-xs">
            <span className="text-gray-600 dark:text-gray-400">
              <strong>Phone:</strong>
            </span>
            <span className="text-gray-800 dark:text-gray-200 ml-1 sm:ml-2 text-xs">{phone}</span>
          </div>
          <div className="text-xs">
            <span className="text-gray-600 dark:text-gray-400">
              <strong>Email:</strong>
            </span>
            <span className="text-gray-800 dark:text-gray-200 ml-1 sm:ml-2 truncate text-xs">
              {email}
            </span>
          </div>
          <div className="text-xs">
            <span className="text-gray-600 dark:text-gray-400">
              <strong>Hours:</strong>
            </span>
            <span className="text-gray-800 dark:text-gray-200 ml-1 sm:ml-2 text-xs">
              {workingHours}
            </span>
          </div>
          <div className="text-xs">
            <span className="text-gray-600 dark:text-gray-400">
              <strong>Available:</strong>
            </span>
            <span
              className={`ml-1 sm:ml-2 font-medium text-xs ${
                available
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {available ? "Yes" : "No"}
            </span>
          </div>
        </div>

        {/* Feedback */}
        {feedback.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
            <div className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-1">
              Recent Feedback
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
              <span className="font-semibold text-blue-700 dark:text-blue-300">
                {feedback[0].from}
              </span>
              <span className="text-yellow-500 ml-1">★{feedback[0].rating}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
