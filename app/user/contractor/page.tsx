"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import type { AppDispatch, RootState } from "@/store/store";

export default function ContractorPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Contractor Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Message */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Welcome, {user.fullName}! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You are logged in as a Contractor
          </p>
        </div>

        {/* User Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Profile Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Info */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Full Name
                </label>
                <p className="text-gray-900 dark:text-white font-medium">{user.fullName}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Business Name
                </label>
                <p className="text-gray-900 dark:text-white font-medium">{user.businessName}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Email
                </label>
                <p className="text-gray-900 dark:text-white font-medium">{user.email}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Mobile
                </label>
                <p className="text-gray-900 dark:text-white font-medium">{user.mobile}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Location
                </label>
                <p className="text-gray-900 dark:text-white font-medium">{user.location}</p>
              </div>
            </div>

            {/* Professional Info */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Registration Number
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {user.registrationNumber}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Experience Range
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {user.experienceRange}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Team Size
                </label>
                <p className="text-gray-900 dark:text-white font-medium">{user.teamSize}</p>
              </div>

              <div>
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
              </div>
            </div>
          </div>

          {/* Coverage Area */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
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
          </div>

          {/* About */}
          {user.about && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                About
              </label>
              <p className="text-gray-700 dark:text-gray-300 mt-2">{user.about}</p>
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
                <p className="text-sm font-semibold text-yellow-600">
                  {user.rating} / 5 ⭐
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Jobs Completed</p>
                <p className="text-sm font-semibold">{user.completedJobs}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
