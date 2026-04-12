"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import UpdateProfileModal from "./UpdateProfileModal";
import type { RootState } from "@/store/store";

type UserType = "labour" | "contractor";

type DetailItem = {
  label: string;
  value: any;
};

const formatValue = (value: any): string => {
  if (value === null || value === undefined || value === "") return "Not specified";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "Not specified";
  if (typeof value === "number") return `${value}`;
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const formatLocation = (location: any): string => {
  if (!location) return "Not specified";
  if (typeof location === "string") return location;

  const coordinates = location?.coordinates?.coordinates;
  if (Array.isArray(coordinates) && coordinates.length >= 2) {
    const [lng, lat] = coordinates;
    return `Lat ${lat}, Lng ${lng}`;
  }

  return "Not specified";
};

const CompactGrid = ({ items }: { items: DetailItem[] }) => (
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
    {items.map((item) => (
      <div key={item.label} className="py-2 border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 lg:border-0 lg:bg-zinc-50 dark:lg:bg-zinc-800/30 lg:p-3 lg:rounded-2xl transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800">
        <p className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500 mb-1">{item.label}</p>
        <p className="text-[11px] font-black text-zinc-900 dark:text-white truncate">
          {formatValue(item.value)}
        </p>
      </div>
    ))}
  </div>
);

const CompactSection = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => (
  <details
    open={defaultOpen}
    className="group rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden transition-all duration-300 open:shadow-xl open:shadow-zinc-200/50 dark:open:shadow-none"
  >
    <summary className="cursor-pointer list-none px-6 py-5 text-sm font-black text-zinc-900 dark:text-white flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
        <span className="tracking-tight uppercase tracking-[0.05em]">{title}</span>
      </div>
      <span className="text-zinc-400 transition-transform group-open:rotate-180">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </summary>
    <div className="px-6 pb-6 pt-2 animate-in slide-in-from-top-2 duration-300">{children}</div>
  </details>
);

export default function PersonalDetails() {
  const params = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const userType = params.userType as UserType;
  const [isEditOpen, setIsEditOpen] = useState(false);

  if (!user) {
    return null;
  }

  const basicDetails: DetailItem[] = [
    { label: "Full Name", value: user.fullName },
    { label: "Email", value: user.email },
    { label: "Phone", value: user.mobile },
    { label: "Age", value: user.age },
  ];

  const profileImageUrl = user.profilePhotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || "User")}&background=random&rounded=true`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header Profile Card - Premium Style */}
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-zinc-200/50 dark:shadow-none p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="relative group shrink-0">
            <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-opacity" />
            <img
              src={profileImageUrl}
              alt="Profile"
              className="relative w-32 h-32 rounded-[2.5rem] object-cover border-4 border-white dark:border-zinc-800 shadow-xl"
            />
            <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 text-white rounded-2xl border-4 border-white dark:border-zinc-800 shadow-lg" title="Verified Member">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
               </svg>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left min-w-0">
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight mb-2 truncate">
              {user.fullName || "User Account"}
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
               <div className="px-4 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  {userType === "contractor" ? "Construction Partner" : "Skilled Worker"}
               </div>
               <div className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                  ID: #{user._id?.slice(-6).toUpperCase() || "NEW"}
               </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               <div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-xs font-black text-emerald-500 uppercase tracking-tighter">● Online</p>
               </div>
               <div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Visible</p>
                  <p className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-tighter">{user.display !== false ? 'YES' : 'HIDDEN'}</p>
               </div>
               <div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Availability</p>
                  <p className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-tighter">{user.availability !== false ? 'READY TO WORK' : 'BUSY'}</p>
               </div>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
             <button
              onClick={() => setIsEditOpen(true)}
              className="w-full px-8 py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-all active:scale-95"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <CompactSection title="Contact Information" defaultOpen>
          <CompactGrid items={basicDetails} />
        </CompactSection>

        <CompactSection title={userType === "contractor" ? "Professional Company Profile" : "Work Experience & Skills"} defaultOpen>
          {userType === "contractor" && user.companyLogoUrl && (
            <div className="mb-6 flex items-center gap-4 bg-zinc-50 dark:bg-zinc-800/20 p-4 rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-800 p-2 border border-zinc-200 dark:border-zinc-800 shadow-sm shrink-0">
                <img src={user.companyLogoUrl} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Business Logo</p>
                <p className="text-sm font-black text-zinc-900 dark:text-white truncate uppercase">{user.businessName || "Registered Firm"}</p>
              </div>
            </div>
          )}
          <CompactGrid items={userType === "labour" ? [
             { label: "Experience", value: user.experience },
             { label: "Working Hours", value: user.preferredWorkingHours || user.workingHours },
             { label: "Work Types", value: user.workTypes },
             { label: "Skills", value: user.skills },
             { label: "Service Categories", value: user.serviceCategories },
             { label: "Languages", value: user.preferredLanguages },
          ] : [
             { label: "Business Name", value: user.businessName },
             { label: "Registration", value: user.registrationNumber },
             { label: "Exp Range", value: user.experienceRange },
             { label: "Team Size", value: user.teamSize },
             { label: "Services", value: user.servicesOffered },
             { label: "Coverage", value: user.coverageArea },
          ]} />
        </CompactSection>

        <CompactSection title="Location Presence">
          {user.location && typeof user.location === "object" ? (
            <div className="space-y-6 px-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "City", value: user.location.city },
                  { label: "State", value: user.location.state },
                  { label: "Pincode", value: user.location.pincode },
                  { label: "Country", value: user.location.country },
                ].map(loc => (
                  <div key={loc.label} className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">{loc.label}</p>
                    <p className="text-xs font-black text-zinc-900 dark:text-white uppercase">{loc.value || "NA"}</p>
                  </div>
                ))}
              </div>
              {user.location.address && (
                <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">Street Address</p>
                  <p className="text-xs font-medium text-zinc-900 dark:text-white leading-relaxed">{user.location.address}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-zinc-400 font-bold italic py-4">Detailed location not mapped yet.</p>
          )}
        </CompactSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <CompactSection title="Account Trust & Verification">
              <CompactGrid items={[
                { label: "Identity Verified", value: user.isVerified || user.aadharVerified },
                { label: "Email Status", value: user.emailVerified },
                { label: "Mobile Status", value: user.mobileVerified },
                { label: "Certifications", value: user.licenseVerified },
              ]} />
           </CompactSection>
           <CompactSection title="Performance Overview">
              <CompactGrid items={[
                { label: "Rating Score", value: user.rating },
                { label: "Reviews", value: user.totalReviews },
                { label: "Completed Jobs", value: user.completedJobs },
                { label: "Member Since", value: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : null },
              ]} />
           </CompactSection>
        </div>
      </div>

      <UpdateProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </div>
  );
}
