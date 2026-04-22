"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import UserProfile from "./components/UserProfile";
import UserDashboardLayout from "./components/UserDashboardLayout";
import { TAB_CONTENT_COMPONENTS } from "./components/TabValueContentMap";
import {
  getSearchMetaForTab,
  getTabsForUserType,
  type DashboardTabValue,
} from "./components/dashboard-tabs-config";
import type { AppDispatch, RootState } from "@/store/store";

type UserType = "labour" | "contractor" | "sub_contractor";

const normalizeUserType = (type: string): UserType => {
  const normalized = type.toLowerCase();
  if (normalized === "sub_contractor" || normalized === "sub-contractor") {
    return "sub_contractor";
  }
  return normalized === "contractor" ? "contractor" : "labour";
};

const getDashboardLabel = (type: UserType): string => {
  if (type === "labour") return "Labour";
  if (type === "sub_contractor") return "Sub-Contractor";
  return "Contractor";
};

export default function UserDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { users: visibleUsers, loading: usersLoading, error: usersError } = useSelector(
    (state: RootState) => state.visibleUsers
  );

  const username = params.username as string;
  const userType = normalizeUserType(params.userType as string);
  const [activeFilter, setActiveFilter] = useState<DashboardTabValue>("jobs");
  const [searchQuery, setSearchQuery] = useState("");

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

 

  useEffect(() => {
    const roleTabs = getTabsForUserType(userType);
    if (roleTabs.length > 0) {
      setActiveFilter(roleTabs[0].value);
    }
  }, [userType]);

  useEffect(() => {
    setSearchQuery("");
  }, [activeFilter]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const isLabour = userType === "labour";
  const dashboardLabel = getDashboardLabel(userType);
  const isProfileView = activeFilter === "profile";
  const searchMeta = getSearchMetaForTab(activeFilter);
  
  // Keep tab logic simple: list users and apply only search filtering.
  let filteredData = visibleUsers;

  // Apply unified search across name, location, and skills
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredData = filteredData.filter((item) => {
      const name = (item.fullName || "").toLowerCase();
      const location = (item.location || item.city || "").toLowerCase();
      const skills = (item.skills || []).map((s: string) => s.toLowerCase()).join(" ");
      
      return (
        name.includes(query) ||
        location.includes(query) ||
        skills.includes(query)
      );
    });
  }

  const tabContentProps = {
    userType,
    usersLoading,
    usersError,
    filteredData,
    onConnect: handleConnect,
  };

  const ActiveTabComponent =
    !isProfileView ? TAB_CONTENT_COMPONENTS[activeFilter as Exclude<DashboardTabValue, "profile">] : null;

  return (
    <UserDashboardLayout
      user={user}
      username={username}
      dashboardLabel={dashboardLabel}
      userType={userType}
      isLabour={isLabour}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      onLogout={handleLogout}
      onGoToPayment={handleGoToPayment}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchMeta={searchMeta}
    >
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-5 pb-6">
        {isProfileView ? (
          <div className="max-w-7xl mx-auto">
            <UserProfile />
          </div>
        ) : (
          ActiveTabComponent ? <ActiveTabComponent {...tabContentProps} /> : null
        )}
      </main>
    </UserDashboardLayout>
  );
}
