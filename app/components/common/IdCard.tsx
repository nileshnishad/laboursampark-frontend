"use client";

import React from "react";
import { useSelector } from "react-redux";
import { getToken } from "@/lib/api-service";
import UserProfileModal from "./UserProfileModal";
import type { RootState } from "@/store/store";
import { Star, MapPin, Briefcase, CheckCircle, ShieldCheck, Phone, Mail, ArrowRight } from "lucide-react";

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
  onConnect,
  onViewProfile,
  className = "",
}: IDCardProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [sending, setSending] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    setIsLoggedIn(Boolean(getToken()));
  }, []);

  const name = labour.fullName || labour.name || "Labour";
  const experience = labour.experience || labour.experienceRange || "N/A";
  const phone = labour.mobile || labour.phone || "N/A";
  const email = labour.email || "N/A";
  const rawLocation = labour.location || labour.address || labour.city || "N/A";
  let location = "N/A";
  if (typeof rawLocation === "string") {
    location = rawLocation;
  } else if (typeof rawLocation === "object" && rawLocation !== null) {
    location = [rawLocation.address, rawLocation.city].filter(Boolean).join(", ") || "N/A";
  }
  const rating = labour.rating || 4.5;
  const completedJobs = labour.completedJobs || labour.projects || 0;
  const skills = Array.isArray(labour.skills) ? labour.skills : [];
  const available =
    labour.availability !== undefined
      ? labour.availability
      : labour.available !== undefined
        ? labour.available
        : true;
  const verified = labour.aadharVerified || labour.verified || false;
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
      className={`group relative w-[260px] h-[380px] mx-auto overflow-hidden rounded-[2rem] border-4 border-white dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-2xl transition-all duration-300 hover:scale-[1.02] ${className}`}
    >
      {/* ID Card "Lanyard" Hole */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full z-20 shadow-inner" />

      {/* Header Banner - Identity Focus */}
      <div className="h-20 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -mr-14 -mt-14 blur-2xl" />
        <div className="absolute flex flex-col items-center justify-center inset-0 pt-3">
           <h2 className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em]">Worker Identity Card</h2>
        </div>
      </div>

      <div className="relative z-10 px-5 -mt-12 flex flex-col items-center">
        {/* Profile Picture - Centered ID Style */}
        <div className="relative mb-2 group-hover:rotate-0 transition-transform duration-500">
          <div className="w-18 h-18 rounded-2xl bg-white dark:bg-slate-900 p-0.5 shadow-2xl border border-blue-100 dark:border-slate-700">
            {profilePic ? (
              <img
                src={profilePic}
                alt={name}
                className="w-full h-full rounded-xl object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl">
                {getInitials(name)}
              </div>
            )}
          </div>
          {verified && (
            <div className="absolute -bottom-1 -right-1 bg-blue-600 p-1 rounded-lg shadow-lg border border-white">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Name & Basic Info */}
        <div className="text-center mb-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1">
            {name}
          </h3>
          <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 font-bold text-[10px] mt-0.5">
            <Briefcase className="w-3 h-3" />
            <span>{experience} Exp</span>
          </div>
        </div>

        {/* Masked Contact Info */}
        <div className="w-full flex flex-col gap-1 mb-3 px-2">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Phone className="w-3 h-3 text-blue-500" />
            <span className="text-[10px] font-mono tracking-wider">{displayPhone}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Mail className="w-3 h-3 text-blue-500" />
            <span className="text-[10px] font-mono tracking-wider lowercase truncate">{displayEmail}</span>
          </div>
        </div>

        {/* Verified Data Grid */}
        <div className="w-full grid grid-cols-2 gap-2 mb-3">
          <div className="bg-white dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center">
            <div className="flex items-center gap-0.5 text-amber-500">
              <Star className="w-2.5 h-2.5 fill-amber-500" />
              <span className="text-[11px] font-black">{rating}</span>
            </div>
            <span className="text-[8px] font-bold text-slate-400 uppercase">Rating</span>
          </div>
          <div className="bg-white dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center">
            <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">{completedJobs}</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase">Jobs Done</span>
          </div>
        </div>

        {/* Location & Contact - Small Identity details */}
        <div className="w-full space-y-1.5 mb-4 text-center">
           <div className="flex items-center justify-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
              <MapPin className="w-3 h-3" />
              <span className="truncate max-w-[150px]">{location}</span>
            </div>
            <div className={`px-3 py-1 rounded-full inline-block text-[8px] font-black uppercase tracking-[0.15em] ${available ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {available ? 'Status: Available' : 'Status: Busy'}
            </div>
        </div>

        {/* Primary Action */}
        <button
          onClick={handleViewProfile}
          className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-[10px] tracking-[0.15em] shadow-lg hover:shadow-xl active:scale-95 transition-all"
        >
          VIEW FULL ID DETAILS
        </button>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-3 left-0 right-0 text-center opacity-20">
        <span className="text-[7px] font-bold uppercase tracking-[0.5em] text-slate-500">Labour Sampark Verified</span>
      </div>


      {/* Modal removed from card, handled by parent */}
    </div>
  );
}
