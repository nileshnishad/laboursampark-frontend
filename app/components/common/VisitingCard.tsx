"use client";

import React from "react";
import { useSelector } from "react-redux";
import { getToken } from "@/lib/api-service";
import { 
  Building2, 
  User, 
  MapPin, 
  Briefcase, 
  Star, 
  CheckCircle2, 
  ArrowRight,
  Phone,
  Mail,
  Trophy
} from "lucide-react";
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
  const rawLocation = contractor.city || contractor.location || "Not specified";
  let location = "Not specified";
  if (typeof rawLocation === "string") {
    location = rawLocation;
  } else if (typeof rawLocation === "object" && rawLocation !== null) {
    location = [rawLocation.address, rawLocation.city, rawLocation.state, rawLocation.pincode]
      .filter(Boolean)
      .join(", ") || "Not specified";
  }
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
    setIsModalOpen(true);
    if (onViewProfile) {
      onViewProfile(contractor._id || contractor.id || "");
    }
  };

  return (
    <div
      className={`group relative min-w-[280px] h-[200px] mx-auto overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl transition-all duration-300 hover:shadow-2xl ${className}`}
    >
      {/* Business Card Texture */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
        style={{ backgroundImage: "linear-gradient(45deg, #10b981 1px, transparent 1px), linear-gradient(-45deg, #10b981 1px, transparent 1px)", backgroundSize: "20px 20px" }} 
      />

      {/* Decorative Brand Accent */}
      <div className="absolute top-0 right-0 w-32 h-full bg-emerald-500/5 -skew-x-12 translate-x-16 pointer-events-none" />

      <div className="relative z-10 p-6 h-full flex flex-col justify-between">
        {/* Main Brand Section */}
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
             <h3 className="text-xl font-black text-slate-900 dark:text-white truncate tracking-tight uppercase group-hover:text-emerald-600 transition-colors">
                {companyName || name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-0.5 w-8 bg-emerald-500 rounded-full" />
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{type}</span>
              </div>
          </div>
          
          {/* Logo - Circular Brand Mark */}
          <div className="shrink-0 ml-4">
            <div className="h-14 w-14 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 flex items-center justify-center p-0.5 overflow-hidden">
               {profilePic ? (
                <img src={profilePic} alt={name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <Building2 className="h-6 w-6 text-emerald-500" />
              )}
            </div>
          </div>
        </div>

        {/* Professional Details Section */}
        <div className="grid grid-cols-2 gap-4 items-end">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700 dark:text-slate-300">
              <User className="h-3 w-3 text-emerald-500" />
              <span className="truncate">{name}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
              <Phone className="h-3 w-3" />
              <span className="font-mono tracking-tighter">{displayPhone}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{location}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
             <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-700">
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                <span className="text-xs font-black text-slate-900 dark:text-white">{rating || "4.5"}</span>
             </div>
             <button 
                onClick={handleViewProfile}
                className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 uppercase tracking-tighter"
             >
                BUSINESS PROFILE <ArrowRight className="h-3 w-3" />
             </button>
          </div>
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
