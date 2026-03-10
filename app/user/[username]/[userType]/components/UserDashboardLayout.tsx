"use client";

import React from "react";
import FilterMenu from "./FilterMenu";
import UnifiedSearchInput from "@/app/components/common/UnifiedSearchInput";
import type { DashboardSearchMeta, DashboardTabValue, DashboardUserType } from "./dashboard-tabs-config";

interface UserDashboardLayoutProps {
  user: any;
  username: string;
  dashboardLabel: string;
  userType: DashboardUserType;
  isLabour: boolean;
  activeFilter: DashboardTabValue;
  onFilterChange: (tab: DashboardTabValue) => void;
  onLogout: () => void;
  onGoToPayment: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchMeta: DashboardSearchMeta;
  children: React.ReactNode;
}

export default function UserDashboardLayout({
  user,
  username,
  dashboardLabel,
  userType,
  isLabour,
  activeFilter,
  onFilterChange,
  onLogout,
  onGoToPayment,
  searchQuery,
  onSearchChange,
  searchMeta,
  children,
}: UserDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-50 py-2">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20">
          <div className="flex h-full justify-between items-start sm:items-center gap-2 sm:gap-3">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="shrink-0">
                <img
                  src={user?.companyLogoUrl || user?.profilePhotoUrl || `https://ui-avatars.com/api/?name=${username}&background=random&rounded=true`}
                  alt={username}
                  className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-blue-600 dark:border-blue-400 shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${username}&background=random&rounded=true`;
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate leading-tight">
                  {dashboardLabel} Dashboard
                </h1>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className="text-xs text-gray-600 dark:text-gray-400 capitalize truncate leading-tight">
                    Welcome, {username.replace(/-/g, " ")}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5">
                  <div className="flex items-center gap-0.5 sm:gap-1" title="Your account status with the platform">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 sm:inline">Account:</span>
                    <span className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-help ${
                      user?.isBlocked !== true
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                    }`}>
                      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${
                        user?.isBlocked !== true ? "bg-blue-600 dark:bg-blue-400" : "bg-gray-600 dark:bg-gray-500"
                      }`}></span>
                      <span className="hidden sm:inline">{user?.isBlocked !== true ? "Active" : "Blocked"}</span>
                      <span className="sm:hidden">{user?.isBlocked !== true ? "Active" : "B"}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-0.5 sm:gap-1" title="Your account status with the platform">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 sm:inline">Profile:</span>
                    <span className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-help ${
                      user?.isBlocked !== true
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                    }`}>
                      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${
                        user?.isBlocked !== true ? "bg-blue-600 dark:bg-blue-400" : "bg-gray-600 dark:bg-gray-500"
                      }`}></span>
                      <span className="hidden sm:inline">{user?.display === true ? "Visible" : "Hidden"}</span>
                      <span className="sm:hidden">{user?.display === true ? "Visible" : "Hidden"}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-red-600 text-white rounded-lg font-semibold text-xs sm:text-sm hover:bg-red-700 transition-all whitespace-nowrap shrink-0"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="sticky shadow-lg top-20 sm:top-22 z-40 w-full px-3 sm:px-12 lg:px-8 py-2 sm:py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <FilterMenu
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
          userType={userType}
        />
      </div>

      {user?.display === false && (
        <div className="px-3 sm:px-6 lg:px-8 py-3 sm:py-4 border-b-2 bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700">
          <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-2 sm:gap-3">
            <span className="text-lg sm:text-xl shrink-0">⚠️</span>
            <div className="flex-1">
              <div>
                <p className="text-xs sm:text-sm text-orange-800 dark:text-orange-200 font-semibold">
                  Your profile is <span className="font-bold">hidden from {isLabour ? "Contractors" : userType === "sub_contractor" ? "Contractors" : "Labourers"}</span>.
                </p>
                <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                  Make payment to make your profile visible and start receiving connections.
                </p>
                <button
                  onClick={onGoToPayment}
                  className="mt-2 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold text-xs sm:text-sm transition-colors"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {searchMeta.showSearch && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-12 lg:px-8 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto sm:px-10">
            <UnifiedSearchInput
              value={searchQuery}
              onChange={onSearchChange}
              label={`🔍 ${searchMeta.label}`}
              placeholder={searchMeta.placeholder}
            />
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
