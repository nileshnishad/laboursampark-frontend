"use client";

import React from "react";

type UserType = "labour" | "contractor";

interface PersonalDetailsProps {
  user: any;
  userType: UserType;
}

export default function PersonalDetails({ user, userType }: PersonalDetailsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
        Personal Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              Full Name
            </label>
            <p className="text-xs sm:text-sm text-gray-900 dark:text-white font-medium truncate">
              {user.fullName || "Not specified"}
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              Email
            </label>
            <p className="text-xs sm:text-sm text-gray-900 dark:text-white font-medium truncate">
              {user.email || "Not specified"}
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              Mobile
            </label>
            <p className="text-xs sm:text-sm text-gray-900 dark:text-white font-medium">
              {user.mobile || "Not specified"}
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              Location
            </label>
            <p className="text-gray-900 dark:text-white font-medium">
              {typeof user.location === "string" ? user.location : "Not specified"}
            </p>
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-4">
          {userType === "labour" && (
            <>
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Experience
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {user.experience || "Not specified"}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Preferred Working Hours
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {user.preferredWorkingHours || "Not specified"}
                </p>
              </div>
            </>
          )}

          {userType === "contractor" && (
            <>
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Business Name
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {user.businessName || "Not specified"}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Registration Number
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {user.registrationNumber || "Not specified"}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Experience Range
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {user.experienceRange || "Not specified"}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Team Size
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {user.teamSize || "Not specified"}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Skills/Services */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        {userType === "labour" && (
          <>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Skills</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {user.skills && user.skills.length > 0 ? (
                user.skills.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 italic">No skills added</p>
              )}
            </div>
          </>
        )}

        {userType === "contractor" && (
          <>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              Services Offered
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {user.servicesOffered && user.servicesOffered.length > 0 ? (
                user.servicesOffered.map((service: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium"
                  >
                    {service}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 italic">No services added</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Work Types/Coverage Area */}
      {((userType === "labour" && user.workTypes?.length > 0) ||
        (userType === "contractor" && user.coverageArea?.length > 0)) && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          {userType === "labour" && (
            <>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                Work Types
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.workTypes && user.workTypes.length > 0 ? (
                  user.workTypes.map((type: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium"
                    >
                      {type}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No work types added</p>
                )}
              </div>
            </>
          )}

          {userType === "contractor" && (
            <>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                Coverage Area
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.coverageArea && user.coverageArea.length > 0 ? (
                  user.coverageArea.map((area: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium"
                    >
                      {area}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No coverage areas added</p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Bio/About */}
      {(user.bio || user.about) && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            {userType === "labour" ? "Bio" : "About"}
          </label>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            {(userType === "labour" ? user.bio : user.about) || "Not specified"}
          </p>
        </div>
      )}

      {/* Account Status */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Status</p>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400 capitalize">
              {user.status}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Verified</p>
            <p className="text-sm font-semibold">
              {user.isVerified ? (
                <span className="text-green-600">✓ Yes</span>
              ) : (
                <span className="text-red-600">✗ No</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
            <p className="text-sm font-semibold text-yellow-600">{user.rating} / 5 ⭐</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Jobs Completed</p>
            <p className="text-sm font-semibold">{user.completedJobs}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
