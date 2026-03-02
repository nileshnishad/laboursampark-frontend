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
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
    {items.map((item) => (
      <div key={item.label} className="px-1 py-1.5">
        <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">{item.label}</p>
        <p className="text-xs font-medium text-gray-900 dark:text-white mt-0.5 wrap-break-word">
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
    className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-900/40"
  >
    <summary className="cursor-pointer list-none px-3 py-2.5 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-100 flex items-center justify-between">
      <span>{title}</span>
      <span className="text-gray-400">▾</span>
    </summary>
    <div className="px-3 pb-3">{children}</div>
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
    { label: "Mobile", value: user.mobile },
    { label: "Age", value: user.age },
  ];

  const otherDetails: DetailItem[] = [
    { label: "Address", value: formatLocation(user.location) },
    { label: "Status", value: user.status },
    { label: "Profile Visible", value: user.display },
    { label: "Available", value: user.availability },
  ];

  const labourDetails: DetailItem[] = [
    { label: "Experience", value: user.experience },
    { label: "Working Hours", value: user.preferredWorkingHours || user.workingHours },
    { label: "Work Types", value: user.workTypes },
    { label: "Skills", value: user.skills },
    { label: "Service Categories", value: user.serviceCategories },
    { label: "Preferred Languages", value: user.preferredLanguages },
  ];

  const contractorDetails: DetailItem[] = [
    { label: "Business Name", value: user.businessName },
    { label: "Registration Number", value: user.registrationNumber },
    { label: "Experience Range", value: user.experienceRange },
    { label: "Team Size", value: user.teamSize },
    { label: "Services Offered", value: user.servicesOffered },
    { label: "Coverage Area", value: user.coverageArea },
  ];

  const verificationDetails: DetailItem[] = [
    { label: "Verified", value: user.isVerified },
    { label: "Email Verified", value: user.emailVerified },
    { label: "Mobile Verified", value: user.mobileVerified },
    { label: "Aadhar Verified", value: user.aadharVerified },
    { label: "PAN Verified", value: user.panVerified },
    { label: "License Verified", value: user.licenseVerified },
  ];

  const accountStats: DetailItem[] = [
    { label: "Rating", value: user.rating },
    { label: "Total Reviews", value: user.totalReviews },
    { label: "Completed Jobs", value: user.completedJobs },
    { label: "Total Earnings", value: user.totalEarnings },
    { label: "Pending Earnings", value: user.pendingEarnings },
    { label: "Withdrawn Earnings", value: user.withdrawnEarnings },
  ];

  const activityDetails: DetailItem[] = [
    { label: "Referral Count", value: user.referralCount },
    { label: "Online", value: user.isOnline },
    { label: "Terms Agreed", value: user.termsAgreed },
    { label: "Created At", value: user.createdAt ? new Date(user.createdAt).toLocaleString() : null },
    { label: "Updated At", value: user.updatedAt ? new Date(user.updatedAt).toLocaleString() : null },
    { label: "Last Login", value: user.lastLogin ? new Date(user.lastLogin).toLocaleString() : null },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-3 sm:p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
          Personal Information
        </h3>
        <button
          onClick={() => setIsEditOpen(true)}
          className="px-2.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
        >
          Update Profile
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 space-y-3">
        <div className="flex items-start gap-3">
          <img
            src={user.profilePhotoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || "User")}&background=random&rounded=true`}
            alt="Profile Picture"
            className="w-16 h-16 rounded-full object-cover border border-gray-200 dark:border-gray-700 shrink-0"
          />
          <div className="flex-1">
            <CompactGrid items={basicDetails} />
          </div>
        </div>
      </div>

      <CompactSection title={userType === "contractor" ? "Company & Professional" : "Professional"} defaultOpen>
        {userType === "contractor" && user.companyLogoUrl && (
          <div className="mb-2 rounded-md border border-gray-200 dark:border-gray-700 p-2 inline-block">
            <p className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Company Logo</p>
            <img
              src={user.companyLogoUrl}
              alt="Company Logo"
              className="w-14 h-14 rounded-md object-cover border border-gray-200 dark:border-gray-700"
            />
          </div>
        )}
        <CompactGrid items={userType === "labour" ? labourDetails : contractorDetails} />
      </CompactSection>

      <CompactSection title="Other Details" defaultOpen>
        <CompactGrid items={otherDetails} />
      </CompactSection>

      {(user.bio || user.about) && (
        <CompactSection title={userType === "labour" ? "Bio" : "About"}>
          <p className="rounded-md border border-gray-200 dark:border-gray-700 px-2.5 py-2 text-xs text-gray-800 dark:text-gray-200 whitespace-pre-line">
            {userType === "labour" ? "Bio" : "About"}
            {": " + ((userType === "labour" ? user.bio : user.about) || "Not specified")}
          </p>
        </CompactSection>
      )}

      <CompactSection title="Verification">
        <CompactGrid items={verificationDetails} />
      </CompactSection>

      <CompactSection title="Account Stats">
        <CompactGrid items={accountStats} />
      </CompactSection>

      <CompactSection title="Activity">
        <CompactGrid items={activityDetails} />
      </CompactSection>

      <UpdateProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </div>
  );
}
