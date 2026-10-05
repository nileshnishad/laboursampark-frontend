"use client";

import React from "react";
import { useSelector } from "react-redux";
import { getToken } from "@/lib/api-service";
import type { RootState } from "@/store/store";
import { Star, MapPin, Briefcase, ShieldCheck, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";

interface IDCardProps {
  labour: any;
  isConnected?: boolean;
  isPending?: boolean;
  onConnect?: (labourId: string) => void;
  onViewProfile?: (labourId: string) => void;
  className?: string;
}


export default function IDCard({
  labour,
  onViewProfile,
  className = "",
}: IDCardProps) {
  const { t } = useLanguage();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    setIsLoggedIn(Boolean(getToken()));
  }, []);

  const name = labour.fullName || labour.name || t("labour.title", {}, "Labour");
  const experience = labour.experience || labour.experienceRange || "N/A";
  const phone = labour.mobile || labour.phone || "N/A";
  const email = labour.email || "N/A";
  const rawLocation = labour.location || labour.address || labour.city || t("not_specified", {}, "N/A");
  let location = "N/A";
  if (typeof rawLocation === "string") {
    location = rawLocation;
  } else if (typeof rawLocation === "object" && rawLocation !== null) {
    location = [rawLocation.address, rawLocation.city].filter(Boolean).join(", ") || t("not_specified", {}, "N/A");
  }
  const rating = labour.rating;
  const hasRating = rating !== undefined && rating !== null && rating !== "";
  const completedJobs = labour.completedJobs || labour.projects || 0;
  const allSkills = useSelector((state: RootState) => state.skills.skills);
  const rawSkills = Array.isArray(labour.skills)
    ? labour.skills
    : Array.isArray(labour.workTypes)
      ? labour.workTypes
      : [];

  const isLikelyId = (value: string) => /^[a-f0-9]{24}$/i.test(value);
  const resolveSkillLabel = (value: any) => {
    if (typeof value !== "string") return "";

    const matched = allSkills.find(
      (skill: any) => skill?.id === value || skill?._id === value
    );

    if (matched) {
      return matched.enName || matched.hiName || matched.mrName || "";
    }

    // If backend sends a Mongo/Object-like ID and lookup misses, avoid showing raw ID in UI.
    if (isLikelyId(value)) return "";

    return value;
  };

  const displaySkills = rawSkills
    .map(resolveSkillLabel)
    .filter((skill: string, index: number, arr: string[]) => Boolean(skill) && arr.indexOf(skill) === index);

  const primarySkill = displaySkills[0] || labour.primarySkill || labour.trade || "Skilled Worker";
  const extraSkillsCount = Math.max(displaySkills.length - 1, 0);
  const available =
    labour.availability !== undefined
      ? labour.availability
      : labour.available !== undefined
        ? labour.available
        : true;
  const isTrueLike = (value: any) => value === true || value === "true" || value === 1 || value === "1";
  const verified =
    isTrueLike(labour.aadharVerified) ||
    isTrueLike(labour.mobileVerified) ||
    isTrueLike(labour.isMobileVerified) ||
    isTrueLike(labour.verified);
  const profilePic = labour.profilePic || labour.profilePhotoUrl || "";

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

  const canViewContact = isLoggedIn && user?.display !== false;
  const displayPhone = canViewContact ? phone : maskPhone(phone);
  const displayEmail = canViewContact ? email : maskEmail(email);
  const callablePhone = canViewContact && phone !== "N/A" ? phone.replace(/[^\d+]/g, "") : "";
  const emailableEmail = canViewContact && email !== "N/A" && email.includes("@") ? email : "";

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Only call onViewProfile, let parent handle modal
  const handleViewProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewProfile) {
      onViewProfile(labour);
    }
  };

  return (
    <div
      className={`group relative w-full max-w-[320px] mx-auto overflow-hidden rounded-2xl border border-blue-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${className}`}
    >
      <div className="p-2">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] leading-none font-semibold ${
              available
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                : "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${available ? "bg-emerald-500" : "bg-orange-500"}`}></span>
            {available ? t("available", {}, "Available") : t("busy", {}, "Busy")}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] leading-none font-semibold text-slate-700 dark:text-slate-200">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            {verified ? t("common.verified", {}, "Verified") : t("common.notVerified", {}, "Unverified")}
          </span>
        </div>

        <div className="flex items-start gap-2.5 mb-2.5">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-blue-100 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
            {profilePic ? (
              <img
                src={profilePic}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl">
                {getInitials(name)}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm leading-tight font-black text-slate-900 dark:text-white line-clamp-1">
              {name}
            </h3>
            <div className="mt-1.5 flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <span className="text-xs leading-tight font-semibold truncate">{primarySkill}</span>
              {extraSkillsCount > 0 && (
                <span className="rounded-full bg-blue-50 px-1 py-0.5 text-[10px] leading-none font-semibold dark:bg-blue-900/30">
                  +{extraSkillsCount}
                </span>
              )}
            </div>
            <div className="mt-0.5 space-y-1 text-[10px] leading-tight text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-500" />
                <span className="truncate">{location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                <span>{experience} {t("experience_years", {}, "Exp.")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 px-1.5 py-1 mb-2">
          <div className="grid grid-cols-2 divide-x divide-slate-200 dark:divide-slate-700">
            <div className="flex items-center justify-center gap-1 px-0.5 text-slate-900 dark:text-white">
              <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-bold leading-none">{hasRating ? rating : "N/A"}</span>
              <span className="text-[9px] font-medium leading-none text-slate-600 dark:text-slate-300">{t("rating_label", {}, "Rating")}</span>
            </div>
            <div className="flex items-center justify-center gap-1 px-0.5 text-slate-900 dark:text-white">
              <span className="text-[11px] font-bold leading-none">{completedJobs}</span>
              <span className="text-[9px] font-medium leading-none text-slate-600 dark:text-slate-300">{t("my_jobs", {}, "Jobs Done")}</span>
            </div>
          </div>
        </div>

        <div className="mb-2.5 flex items-center gap-1.5 rounded-lg border border-blue-100 dark:border-slate-700 px-2 py-1.5 text-[10px] text-slate-600 dark:text-slate-300">
          <div className="min-w-0 flex items-center gap-1">
            <Phone className="h-3 w-3 shrink-0 text-slate-500" />
            {callablePhone ? (
              <a href={`tel:${callablePhone}`} className="truncate hover:text-blue-600 dark:hover:text-blue-300">
                {displayPhone}
              </a>
            ) : (
              <span className="truncate">{displayPhone}</span>
            )}
          </div>
          <span className="text-slate-300">|</span>
          <div className="min-w-0 flex items-center gap-1">
            <Mail className="h-3 w-3 shrink-0 text-slate-500" />
            {emailableEmail ? (
              <a href={`mailto:${emailableEmail}`} className="truncate hover:text-blue-600 dark:hover:text-blue-300">
                {displayEmail}
              </a>
            ) : (
              <span className="truncate">{displayEmail}</span>
            )}
          </div>
        </div>

        <button
          onClick={handleViewProfile}
          className="w-full rounded-lg border border-blue-300 dark:border-blue-600 py-1.5 text-xs leading-none font-semibold text-blue-600 dark:text-blue-300 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-[0.99]"
        >
          {t("view_details", {}, "View Details")}
        </button>
      </div>

      {/* Modal removed from card, handled by parent */}
    </div>
  );
}
