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
    active: "bg-blue-600 text-white shadow-lg shadow-blue-500/20",
    activeNav: "bg-blue-600 text-white shadow-lg shadow-blue-500/30",
    hover: "hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-100 dark:border-blue-900/30",
    profileBg: "bg-blue-50 dark:bg-blue-900/10",
    profileBorder: "border-blue-200 dark:border-blue-800",
  },
  contractor: {
    active: "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20",
    activeNav: "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30",
    hover: "hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-100 dark:border-indigo-900/30",
    profileBg: "bg-indigo-50 dark:bg-indigo-900/10",
    profileBorder: "border-indigo-200 dark:border-indigo-800",
  },
  sub_contractor: {
    active: "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20",
    activeNav: "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30",
    hover: "hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-100 dark:border-emerald-900/30",
    profileBg: "bg-emerald-50 dark:bg-emerald-900/10",
    profileBorder: "border-emerald-200 dark:border-emerald-800",
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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col lg:flex-row">
      {/* ── Desktop Sidebar (lg+) ────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 sticky top-0 h-screen z-40">
        {/* Brand/Logo Area */}
        <div className="p-4 pb-4">
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-10 h-10 rounded-xl ${colors.active} flex items-center justify-center text-xl font-black italic`}>
              LS
            </div>
            <div>
              <h1 className="text-lg font-black text-zinc-900 dark:text-white leading-none">LabourSampark</h1>
              <span className={`text-[10px] font-black uppercase tracking-widest ${colors.text}`}>
                {userType.replace("_", " ")} Portal
              </span>
            </div>
          </div>

          {/* User Profile Mini Card */}
          <div className={`p-4 rounded-[1.5rem] ${colors.profileBg} border ${colors.profileBorder} mb-6`}>
            <div className="flex items-center gap-3 mb-3">
              <img
                src={profileImageUrl}
                alt={username}
                className="w-10 h-10 rounded-xl object-cover border-2 border-white dark:border-zinc-800 shadow-md"
              />
              <div className="min-w-0">
                <p className="text-xs font-black text-zinc-900 dark:text-white truncate capitalize">
                  {username.split("-").join(" ")}
                </p>
                <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">Verified Member</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter bg-white/80 dark:bg-zinc-800/80 ${colors.text}`}>
                {user?.display !== false ? "Visible" : "Hidden"}
              </div>
              <div className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter bg-emerald-500 text-white">
                Active
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navGroups.flatMap(g => g.items).map((item) => (
            <button
              key={item.value}
              onClick={() => handleNavClick(item.value)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black transition-all duration-200
                ${activeFilter === item.value
                  ? colors.activeNav
                  : `text-zinc-500 dark:text-zinc-400 ${colors.hover}`}
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="tracking-wide">{item.label}</span>
              {activeFilter === item.value && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </button>
          ))}
        </nav>

        {/* Support/Ads Area - Optional compact design */}
        <div className="p-6">


          <button
            onClick={onLogout}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
          >
            <span>Logout</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
            </svg>
          </button>
        </div>
      </aside>

      {/* ── Mobile Header & Sticky Nav (sm/md) ────────────────────── */}
      <div className="lg:hidden sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg ${colors.active} flex items-center justify-center text-sm font-black italic`}>LS</div>
          <div className="flex flex-col">
            <span className="flex items-center gap-1 text-sm font-black text-zinc-900 dark:text-white">
             
              • {username.replace(/-/g, " ")}
            </span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${colors.text}`}>
              {userType.replace("_", " ")} Portal
            </span>
          </div>

        </div>

        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* ── Main Content Area ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-100 dark:bg-zinc-900 overflow-x-hidden">
        {/* Top Fixed Search/Context Bar (Desktop) */}
        <header className="hidden lg:flex items-center justify-between px-10 h-14 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black text-zinc-900 dark:text-white capitalize tracking-tight">
              {activeFilter.split("_").join(" ")}
            </h2>
            <div className="h-6 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-2" />
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
              Welcome back, <span className="text-zinc-900 dark:text-white capitalize">{username.replace(/-/g, " ")}</span>
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="h-6 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
            >
              <span>Logout</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
              </svg>
            </button>
          </div>
        </header>

        {/* Dashboard Dynamic View */}
        <div className="flex-1 px-0 sm:px-0 pt-4 sm:pt-6 lg:pt-8">
          {/* Add margin-top for mobile, and use a subtle background for contrast */}
          <div className="max-w-full mx-auto">
            {children}
          </div>
        </div>
      </div>

      {/* ── Mobile Sidebar Drawer ───────────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-white dark:bg-zinc-900 shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg ${colors.active} flex items-center justify-center text-sm font-black italic text-white`}>LS</div>
                <span className="text-sm font-black text-zinc-900 dark:text-white">Menu</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-2 text-zinc-400"><X size={24} /></button>
            </div>

            <div className="flex-1 px-4 space-y-1">
              {navGroups.flatMap(g => g.items).map((item) => (
                <button
                  key={item.value}
                  onClick={() => handleNavClick(item.value)}
                  className={`
                      w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-black transition-all
                      ${activeFilter === item.value
                      ? colors.activeNav
                      : `text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50`}
                    `}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-4 text-red-500 rounded-2xl text-sm dark:text-whiteuppercase tracking-widest shadow-lg shadow-red-500/20"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Icon Import for mobile drawer
import { X } from "lucide-react";
