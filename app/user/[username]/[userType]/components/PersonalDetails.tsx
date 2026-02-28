"use client";

import React from "react";

type UserType = "labour" | "contractor";

interface PersonalDetailsProps {
  user: any;
  userType: UserType;
}

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

const DetailGrid = ({ title, items }: { title: string; items: DetailItem[] }) => (
  <div className="mt-4 sm:mt-5">
    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2.5">{title}</h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2">
          <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">{item.label}</p>
          <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mt-0.5 wrap-break-word">
            {formatValue(item.value)}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default function PersonalDetails({ user, userType }: PersonalDetailsProps) {
  const contactDetails: DetailItem[] = [
    { label: "Full Name", value: user.fullName },
    { label: "Email", value: user.email },
    { label: "Mobile", value: user.mobile },
    { label: "Location", value: formatLocation(user.location) },
    { label: "Age", value: user.age },
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
        Personal Information
      </h3>

      <DetailGrid title="Contact" items={contactDetails} />
      <DetailGrid title="Professional" items={userType === "labour" ? labourDetails : contractorDetails} />

      {(user.bio || user.about) && (
        <div className="mt-4 sm:mt-5">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2.5">
            {userType === "labour" ? "Bio" : "About"}
          </h4>
          <p className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs sm:text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">
            {(userType === "labour" ? user.bio : user.about) || "Not specified"}
          </p>
        </div>
      )}

      <DetailGrid title="Verification" items={verificationDetails} />
      <DetailGrid title="Account Stats" items={accountStats} />
      <DetailGrid title="Activity" items={activityDetails} />
    </div>
  );
}
