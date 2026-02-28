"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import PersonalDetails from "./components/PersonalDetails";
import ContractorCard from "./components/ContractorCard";
import LabourCard from "./components/LabourCard";
import FilterMenu from "./components/FilterMenu";
import sampleData from "@/data/sample-data.json";
import type { AppDispatch, RootState } from "@/store/store";

type UserType = "labour" | "contractor";
type FilterType = "active" | "pending" | "miscalls" | "connected";

export default function UserDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const username = params.username as string;
  const userType = params.userType as UserType;
  const [activeFilter, setActiveFilter] = useState<FilterType>("active");

  // Get filtered contractors or labourers based on status
  const getFilteredContractors = () => {
    return sampleData.contractors.filter(
      (contractor) => contractor.status === activeFilter
    );
  };

  const getFilteredLabourers = () => {
    return sampleData.labours.filter(
      (labour) => labour.status === activeFilter
    );
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleConnect = async (userId: string) => {
    // TODO: Implement API call to send connection request
    // await dispatch(sendConnectionRequest(userId));
  };

  const handleGoToPayment = () => {
    router.push(`/user/${username}/${userType}/payment`);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const isLabour = userType === "labour";
  const filteredData = isLabour ? getFilteredLabourers() : getFilteredContractors();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-4">
          <div className="flex justify-between items-start sm:items-center gap-2 sm:gap-3">
            {/* Avatar & Text Content */}
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
              {/* Avatar Column */}
              <div className="shrink-0">
                <img
                  src={user?.companyLogoUrl || user?.profilePhotoUrl || `https://ui-avatars.com/api/?name=${username}&background=random&rounded=true`}
                  alt={username}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-blue-600 dark:border-blue-400 shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${username}&background=random&rounded=true`;
                  }}
                />
              </div>

              {/* Text Content Column */}
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate leading-tight">
                  {userType === "labour" ? "Labour" : "Contractor"} Dashboard
                </h1>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 capitalize truncate leading-tight">
                    Welcome, {username.replace(/-/g, " ")}
                  </p>
                  
                </div>

                {/* Account Status & Work Availability */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5">
                  {/* Account Status */}
                  <div className="flex items-center gap-0.5 sm:gap-1" title="Your account status with the platform">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase hidden sm:inline">Acc:</span>
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

                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-red-600 text-white rounded-lg font-semibold text-xs sm:text-sm hover:bg-red-700 transition-all whitespace-nowrap shrink-0"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Profile Visibility Banner - After Header */}
      {user?.display !== undefined && (
        <div className={`sticky top-16 z-40 px-3 sm:px-6 lg:px-8 py-3 sm:py-4 border-b-2 ${
          user?.display === true
            ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
            : "bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700"
        }`}>
          <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-2 sm:gap-3">
            <span className="text-lg sm:text-xl shrink-0">{user?.display === true ? "✓" : "⚠️"}</span>
            <div className="flex-1">
              {user?.display === true && (
                <p className="text-xs sm:text-sm text-green-800 dark:text-green-200 font-semibold">
                  Your profile is <span className="font-bold">visible to {isLabour ? "Contractors" : "Labourers"}</span>. Others can find and connect with you!
                </p>
              )}
              {user?.display === false && (
                <div>
                  <p className="text-xs sm:text-sm text-orange-800 dark:text-orange-200 font-semibold">
                    Your profile is <span className="font-bold">hidden from {isLabour ? "Contractors" : "Labourers"}</span>.
                  </p>
                  <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                    Make payment to make your profile visible and start receiving connections.
                  </p>
                  <button
                    onClick={handleGoToPayment}
                    className="mt-2 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold text-xs sm:text-sm transition-colors"
                  >
                    Pay Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Filter Menu - Visible at Top on Mobile */}
        <FilterMenu
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          userType={userType}
        />

        {/* Responsive Layout: Stack on Mobile, Side-by-Side on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column: Personal Details */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <PersonalDetails user={user} userType={userType} />
          </div>

          {/* Right Column: Browse Contractors/Labourers */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {filteredData.length > 0 ? (
                isLabour ? (
                  // Labour viewing contractors
                  filteredData.map((contractor: any) => (
                    <ContractorCard
                      key={contractor.id}
                      contractor={contractor}
                      onConnect={handleConnect}
                    />
                  ))
                ) : (
                  // Contractor viewing labourers
                  filteredData.map((labour: any) => (
                    <LabourCard key={labour.id} labour={labour} onConnect={handleConnect} />
                  ))
                )
              ) : (
                <div className="sm:col-span-2 text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    No {activeFilter} {isLabour ? "contractors" : "labourers"} found
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
