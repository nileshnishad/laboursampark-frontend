"use client";

import React, { useState } from "react";
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

interface NavItem {
  label: string;
  value: DashboardTabValue;
  icon: string;
  isSubItem?: boolean;
}

interface NavGroup {
  groupLabel?: string;
  groupValue?: DashboardTabValue;
  items: NavItem[];
}

function getNavGroups(userType: DashboardUserType): NavGroup[] {
  if (userType === "labour") {
    return [
      { items: [{ label: "Jobs", value: "jobs", icon: "📋" }] },
      { items: [{ label: "Contractors", value: "contractors", icon: "🏗️" }] },
      { items: [{ label: "History", value: "history", icon: "🕐" }] },
      { items: [{ label: "Profile", value: "profile", icon: "👤" }] },
    ];
  }
  if (userType === "contractor") {
    return [
      { items: [{ label: "Jobs", value: "job_requirements", icon: "📋" }] },
      { items: [{ label: "Contractors", value: "sub_contractors", icon: "🤝" }] },
      { items: [{ label: "Find Labour", value: "labours", icon: "👷" }] },
      { items: [{ label: "History", value: "history", icon: "🕐" }] },
      { items: [{ label: "Profile", value: "profile", icon: "👤" }] },
    ];
  }
  // sub_contractor
  return [
    { items: [{ label: "Jobs", value: "jobs", icon: "📋" }] },
    // { items: [{ label: "Create Jobs", value: "job_requirements", icon: "🛠️" }] },
    { items: [{ label: "Contractors", value: "contractors", icon: "🤝" }] },
    { items: [{ label: "Find Labour", value: "labour_required", icon: "👷" }] },
    { items: [{ label: "History", value: "history", icon: "🕐" }] },
    { items: [{ label: "Profile", value: "profile", icon: "👤" }] },
  ];
}

