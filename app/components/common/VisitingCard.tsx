"use client";

import React from "react";
import { useSelector } from "react-redux";
import { getToken } from "@/lib/api-service";
import ContractorProfileModal from "./ContractorProfileModal";
import type { RootState } from "@/store/store";

interface VisitingCardProps {
  contractor: any;
  isConnected?: boolean;
  isPending?: boolean;
  onConnect?: (contractorId: string) => Promise<void> | void;
  onViewProfile?: (contractorId: string) => void;
  className?: string;
}

export default function VisitingCard({
  contractor,
  onConnect,
  onViewProfile,
  className = "",
}: VisitingCardProps) {
  const { user } = useSelector((state: RootState) => state.auth);

  const [sending, setSending] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    setIsLoggedIn(Boolean(getToken()));
  }, []);

  const name = contractor.fullName || contractor.name || "Business";
  const companyName = contractor.businessName || contractor.companyName || "";
  const type = contractor.userType || contractor.type || "Contractor";
  const rawLocation =
    contractor.city || contractor.location || "Not specified";
  const location =
    typeof rawLocation === "string"
      ? rawLocation
      : rawLocation?.city || rawLocation?.address || "Not specified";
  const rating = contractor.rating || 0;
  const projects = contractor.completedJobs || contractor.projects || 0;
  const phone = contractor.mobile || contractor.phone || "N/A";
  const email = contractor.email || "N/A";
  const profilePic = contractor.companyLogoUrl || contractor.profilePic || contractor.profilePhotoUrl || "";
  const specialization =
    contractor.businessTypes ||
    contractor.servicesOffered ||
    contractor.specialization ||
    contractor.skills ||
    [];
  const specializationList = Array.isArray(specialization)
    ? specialization
    : [specialization].filter(Boolean);
  const experience = contractor.experienceRange || contractor.experience || "N/A";

  const maskPhone = (phoneValue: string) => {
    if (!phoneValue || phoneValue === "N/A") return "N/A";
    const digits = phoneValue.replace(/\D/g, "");
    if (digits.length <= 3) return "xxxxxx";
    return `xxxxxx${digits.slice(-3)}`;
  };

  const maskEmail = (emailValue: string) => {
    if (!emailValue || emailValue === "N/A" || !emailValue.includes("@")) return "N/A";
    const [localPart, domainPart] = emailValue.split("@");
    const lastThree = localPart.slice(-3);
    return `xxxxxx${lastThree}@${domainPart}`;
  };

  // Contact info is visible only when logged in and profile visibility is enabled.
  const canViewContact = isLoggedIn && user?.display !== false;
  const displayPhone = canViewContact ? phone : maskPhone(phone);
  const displayEmail = canViewContact ? email : maskEmail(email);

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleConnect = async () => {
    if (!onConnect) return;

    try {
      setSending(true);
      await onConnect(contractor._id || contractor.id || "");
    } finally {
      setSending(false);
    }
  };

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(contractor._id || contractor.id || "");
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div
      className={`w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm ${className}`}
    >
      <div className="p-1 sm:p-1.5 bg-white dark:bg-gray-900">
        <div className="rounded-lg p-1 bg-white dark:bg-gray-900">
          <div className="flex items-start gap-2.5">
            <div className="w-24 sm:w-28 shrink-0">
              <div className="h-18 sm:h-18 rounded-md bg-linear-to-br from-emerald-50 to-white dark:from-emerald-900/30 dark:to-gray-900 flex items-center justify-center overflow-hidden">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center leading-tight">
                    <p className="text-[11px] font-bold tracking-wide text-emerald-700 dark:text-emerald-300">{getInitials(name)}</p>
                    <p className="text-[9px] text-emerald-600 dark:text-emerald-400">{type}</p>
                  </div>
                )}
              </div>
             
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-red-700 dark:text-red-400 line-clamp-1">
                    {companyName}
                  </h3>
                  <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-1">
                    {name}
                  </p>
                   <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-1">
                    {experience} experience
                  </p>
                </div>
               
              </div>

              <div className="mt-1 border-t border-gray-300 dark:border-gray-600" />
            </div>
          </div>

          <div className="mt-2 rounded-md bg-lime-50 dark:bg-lime-900/20 px-2 py-1 text-[10px] sm:text-[11px] text-center text-gray-800 dark:text-gray-200 leading-4">
            {specializationList.length > 0
              ? specializationList.slice(0, 5).join(" | ")
              : "Planning | Supervision | Estimation"}
          </div>

          <div className="mt-2 grid grid-cols-[1fr_auto] gap-2 items-end">
            <div className="min-w-0 text-[10px] sm:text-[11px] text-gray-700 dark:text-gray-300 leading-4">
              <p className="truncate">
                <span className="font-semibold">Contact:</span> {displayPhone}
              </p>
              <p className="break-all">
                <span className="font-semibold">Email:</span> {displayEmail}
              </p>
              <p className="line-clamp-1">
                <span className="font-semibold">Location:</span> {location}
              </p>
            </div>

            <div className="text-right text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 leading-4">
              <p>
                ★ {rating} | {projects} projects
              </p>
            </div>
          </div>

        
        </div>
         <div className="w-full">
            <button
              onClick={handleViewProfile}
              className="px-2 py-1.5 text-[11px] w-full font-semibold rounded-md  bg-green-600 text-white dark:bg-gray-800 dark:text-gray-100 hover:bg-green-500 dark:hover:bg-gray-700"
            >
              View Profile
            </button>
          </div>
      </div>

      <ContractorProfileModal
        user={contractor}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
