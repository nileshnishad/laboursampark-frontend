"use client";

import React, { useState } from "react";
import { 
  Briefcase, 
  MapPin, 
  Users, 
  Calendar, 
  Lock, 
  ChevronRight,
  ShieldCheck,
  ImageIcon,
  X,
  ChevronLeft
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Job {
  _id: string;
  workTitle: string;
  description: string;
  location: string | { address?: string; city?: string; state?: string };
  workersNeeded: number | string;
  budget?: string;
  createdAt: string;
  images?: string[];
  createdBy: {
    fullName: string;
    email: string;
    mobile: string;
  };
}

interface JobCardProps {
  job: Job;
  isLoggedIn: boolean;
}

export default function JobCard({ job, isLoggedIn }: JobCardProps) {
  const router = useRouter();
  const [showGallery, setShowGallery] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  // Mock images if not present for demonstration, since you asked for image support
  const jobImages = job.images || [
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503387762-592dee58c160?q=80&w=800&auto=format&fit=crop"
  ];

  const handleAction = () => {
    // Generate a SEO-friendly search query from the job title
    const searchQuery = encodeURIComponent(job.workTitle);
    
    if (!isLoggedIn) {
      router.push(`/login?redirect=/jobs&search=${searchQuery}`);
    } else {
      // Navigate with search query to improve SEO and help user find similar jobs/history
      router.push(`/jobs?search=${searchQuery}&id=${job._id}`);
    }
  };

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev + 1) % jobImages.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev - 1 + jobImages.length) % jobImages.length);
  };

  const locationText = typeof job.location === 'string' 
    ? job.location 
    : [job.location?.city, job.location?.state].filter(Boolean).join(", ") || "Location hidden";

  const blurText = (text: string) => {
    if (!isLoggedIn) {
      return (
        <span className="relative inline-flex items-center">
          <span className="blur-[3px] select-none opacity-40">XXXXXXXXXX</span>
          <Lock size={10} className="absolute left-1/2 -translate-x-1/2 text-gray-400" />
        </span>
      );
    }
    return text;
  };

  return (
    <>
      <div className="group relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-5 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 overflow-hidden">
        {/* Compact Style: Smaller padding, rounded-3xl to rounded-[2.5rem] */}
        
        {/* Verified Badge - Smaller & subtle */}
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800/50">
            <ShieldCheck size={10} />
            Verified
          </div>
        </div>

        <div className="flex flex-col h-full">
          {/* Header Area */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <Briefcase size={22} />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-0.5 line-clamp-1 group-hover:text-blue-600 transition-colors tracking-tight">
                {job.workTitle}
              </h3>
              <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                <Calendar size={10} />
                <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Image Icon / Preview Trigger */}
          <button 
            onClick={() => setShowGallery(true)}
            className="mb-4 relative w-full h-32 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group/img"
          >
            <img 
              src={jobImages[0]} 
              alt="job preview" 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white opacity-100 group-hover:bg-black/40 transition-all">
              <ImageIcon size={24} className="mb-1 drop-shadow-lg" />
              <span className="text-[10px] font-black uppercase tracking-widest drop-shadow-lg">View {jobImages.length} Photos</span>
            </div>
          </button>

          {/* Short Description */}
          <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed mb-5 line-clamp-2 h-8 font-medium italic">
            "{job.description}"
          </p>

          {/* Details Grid - Compact but clear */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-2.5 border border-zinc-100 dark:border-zinc-800/50 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <MapPin size={12} />
                <span className="text-[9px] font-black uppercase tracking-wider">Location</span>
              </div>
              <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">{locationText}</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-2.5 border border-zinc-100 dark:border-zinc-800/50 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Users size={12} />
                <span className="text-[9px] font-black uppercase tracking-wider">Requirement</span>
              </div>
              <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">{job.workersNeeded} Workers</span>
            </div>
          </div>

          {/* Contact Summary - Modern Strip */}
          <div className="mt-auto space-y-2 py-3 px-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-800/30">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Posted By</span>
              <span className="text-[11px] text-zinc-900 dark:text-white font-black">{blurText(job.createdBy.fullName)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Mobile</span>
              <span className="text-[11px] text-zinc-900 dark:text-white font-black tracking-widest">{blurText(job.createdBy.mobile)}</span>
            </div>
          </div>

          {/* Compact CTA */}
          <button 
            onClick={handleAction}
            className="mt-4 w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[1.25rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white transition-all active:scale-95 group/btn shadow-lg"
          >
            {isLoggedIn ? "Apply Directly" : "Login to Apply"}
            <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <button 
            onClick={() => setShowGallery(false)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X size={32} />
          </button>

          <div className="relative w-full max-w-5xl aspect-video flex items-center justify-center">
            {jobImages.length > 1 && (
              <>
                <button 
                  onClick={prevImg}
                  className="absolute left-4 p-4 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all z-10"
                >
                  <ChevronLeft size={32} />
                </button>
                <button 
                  onClick={nextImg}
                  className="absolute right-4 p-4 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all z-10"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            <img 
              src={jobImages[currentImgIdx]} 
              alt="job work" 
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
            />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/50 backdrop-blur-md rounded-full text-white font-bold text-sm">
              {currentImgIdx + 1} / {jobImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}