const COLOR_SCHEMES = {
  labour: {
    active: "bg-blue-600 text-white",
    activeNav: "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400",
    hover: "hover:text-blue-600 dark:hover:text-blue-400",
    dropdownActive: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    dropdownHover: "hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300",
    statusBadge: "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200",
    statusDot: "bg-blue-500",
    profileBorder: "border-blue-500 dark:border-blue-400",
    visibleBadge: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
    visibleDot: "bg-blue-500",
    mobileActive: "bg-blue-600 text-white",
    mobileHover: "hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300",
    mobileSectionText: "text-blue-600 dark:text-blue-400",
  },
  contractor: {
    active: "bg-indigo-600 text-white",
    activeNav: "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400",
    hover: "hover:text-indigo-600 dark:hover:text-indigo-400",
    dropdownActive: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
    dropdownHover: "hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-700 dark:hover:text-indigo-300",
    statusBadge: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200",
    statusDot: "bg-indigo-500",
    profileBorder: "border-indigo-500 dark:border-indigo-400",
    visibleBadge: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300",
    visibleDot: "bg-indigo-500",
    mobileActive: "bg-indigo-600 text-white",
    mobileHover: "hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300",
    mobileSectionText: "text-indigo-600 dark:text-indigo-400",
  },
  sub_contractor: {
    active: "bg-emerald-600 text-white",
    activeNav: "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400",
    hover: "hover:text-emerald-600 dark:hover:text-emerald-400",
    dropdownActive: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    dropdownHover: "hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300",
    statusBadge: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200",
    statusDot: "bg-emerald-500",
    profileBorder: "border-emerald-500 dark:border-emerald-400",
    visibleBadge: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
    visibleDot: "bg-emerald-500",
    mobileActive: "bg-emerald-600 text-white",
    mobileHover: "hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-300",
    mobileSectionText: "text-emerald-600 dark:text-emerald-400",
  },
};

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navGroups = getNavGroups(userType);
  const colors = COLOR_SCHEMES[userType];

  const profileImageUrl =
    user?.companyLogoUrl ||
    user?.profilePhotoUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&rounded=true`;

  const handleNavClick = (value: DashboardTabValue) => {
    onFilterChange(value);
    setSidebarOpen(false);
  };

  // Desktop header nav items — all flat direct buttons, no dropdowns
  const renderDesktopNav = () => {
    const allItems = navGroups.flatMap((group) => group.items);
    return (
      <nav className="flex items-center gap-0.5">
        {allItems.map((item) => (
          <button
            key={item.value}
            onClick={() => handleNavClick(item.value)}
            className={`flex items-center gap-1.5 px-3 py-5 text-sm font-medium transition-colors whitespace-nowrap
              ${
                activeFilter === item.value
                  ? colors.activeNav
                  : `text-gray-600 dark:text-gray-400 ${colors.hover}`
              }
            `}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    );
  };

  // Mobile drawer sidebar content
  const renderMobileSidebar = () => (
    <>
      {/* Profile */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <div className="flex flex-col items-center gap-3 text-center">
          <img
            src={profileImageUrl}
            alt={username}
            className={`w-20 h-20 rounded-full object-cover border-4 ${colors.profileBorder} shadow-lg`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&rounded=true`;
            }}
          />
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm capitalize">
              {username.replace(/-/g, " ")}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{dashboardLabel}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                user?.isBlocked !== true
                  ? colors.statusBadge
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${user?.isBlocked !== true ? colors.statusDot : "bg-gray-500"}`} />
              {user?.isBlocked !== true ? "Active" : "Blocked"}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                user?.display === true
                  ? colors.visibleBadge
                  : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${user?.display === true ? colors.visibleDot : "bg-orange-500"}`} />
              {user?.display === true ? "Visible" : "Hidden"}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-1">
            {group.groupLabel && group.items.length > 1 && (
              <div className="px-3 pt-4 pb-1">
                <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${colors.mobileSectionText}`}>
                  💼 {group.groupLabel}
                </span>
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <button
                  key={item.value}
                  onClick={() => handleNavClick(item.value)}
                  className={`
                    w-full text-left flex items-center gap-2.5 rounded-lg text-sm font-medium transition-colors px-3 py-2.5
                    ${item.isSubItem ? "pl-8" : ""}
                    ${
                      activeFilter === item.value
                        ? colors.mobileActive
                        : `text-gray-700 dark:text-gray-300 ${colors.mobileHover}`
                    }
                  `}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 shrink-0">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ── Desktop Header (lg+) ───────────────────────────────── */}
      <header className="hidden lg:block sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex items-center gap-4 h-16">
            {/* Profile */}
            <div className="flex items-center gap-3 shrink-0">
              <img
                src={profileImageUrl}
                alt={username}
                className={`w-10 h-10 rounded-full object-cover border-2 ${colors.profileBorder}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&rounded=true`;
                }}
              />
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white capitalize leading-tight">
                  {username.replace(/-/g, " ")}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                      user?.isBlocked !== true
                        ? colors.statusBadge
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${user?.isBlocked !== true ? colors.statusDot : "bg-gray-500"}`} />
                    {user?.isBlocked !== true ? "Active" : "Blocked"}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                      user?.display === true
                        ? colors.visibleBadge
                        : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${user?.display === true ? colors.visibleDot : "bg-orange-500"}`} />
                    {user?.display === true ? "Visible" : "Hidden"}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 shrink-0" />

            {/* Nav */}
            <div className="flex-1 overflow-hidden">
              {renderDesktopNav()}
            </div>

            {/* Logout */}
            <button
              onClick={onLogout}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Header ──────────────────────────────────────── */}
      <header className="lg:hidden sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={profileImageUrl}
              alt={username}
              className={`w-10 h-10 rounded-full object-cover border-2 ${colors.profileBorder} shrink-0`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&rounded=true`;
              }}
            />
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white capitalize truncate leading-tight">
                {username.replace(/-/g, " ")}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                    user?.isBlocked !== true
                      ? colors.statusBadge
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${user?.isBlocked !== true ? colors.statusDot : "bg-gray-500"}`} />
                  {user?.isBlocked !== true ? "Active" : "Blocked"}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                    user?.display === true
                      ? colors.visibleBadge
                      : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${user?.display === true ? colors.visibleDot : "bg-orange-500"}`} />
                  {user?.display === true ? "Visible" : "Hidden"}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors shrink-0 ml-2"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── Mobile Drawer ──────────────────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 flex flex-col bg-white dark:bg-gray-800 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Menu</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {renderMobileSidebar()}
          </aside>
        </div>
      )}

      {/* ── Page Body ──────────────────────────────────────────── */}
      {user?.display === false && (
        <div className="px-4 py-3 bg-orange-50 dark:bg-orange-900/20 border-b-2 border-orange-300 dark:border-orange-700">
          <div className="max-w-screen-xl mx-auto flex items-start sm:items-center gap-3">
            <span className="text-xl shrink-0">⚠️</span>
            <div className="flex-1">
              <p className="text-sm text-orange-800 dark:text-orange-200 font-semibold">
                Your profile is{" "}
                <span className="font-bold">
                  hidden from {isLabour ? "Contractors" : userType === "sub_contractor" ? "Contractors" : "Labourers"}
                </span>
                .
              </p>
              <p className="text-xs text-orange-700 dark:text-orange-300 mt-0.5">
                Make payment to make your profile visible and start receiving connections.
              </p>
              <button
                onClick={onGoToPayment}
                className="mt-2 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold text-xs transition-colors"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}

      {searchMeta.showSearch && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3">
          <div className="max-w-screen-xl mx-auto">
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
