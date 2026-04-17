"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { TabContentProps } from "../TabValueContentMap";
import type { RootState } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";
import { toggleJobActivation, fetchJobEnquiries, fetchJobApplications, connectApplicant, completeEnquiryWithFeedback } from "@/store/slices/jobEnquirySlice";
import { apiGet, apiPatch, apiPost, apiPut } from "@/lib/api-service";
import { showErrorToast, showSuccessToast, showWarningToast } from "@/lib/toast-utils";
import JobStatCards, { type JobCardKey } from "../JobStatCards";
import { uploadFile } from "@/lib/s3-client";
import { X, UploadCloud, ImageIcon, ArrowRight, MapPin, Briefcase, CheckCircle, Users, ExternalLink, Calendar, Info, Phone, Star, Mail, RefreshCw } from "lucide-react";

type RequirementTargetOption = "labour" | "sub_contractor";
type RequirementTarget = "labour" | "sub_contractor";

interface RequirementFormState {
  title: string;
  target: RequirementTarget[];
  description: string;
  location: string;
  workersNeeded: string;
  skills: string;
  images: string[];
  locationDetails: {
    city: string;
    state: string;
    area: string;
    pincode: string;
    address: string;
  };
}

interface PublishedRequirement extends RequirementFormState {
  id: string;
  createdAt: string;
  visibility: boolean;
}

interface JobDetailsModalProps {
  isOpen: boolean;
  job: PublishedRequirement | null;
  saving: boolean;
  userType: string;
  onClose: () => void;
  onSave: (updated: RequirementFormState) => void;
}

interface ApiJob {
  _id?: string;
  id?: string;
  workTitle?: string;
  jobTitle?: string;
  visibility?: boolean;
  target?: RequirementTarget[];
  description?: string;
  location?: string | { city?: string; state?: string; area?: string; pincode?: string; address?: string };
  workersNeeded?: string | number;
  requiredSkills?: string[];
  skills?: string[];
  createdAt?: string;
  images?: string[];
}

const INITIAL_FORM: RequirementFormState = {
  title: "",
  target: ["labour"],
  description: "",
  location: "",
  workersNeeded: "",
  skills: "",
  images: [],
  locationDetails: {
    city: "",
    state: "",
    area: "",
    pincode: "",
    address: "",
  },
};

export default function CreateJobTabContent(props: TabContentProps) {
  const { usersLoading, usersError, filteredData, onConnect, userType } = props;
  const { user } = useSelector((state: RootState) => state.auth);
  const { jobActivation, jobEnquiries } = useSelector((state: RootState) => state.jobEnquiry);
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<RequirementFormState>(INITIAL_FORM);
  const [publishedRequirements, setPublishedRequirements] = useState<PublishedRequirement[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [publishing, setPublishing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedJob, setSelectedJob] = useState<PublishedRequirement | null>(null);
  const [viewingApplicationsJob, setViewingApplicationsJob] = useState<PublishedRequirement | null>(null);
  const [updatingJob, setUpdatingJob] = useState(false);
  const [activeCardKey, setActiveCardKey] = useState<JobCardKey>("posted");
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const isProfileHidden = user?.display === false;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];
    let failCount = 0;

    try {
      // Process uploads in parallel but track individual results
      await Promise.all(
        Array.from(files).map(async (file) => {
          try {
            // The filename is already used as a path in the s3-client.ts 
            // and the endpoint app/api/upload-url/route.ts adds userType prefix and timestamp.
            // Let's pass a clean filename.
            const cleanName = file.name.replace(/\s+/g, "_");
            const url = await uploadFile(
              cleanName, 
              file, 
              (userType === "contractor" || userType === "sub_contractor") ? "contractor" : "labour"
            );
            uploadedUrls.push(url);
          } catch (err) {
            console.error(`Failed to upload ${file.name}:`, err);
            failCount++;
          }
        })
      );

      if (uploadedUrls.length > 0) {
        updateField("images", [...form.images, ...uploadedUrls]);
        showSuccessToast(
          failCount > 0 
            ? `Uploaded ${uploadedUrls.length} images (${failCount} failed)` 
            : `Successfully uploaded ${uploadedUrls.length} image(s)`
        );
      } else if (failCount > 0) {
        showErrorToast("Failed to upload images. Please try again.");
      }
    } catch (error) {
      console.error("Batch upload error:", error);
      showErrorToast("An error occurred during upload.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    updateField(
      "images",
      form.images.filter((_, i) => i !== index)
    );
  };

  const updateLocationField = (field: keyof RequirementFormState["locationDetails"], value: string) => {
    setForm((prev) => ({
      ...prev,
      locationDetails: { ...prev.locationDetails, [field]: value },
    }));
  };


  const canSubmit = useMemo(() => {
    return (
      form.title.trim() &&
      form.target.length > 0 &&
      form.description.trim() &&
      form.locationDetails.city.trim() &&
      form.locationDetails.area.trim() &&
      form.locationDetails.pincode.trim() &&
      form.workersNeeded.trim() &&
      form.skills.trim()
    );
  }, [form]);

  const getTargetOptionFromArray = (targets: RequirementTarget[]): RequirementTargetOption => {
    if (targets.includes("sub_contractor")) return "sub_contractor";
    return "labour";
  };

  const getTargetArrayFromOption = (option: RequirementTargetOption): RequirementTarget[] => {
    return option === "labour" ? ["labour"] : ["sub_contractor"];
  };

  const formatTarget = (targets: RequirementTarget[]) => {
    return targets.map((item) => (item === "sub_contractor" ? "Sub_Contractor" : "Labour")).join(" + ");
  };

  const mapApiJobToRequirement = (job: ApiJob): PublishedRequirement => {
    const normalizedTargets = Array.isArray(job.target)
      ? job.target
          .map((item) => {
            if (item === "labour") return "labour";
            if (item === "sub_contractor" || item === "sub_contractor") return "sub_contractor";
            return null;
          })
          .filter((item): item is RequirementTarget => item !== null)
      : [];

    const targetArray: RequirementTarget[] = normalizedTargets.length > 0 ? normalizedTargets : ["labour"];

    const skillsArray = Array.isArray(job.requiredSkills)
      ? job.requiredSkills
      : Array.isArray(job.skills)
        ? job.skills
        : [];

    return {
      id: String(job._id || job.id || Date.now()),
      title: job.workTitle || job.jobTitle || "Untitled Job",
      target: targetArray,
      description: job.description || "",
      location: typeof job.location === "string" ? job.location : (typeof job.location === "object" ? `${job.location?.area || ""}, ${job.location?.city || ""}`.replace(/^, /, "") : ""),
      workersNeeded: String(job.workersNeeded ?? ""),
      skills: skillsArray.join(", "),
      images: Array.isArray(job.images) ? job.images : [],
      locationDetails: typeof job.location === "object" && job.location !== null
        ? { city: job.location.city || "", state: job.location.state || "", area: job.location.area || "", pincode: job.location.pincode || "", address: job.location.address || "" }
        : INITIAL_FORM.locationDetails,
      createdAt: job.createdAt ? new Date(job.createdAt).toLocaleString() : "",
      visibility: Boolean(job.visibility ?? false),
    };
  };

  const extractJobsAndPagination = (raw: any): { jobs: ApiJob[]; totalPagesFromApi: number } => {
    const container = raw?.data ?? raw;
    const jobs =
      container?.jobs ||
      container?.data?.jobs ||
      container?.items ||
      container?.data?.items ||
      [];

    const pagination =
      container?.pagination ||
      container?.data?.pagination ||
      container?.meta ||
      container?.data?.meta;

    const totalPagesFromApi = Number(
      pagination?.totalPages || pagination?.pages || container?.totalPages || 1
    );

    return {
      jobs: Array.isArray(jobs) ? jobs : [],
      totalPagesFromApi: Number.isFinite(totalPagesFromApi) && totalPagesFromApi > 0 ? totalPagesFromApi : 1,
    };
  };

  const fetchMyJobs = useCallback(async (pageToLoad: number) => {
    try {
      setJobsLoading(true);
      setJobsError(null);

      const response = await apiGet(`/api/jobs/my-jobs?status=open&page=${pageToLoad}&limit=${limit}`);
      if (!response.success) {
        throw new Error(response.error || response.message || "Failed to fetch jobs.");
      }

      const { jobs, totalPagesFromApi } = extractJobsAndPagination(response.data);
      const mapped = jobs.map(mapApiJobToRequirement);
      setPublishedRequirements(mapped);
      setTotalPages(totalPagesFromApi);
      // Fetch enquiries for each job so JobStatCards has data
      mapped.forEach((job) => {
        if (job.id) dispatch(fetchJobEnquiries({ jobId: job.id }));
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch jobs.";
      setJobsError(message);
    } finally {
      setJobsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchMyJobs(page);
  }, [page, fetchMyJobs]);

  const updateField = <K extends keyof RequirementFormState>(field: K, value: RequirementFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePublishRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProfileHidden) {
      showWarningToast("Make profile visible to create a job.");
      return;
    }
    if (!canSubmit) return;

    const payload = {
      workTitle: form.title.trim(),
      target: form.target,
      description: form.description.trim(),
      workersNeeded: parseInt(form.workersNeeded) || 0,
      requiredSkills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      images: form.images,
      location: {
        city: form.locationDetails.city.trim(),
        area: form.locationDetails.area.trim(),
        pincode: form.locationDetails.pincode.trim(),
        state: form.locationDetails.state.trim(),
        address: form.locationDetails.address.trim(),
      },
    };

    try {
      setPublishing(true);
      const response = await apiPost("/api/jobs/create-job", payload);

      if (!response.success) {
        throw new Error(response.error || response.message || "Failed to publish job requirement.");
      }

      setForm(INITIAL_FORM);
      setPage(1);
      await fetchMyJobs(1);
      setIsCreateModalOpen(false);
      showSuccessToast("Job requirement published successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to publish job requirement.";
      showErrorToast(message);
    } finally {
      setPublishing(false);
    }
  };

  const openJobDetails = (job: PublishedRequirement) => {
    setSelectedJob(job);
  };

  const updateJobOnServer = async (jobId: string, payload: any) => {
    const endpoints = [`/api/jobs/update/${jobId}`, `/api/jobs/${jobId}`];

    for (const endpoint of endpoints) {
      const patchResponse = await apiPatch(endpoint, payload);
      if (patchResponse.success) return patchResponse;

      const putResponse = await apiPut(endpoint, payload);
      if (putResponse.success) return putResponse;
    }

    throw new Error("Failed to update job.");
  };

  const handleSaveJobDetails = async (updated: RequirementFormState) => {
    if (!selectedJob) return;

    const payload = {
      workTitle: updated.title.trim(),
      target: updated.target,
      description: updated.description.trim(),
      workersNeeded: parseInt(updated.workersNeeded) || 0,
      requiredSkills: updated.skills.split(",").map((s) => s.trim()).filter(Boolean),
      images: updated.images,
      location: {
        city: updated.locationDetails.city.trim(),
        area: updated.locationDetails.area.trim(),
        pincode: updated.locationDetails.pincode.trim(),
        state: updated.locationDetails.state.trim(),
        address: updated.locationDetails.address.trim(),
      },
    };

    try {
      setUpdatingJob(true);
      const response = await updateJobOnServer(selectedJob.id, payload);

      if (!response.success) {
        throw new Error(response.error || response.message || "Failed to update job.");
      }

      showSuccessToast("Job updated successfully.");
      setSelectedJob(null);
      fetchMyJobs(page);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update job.";
      showErrorToast(message);
    } finally {
      setUpdatingJob(false);
    }
  };

  const handleToggleJobVisibility = async (jobId: string, currentVisibility: boolean) => {
    try {
      const result = await dispatch(toggleJobActivation({ jobId, currentVisibility })).unwrap();

      setPublishedRequirements((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, visibility: result.visibility } : job
        )
      );

      showSuccessToast(
        result.visibility ? "Job made visible successfully." : "Job hidden successfully."
      );
    } catch (error) {
      const message = typeof error === "string" ? error : "Failed to update job visibility.";
      showErrorToast(message);
    }
  };

  const handleCardClick = (key: JobCardKey, filterByJobId?: string) => {
    setActiveCardKey(key);
    // If a jobId is provided, we would normally filter the enquiries here.
    // For now, we'll just set the key and let the user know we're showing all applications.
    // In a real scenario, you might add a `selectedJobFilter` state.
    setMobileDetailOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {userType !== "contractor" && (
      <div className="px-4 sm:px-6 pt-5">
        <JobStatCards
          userType={userType}
          totalPostedJobs={publishedRequirements.length}
          activeCardKey={activeCardKey}
          onCardClick={handleCardClick}
        />
      </div>
      )}

      {/* Content: full-screen overlay on mobile when card is tapped, always-inline on desktop */}
      {/* For contractor: no overlay behavior, always visible */}
      <div className={
        userType === "contractor"
          ? ""
          : mobileDetailOpen
          ? "fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 flex flex-col lg:static lg:inset-auto lg:z-auto lg:bg-transparent lg:block"
          : "hidden lg:block"
      }>
        {/* Mobile: back-navigation header */}
        {userType !== "contractor" && mobileDetailOpen && (
          <div className="lg:hidden sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMobileDetailOpen(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              {activeCardKey === "posted" && "Published Jobs"}
              {activeCardKey === "applications" && "All Applications"}
              {activeCardKey === "pending" && "Requests Received"}
              {activeCardKey === "accepted" && "Accepted Applications"}
              {activeCardKey === "completed" && "Completed Jobs"}
              {activeCardKey === "rejected" && "Rejected Applications"}
            </h2>
          </div>
        )}
        <div className={mobileDetailOpen ? "flex-1 overflow-y-auto lg:overflow-visible lg:flex-none" : ""}>
          {/* Filtered enquiries panel — shown when a non-"posted" card is active */}
          {userType !== "contractor" && activeCardKey !== "posted" && (() => {
        const allEnquiries: any[] = Object.values(
          jobEnquiries.enquiries as Record<string, any[]>
        ).flat();
        let filtered: any[];
        if (activeCardKey === "applications") {
          filtered = allEnquiries;
        } else {
          filtered = allEnquiries.filter((e: any) => {
            const s = (e?.status || "").toLowerCase();
            return s === activeCardKey;
          });
        }
        const sectionLabel: Record<string, string> = {
          applications: "All Applications",
          pending: "Requests Received",
          accepted: "Accepted Applications",
          completed: "Completed Jobs",
          rejected: "Rejected Applications",
        };
        return (
          <div className="px-4 sm:px-6 pb-5">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
              {sectionLabel[activeCardKey] ?? activeCardKey}
            </h3>
            {filtered.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">No records found for this category.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filtered.map((enquiry: any, idx: number) => {
                  const id = enquiry?.id || enquiry?._id || idx;
                  const status = (enquiry?.status || "pending").toLowerCase();
                  const statusColors: Record<string, string> = {
                    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                    accepted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                    completed: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
                    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                  };
                  return (
                    <div key={id} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3.5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                          {enquiry?.applicantName || enquiry?.labourName || enquiry?.name || "Applicant"}
                        </p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 capitalize ${statusColors[status] ?? "bg-gray-100 text-gray-600"}`}>
                          {status}
                        </span>
                      </div>
                      {enquiry?.jobTitle && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                          Job: <span className="font-medium text-gray-700 dark:text-gray-300">{enquiry.jobTitle}</span>
                        </p>
                      )}
                      {enquiry?.location && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                          Location: <span className="font-medium text-gray-700 dark:text-gray-300">{enquiry.location}</span>
                        </p>
                      )}
                      {enquiry?.skills && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Skills: <span className="font-medium text-gray-700 dark:text-gray-300">{Array.isArray(enquiry.skills) ? enquiry.skills.join(", ") : enquiry.skills}</span>
                        </p>
                      )}
                      {enquiry?.message && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-2 italic">"{enquiry.message}"</p>
                      )}
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">
                        {enquiry?.createdAt ? new Date(enquiry.createdAt).toLocaleDateString() : ""}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {(userType === "contractor" || activeCardKey === "posted") && (
      <div className="relative overflow-hidden rounded-2xl border border-indigo-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 sm:p-3 mb-4 shadow-sm">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -tranzinc-y-1/2 tranzinc-x-1/4 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 tranzinc-y-1/2 -tranzinc-x-1/4 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h3 className="text-md sm:text-xl font-black text-zinc-900 dark:text-white tracking-tight">
              Post New <span className="text-indigo-600 dark:text-indigo-400">Requirement</span>
            </h3>
           
          </div>
          
          <div className="flex flex-col items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              disabled={isProfileHidden}
              className="group relative flex items-center gap-3 px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/25 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-x-0 bottom-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <UploadCloud size={20} className="group-hover:-translate-y-1 transition-transform" />
              Create Job
            </button>
            
            {isProfileHidden && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30">
                <span className="text-[10px] font-bold text-orange-700 dark:text-orange-400 uppercase tracking-tight">
                  Profile Hidden
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-2xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl max-h-[88vh] overflow-y-auto">
            <div className="px-4 sm:px-5 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Create New Job</h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-xs px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
              >
                Close
              </button>
            </div>

            <form
              onSubmit={handlePublishRequirement}
              className="p-3 sm:p-4 flex flex-col gap-3"
            >
              {/* Row 1: Title */}
              <div>
                <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Work Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g., Building Renovation Work"
                  className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none"
                />
              </div>

              {/* Row 2: Target + Workers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Target *</label>
                  <select
                    value={getTargetOptionFromArray(form.target)}
                    onChange={(e) => updateField("target", getTargetArrayFromOption(e.target.value as RequirementTargetOption))}
                    className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none"
                  >
                    {user.userType === "sub_contractor" ? (
                      <option value="labour">Labour</option>
                    ) : (
                      <>
                        <option value="labour">Labour</option>
                        <option value="sub_contractor">Sub-Contractor</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Workers *</label>
                  <input
                    type="number"
                    value={form.workersNeeded}
                    onChange={(e) => updateField("workersNeeded", e.target.value)}
                    placeholder="e.g., 5"
                    className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Skills */}
              <div>
                <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Required Skills *</label>
                <input
                  value={form.skills}
                  onChange={(e) => updateField("skills", e.target.value)}
                  placeholder="e.g., Mason, Carpenter"
                  className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none"
                />
              </div>

              {/* Row 4: Description */}
              <div>
                <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={2}
                  placeholder="Explain work scope..."
                  className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none resize-none"
                />
              </div>

              {/* Row 5: Location */}
              <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-700">
                <p className="text-[11px] font-black uppercase text-zinc-400 mb-2">Location</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">City *</label>
                    <input value={form.locationDetails.city} onChange={(e) => updateLocationField("city", e.target.value)} placeholder="Mumbai" className="mt-0.5 w-full px-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">Area *</label>
                    <input value={form.locationDetails.area} onChange={(e) => updateLocationField("area", e.target.value)} placeholder="Bandra" className="mt-0.5 w-full px-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">Pincode *</label>
                    <input value={form.locationDetails.pincode} onChange={(e) => updateLocationField("pincode", e.target.value)} placeholder="400050" className="mt-0.5 w-full px-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">State <span className="text-zinc-400 font-normal">(opt)</span></label>
                    <input value={form.locationDetails.state} onChange={(e) => updateLocationField("state", e.target.value)} placeholder="Maharashtra" className="mt-0.5 w-full px-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">Address <span className="text-zinc-400 font-normal">(opt)</span></label>
                    <input value={form.locationDetails.address} onChange={(e) => updateLocationField("address", e.target.value)} placeholder="Plot 12, Bandra West" className="mt-0.5 w-full px-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none" />
                  </div>
                </div>
              </div>

              {/* Row 6: Images */}
              <div>
                <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Site Images</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {form.images.map((url, idx) => (
                    <div key={idx} className="relative w-14 h-14 group shrink-0">
                      <img src={url} alt="Site" className="w-full h-full object-cover rounded-lg border border-zinc-200" />
                      <button type="button" onClick={() => removeImage(idx)} className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-500 text-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-14 h-14 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors shrink-0">
                    {isUploading ? <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /> : <><UploadCloud className="text-zinc-400" size={16} /><span className="text-[9px] font-bold text-zinc-500 mt-0.5">Add</span></>}
                  </button>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" multiple />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-sm font-semibold transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={!canSubmit || isProfileHidden || publishing || isUploading} className="px-5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold transition-all">
                  {publishing ? "Publishing..." : "Post Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {(userType === "contractor" || activeCardKey === "posted") && (
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5 mb-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Published Jobs</h3>
          <button
            type="button"
            onClick={() => fetchMyJobs(page)}
            disabled={jobsLoading}
            className="text-xs px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-60"
          >
            Refresh
          </button>
        </div>

        {jobsLoading ? (
          <div className="space-y-3" aria-live="polite">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 animate-pulse">
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
                <div className="flex gap-2 mt-3">
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : jobsError ? (
          <div className="rounded-lg border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-3">
            <p className="text-sm text-red-700 dark:text-red-300">{jobsError}</p>
          </div>
        ) : publishedRequirements.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">No Jobs published yet.</p>
        ) : (
          <div className="max-h-130 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {publishedRequirements.map((item) => (
              <PublishedJobCard
                key={item.id}
                item={item}
                formatTarget={formatTarget}
                onShowDetails={() => openJobDetails(item)}
                onToggleVisibility={handleToggleJobVisibility}
                onViewApplications={(jobId) => {
                  const targetJob = publishedRequirements.find(j => j.id === jobId);
                  if (targetJob) {
                    setViewingApplicationsJob(targetJob);
                    dispatch(fetchJobApplications({ jobId }));
                  }
                }}
                toggling={Boolean(jobActivation.loadingByJobId[item.id])}
              />
            ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1 || jobsLoading}
            className="text-xs px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-50"
          >
            Previous
          </button>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Page {page} of {totalPages}
          </p>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages || jobsLoading}
            className="text-xs px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      )}

        </div>
      </div>

      <JobDetailsModal
        isOpen={Boolean(selectedJob)}
        job={selectedJob}
        saving={updatingJob}
        userType={userType}
        onClose={() => setSelectedJob(null)}
        onSave={handleSaveJobDetails}
      />

      <JobApplicationsModal
        isOpen={Boolean(viewingApplicationsJob)}
        job={viewingApplicationsJob}
        onClose={() => setViewingApplicationsJob(null)}
        onConnect={onConnect}
      />
    </div>
  );
}

function JobApplicationsModal({
  isOpen,
  job,
  onClose,
  onConnect,
}: {
  isOpen: boolean;
  job: PublishedRequirement | null;
  onClose: () => void;
  onConnect: TabContentProps["onConnect"];
}) {
  const dispatch = useAppDispatch();
  const { jobEnquiries, enquiryAcceptance, enquiryCompletion } = useSelector((state: RootState) => state.jobEnquiry);
  const [feedbackTarget, setFeedbackTarget] = useState<{ enquiryId: string; applicantName: string } | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackHover, setFeedbackHover] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [pulling, setPulling] = useState(false);
  const touchStartY = React.useRef(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchJobApplications({ jobId: job!.id })).unwrap();
    } catch {} finally {
      setRefreshing(false);
      setPullDistance(0);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (scrollRef.current && scrollRef.current.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
      setPulling(true);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!pulling || refreshing) return;
    if (scrollRef.current && scrollRef.current.scrollTop > 0) {
      setPulling(false);
      setPullDistance(0);
      return;
    }
    const diff = e.touches[0].clientY - touchStartY.current;
    if (diff > 0) {
      setPullDistance(Math.min(diff * 0.4, 80));
    }
  };

  const onTouchEnd = () => {
    if (pullDistance > 50 && !refreshing) {
      handleRefresh();
    } else {
      setPullDistance(0);
    }
    setPulling(false);
  };

  if (!isOpen || !job) return null;

  const jobApplications = (jobEnquiries.enquiries[job.id] || []) as any[];
  const acceptedCount = jobApplications.filter(a => (a.status || "").toLowerCase() === "accepted").length;
  const completedCount = jobApplications.filter(a => (a.status || "").toLowerCase() === "completed").length;
  const pendingCount = jobApplications.length - acceptedCount - completedCount;

  const handleConnect = async (enquiryId: string) => {
    if (!enquiryId) return;
    try {
      await dispatch(connectApplicant({ enquiryId, jobId: job.id })).unwrap();
      dispatch(fetchJobApplications({ jobId: job.id }));
      showSuccessToast("Connected successfully! Applicant has been notified.");
    } catch (error) {
      const message = typeof error === "string" ? error : "Failed to connect with applicant.";
      showErrorToast(message);
    }
  };

  const openFeedbackForm = (enquiryId: string, applicantName: string) => {
    setFeedbackTarget({ enquiryId, applicantName });
    setFeedbackRating(0);
    setFeedbackHover(0);
    setFeedbackText("");
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackTarget || feedbackRating === 0 || !feedbackText.trim()) return;
    try {
      await dispatch(completeEnquiryWithFeedback({
        enquiryId: feedbackTarget.enquiryId,
        jobId: job.id,
        rating: feedbackRating,
        feedback: feedbackText.trim(),
      })).unwrap();
      dispatch(fetchJobApplications({ jobId: job.id }));
      showSuccessToast("Marked as completed! Feedback submitted successfully.");
      setFeedbackTarget(null);
    } catch (error) {
      const message = typeof error === "string" ? error : "Failed to mark as completed.";
      showErrorToast(message);
    }
  };

  const getEnquiryId = (app: any) => app.enquiryId || app._id || app.id;

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-in fade-in duration-200">
      <div className="w-full sm:max-w-3xl lg:max-w-5xl bg-white dark:bg-zinc-950 sm:rounded-2xl sm:border sm:border-zinc-200 dark:sm:border-zinc-800 shadow-2xl h-[95vh] sm:h-auto sm:max-h-[90vh] flex flex-col overflow-hidden rounded-t-2xl sm:mx-4">
        
        {/* Header - Compact with Job Summary on mobile */}
        <div className="shrink-0 border-b border-zinc-100 dark:border-zinc-800">
          <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="hidden sm:flex p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                <Briefcase size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white truncate">
                  {job.title}
                </h3>
                <div className="flex items-center gap-2 sm:gap-3 mt-0.5 flex-wrap">
                  <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-zinc-500">
                    <MapPin size={10} className="shrink-0" />
                    {job.locationDetails.area}, {job.locationDetails.city}
                  </span>
                  <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">|</span>
                  <span className="text-[10px] sm:text-[11px] text-zinc-500">
                    {job.workersNeeded} workers needed
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing || jobEnquiries.loading}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 disabled:opacity-50"
                title="Refresh applications"
              >
                <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="px-4 sm:px-6 pb-3 flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
              <Users size={12} />
              <span className="text-[10px] sm:text-[11px] font-bold">{jobApplications.length} Applied</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
              <CheckCircle size={12} />
              <span className="text-[10px] sm:text-[11px] font-bold">{acceptedCount} Accepted</span>
            </div>
            {completedCount > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400">
                <CheckCircle size={12} />
                <span className="text-[10px] sm:text-[11px] font-bold">{completedCount} Completed</span>
              </div>
            )}
            {pendingCount > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                <Info size={12} />
                <span className="text-[10px] sm:text-[11px] font-bold">{pendingCount} Pending</span>
              </div>
            )}
          </div>
        </div>

        {/* Applicant List - Scrollable with pull-to-refresh */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto overscroll-contain"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Pull-to-refresh indicator */}
          {(pullDistance > 0 || refreshing) && (
            <div
              className="flex items-center justify-center overflow-hidden transition-all"
              style={{ height: refreshing ? 48 : pullDistance }}
            >
              <div className={`flex items-center gap-2 text-indigo-500 ${
                refreshing ? 'animate-pulse' : pullDistance > 50 ? 'text-indigo-600' : 'text-zinc-400'
              }`}>
                <RefreshCw size={16} className={`transition-transform ${refreshing ? 'animate-spin' : ''}`} style={{ transform: refreshing ? undefined : `rotate(${pullDistance * 3}deg)` }} />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {refreshing ? 'Refreshing...' : pullDistance > 50 ? 'Release to refresh' : 'Pull to refresh'}
                </span>
              </div>
            </div>
          )}
          {jobEnquiries.loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-8 h-8 border-[3px] border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Loading...</p>
            </div>
          ) : jobApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4">
                <Users size={28} className="text-zinc-300 dark:text-zinc-700" />
              </div>
              <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1">No applicants yet</h4>
              <p className="text-xs text-zinc-500 max-w-[240px]">Candidates will appear here once they apply to your job posting.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {jobApplications.map((app, idx) => {
                const applicant = app.applicant || app;
                const status = (app.status || "pending").toLowerCase();
                const isAccepted = status === "accepted";
                const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
                  pending: { bg: "bg-amber-50 dark:bg-amber-900/15", text: "text-amber-600 dark:text-amber-400", label: "Pending" },
                  accepted: { bg: "bg-green-50 dark:bg-green-900/15", text: "text-green-600 dark:text-green-400", label: "Accepted" },
                  rejected: { bg: "bg-red-50 dark:bg-red-900/15", text: "text-red-500 dark:text-red-400", label: "Rejected" },
                  completed: { bg: "bg-teal-50 dark:bg-teal-900/15", text: "text-teal-600 dark:text-teal-400", label: "Completed" },
                };
                const currentStatus = statusConfig[status] || statusConfig.pending;

                return (
                  <div key={app.enquiryId || app.id || idx} className="px-4 sm:px-6 py-4 sm:py-5 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                    {/* Row: Avatar + Info + Action */}
                    <div className="flex gap-3 sm:gap-4">
                      {/* Avatar */}
                      <div className="relative shrink-0 self-start">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                          {applicant.profilePhoto || applicant.profileImage ? (
                            <img src={applicant.profilePhoto || applicant.profileImage} className="w-full h-full object-cover" alt={applicant.name} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                              <span className="text-sm font-black text-zinc-500 dark:text-zinc-500">{(applicant.name || 'A')[0].toUpperCase()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Top: Name + Status + Action (desktop) */}
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-[13px] sm:text-sm font-bold text-zinc-900 dark:text-white truncate">
                                {applicant.name || 'Anonymous'}
                              </h4>
                              <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold uppercase tracking-wider ${currentStatus.bg} ${currentStatus.text}`}>
                                {currentStatus.label}
                              </span>
                            </div>
                          </div>
                          {/* Desktop action */}
                          {status === "completed" ? (
                            <span className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-teal-600 text-white shrink-0">
                              <CheckCircle size={10} /> Completed
                            </span>
                          ) : isAccepted ? (
                            <button
                              onClick={() => openFeedbackForm(getEnquiryId(app), applicant.name || 'Applicant')}
                              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shrink-0 bg-amber-500 hover:bg-amber-600 text-white active:scale-95"
                            >
                              <CheckCircle size={10} /> Mark Complete
                            </button>
                          ) : (
                            <button
                              onClick={() => handleConnect(getEnquiryId(app))}
                              disabled={enquiryAcceptance.loadingByEnquiryId[getEnquiryId(app)]}
                              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 disabled:opacity-70"
                            >
                              {enquiryAcceptance.loadingByEnquiryId[getEnquiryId(app)] ? (
                                <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Connecting...</>
                              ) : (
                                <><ExternalLink size={10} /> Connect</>
                              )}
                            </button>
                          )}
                        </div>

                        {/* Contact Info Row */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                          {applicant.email && (
                            <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-zinc-500">
                              <Mail size={11} className="text-indigo-400 shrink-0" />
                              <span className="truncate max-w-[180px] sm:max-w-none">{applicant.email}</span>
                            </span>
                          )}
                          {applicant.mobile && (
                            <a href={`tel:+91${applicant.mobile}`} className="flex items-center gap-1 text-[10px] sm:text-[11px] text-zinc-500 hover:text-green-600 transition-colors">
                              <Phone size={11} className="text-green-500 shrink-0" />
                              +91 {applicant.mobile}
                            </a>
                          )}
                          {app.appliedAt && (
                            <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-zinc-400">
                              <Calendar size={11} className="shrink-0" />
                              {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          )}
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap mb-2">
                          {applicant.experience && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[9px] sm:text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                              <Briefcase size={10} className="shrink-0" />
                              {applicant.experience} Exp
                            </span>
                          )}
                          
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-900/15 text-[9px] sm:text-[10px] font-bold text-amber-600 dark:text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) => {
                              const rating = Number(applicant.rating) || 0;
                              const isFull = star <= Math.floor(rating);
                              const isHalf = !isFull && star === Math.ceil(rating) && rating % 1 >= 0.1;
                              return (
                                <span key={star} className="relative inline-block w-[10px] h-[10px] sm:w-[12px] sm:h-[12px]">
                                  <Star size={10} className="absolute inset-0 text-gray-200 dark:text-gray-800 sm:w-3 sm:h-3" fill="currentColor" />
                                  {isFull && <Star size={10} className="absolute inset-0 text-amber-500 sm:w-3 sm:h-3" fill="currentColor" />}
                                  {isHalf && (
                                    <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                                      <Star size={10} className="text-amber-500 sm:w-3 sm:h-3" fill="currentColor" />
                                    </span>
                                  )}
                                </span>
                              );
                            })}
                            {Number(applicant.rating) > 0 && <span className="ml-0.5">{applicant.rating}</span>}
                          </span>
                        </div>

                        {/* Skills */}
                        {applicant.skills && applicant.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {(Array.isArray(applicant.skills) ? applicant.skills : [applicant.skills]).slice(0, 5).map((s: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[9px] sm:text-[10px] font-semibold border border-indigo-100 dark:border-indigo-800/30">
                                {s}
                              </span>
                            ))}
                            {Array.isArray(applicant.skills) && applicant.skills.length > 5 && (
                              <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[9px] sm:text-[10px] font-semibold">
                                +{applicant.skills.length - 5} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Message */}
                        {app.message && (
                          <div className="px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50 mt-1">
                            <p className="text-[10px] sm:text-[11px] text-zinc-600 dark:text-zinc-400 italic leading-relaxed line-clamp-2">
                              &ldquo;{app.message}&rdquo;
                            </p>
                          </div>
                        )}

                        {/* Mobile Action Button */}
                        {status === "completed" ? (
                          <span className="sm:hidden mt-3 w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-teal-600 text-white">
                            <CheckCircle size={12} /> Completed
                          </span>
                        ) : isAccepted ? (
                          <button
                            onClick={() => openFeedbackForm(getEnquiryId(app), applicant.name || 'Applicant')}
                            className="sm:hidden mt-3 w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all bg-amber-500 hover:bg-amber-600 text-white active:scale-[0.98]"
                          >
                            <CheckCircle size={12} /> Mark as Completed
                          </button>
                        ) : (
                          <button
                            onClick={() => handleConnect(getEnquiryId(app))}
                            disabled={enquiryAcceptance.loadingByEnquiryId[getEnquiryId(app)]}
                            className="sm:hidden mt-3 w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98] disabled:opacity-70"
                          >
                            {enquiryAcceptance.loadingByEnquiryId[getEnquiryId(app)] ? (
                              <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Connecting...</>
                            ) : (
                              <><ExternalLink size={12} /> Connect Now</>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal Overlay */}
      {feedbackTarget && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-2xl">
          <div className="w-[90%] max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <h3 className="text-sm font-bold">Complete & Rate</h3>
              <p className="text-[11px] opacity-90 mt-0.5">Rate your experience with {feedbackTarget.applicantName}</p>
            </div>

            <div className="p-5 space-y-4">
              {/* Star Rating */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Rating <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="relative w-8 h-8 cursor-pointer group"
                      onMouseLeave={() => setFeedbackHover(0)}
                    >
                      {/* Left half */}
                      <span
                        className="absolute inset-0 w-1/2 overflow-hidden z-10"
                        onMouseEnter={() => setFeedbackHover(star - 0.5)}
                        onClick={() => setFeedbackRating(star - 0.5)}
                      />
                      {/* Right half */}
                      <span
                        className="absolute inset-0 left-1/2 w-1/2 z-10"
                        onMouseEnter={() => setFeedbackHover(star)}
                        onClick={() => setFeedbackRating(star)}
                      />
                      <Star
                        size={28}
                        className={`absolute inset-0 m-auto transition-colors ${
                          (feedbackHover || feedbackRating) >= star
                            ? 'fill-amber-400 text-amber-400'
                            : (feedbackHover || feedbackRating) >= star - 0.5
                            ? 'fill-amber-400/50 text-amber-400'
                            : 'fill-zinc-200 dark:fill-zinc-700 text-zinc-300 dark:text-zinc-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-bold text-zinc-600 dark:text-zinc-400 min-w-[2rem]">
                    {feedbackRating > 0 ? feedbackRating : ''}
                  </span>
                </div>
              </div>

              {/* Feedback Text */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Feedback <span className="text-red-500">*</span></label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share your experience working with this person..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setFeedbackTarget(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  disabled={feedbackRating === 0 || !feedbackText.trim() || enquiryCompletion.loadingByEnquiryId[feedbackTarget.enquiryId]}
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  {enquiryCompletion.loadingByEnquiryId[feedbackTarget.enquiryId] ? (
                    <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</>
                  ) : (
                    'Submit & Complete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function PublishedJobCard({
  item,
  formatTarget,
  onShowDetails,
  onToggleVisibility,
  onViewApplications,
  toggling,
}: {
  item: PublishedRequirement;
  formatTarget: (targets: RequirementTarget[]) => string;
  onShowDetails: () => void;
  onToggleVisibility: (jobId: string, currentVisibility: boolean) => void;
  onViewApplications: (jobId: string) => void;
  toggling: boolean;
}) {
  // Auto-cycle images: rotate which image is front/middle/back
  const [imgIndex, setImgIndex] = useState(0);
  const imageCount = item.images?.length || 0;

  useEffect(() => {
    if (imageCount <= 1) return;
    const interval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % imageCount);
    }, 20000);
    return () => clearInterval(interval);
  }, [imageCount]);

  // Get 3 images for the stack based on current cycle index
  const getStackImage = (offset: number) => {
    if (!item.images || imageCount === 0) return "";
    return item.images[(imgIndex + offset) % imageCount];
  };

  return (
    <div className="group relative flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">
      {/* Top Image Banner */}
      <div className="relative h-32 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {item.images && item.images.length > 1 ? (
          /* Multiple images — stacked photos with auto-cycling */
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 p-3">
            {/* Stack container */}
            <div className="relative w-[75%] h-[90%]">
              {/* 3rd layer (back-most) — rotated right */}
              {imageCount > 2 && (
                <div className="absolute inset-0 rounded-lg border-2 border-white dark:border-zinc-600 shadow-md overflow-hidden rotate-6 translate-x-2 -translate-y-1 bg-zinc-200 dark:bg-zinc-700 transition-all duration-700">
                  <img src={getStackImage(2)} alt="" className="w-full h-full object-cover opacity-70 transition-opacity duration-700" />
                </div>
              )}
              {/* 2nd layer (middle) — rotated left */}
              <div className="absolute inset-0 rounded-lg border-2 border-white dark:border-zinc-600 shadow-md overflow-hidden -rotate-3 -translate-x-1 translate-y-0.5 bg-zinc-200 dark:bg-zinc-700 transition-all duration-700">
                <img src={getStackImage(1)} alt="" className="w-full h-full object-cover opacity-80 transition-opacity duration-700" />
              </div>
              {/* 1st layer (front) — straight */}
              <div className="relative rounded-lg border-2 border-white dark:border-zinc-500 shadow-xl overflow-hidden h-full transition-all duration-700">
                <img src={getStackImage(0)} alt={item.title} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
              </div>
            </div>
            {/* Image count badge with current index */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white shadow-lg">
              <ImageIcon size={10} />
              <span className="text-[9px] font-black">{imgIndex + 1}/{item.images.length}</span>
            </div>
          </div>
        ) : item.images && item.images.length === 1 ? (
          /* Single image */
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          /* No images — empty folder */
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900">
            <div className="relative w-[60%] h-[70%]">
              {/* Empty stack layers */}
              <div className="absolute inset-0 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 rotate-6 translate-x-2 -translate-y-1 bg-zinc-100 dark:bg-zinc-800" />
              <div className="absolute inset-0 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 -rotate-3 -translate-x-1 translate-y-0.5 bg-zinc-100 dark:bg-zinc-800" />
              <div className="relative rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 h-full bg-zinc-50 dark:bg-zinc-800/80 flex items-center justify-center">
                <ImageIcon size={24} className="text-zinc-300 dark:text-zinc-600" />
              </div>
            </div>
            <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-600 mt-1.5 uppercase tracking-widest">No Photos</span>
          </div>
        )}
        
        {/* Status Badge - Now more prominent with clear "Active/Paused" indicator */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 pointer-events-none">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-lg border-2 ${
            item.visibility 
              ? 'bg-green-600 border-green-400 text-white' 
              : 'bg-zinc-800 border-zinc-600 text-zinc-300'
          }`}>
            <div className={`w-2 h-2 rounded-full ${item.visibility ? 'bg-white animate-pulse' : 'bg-zinc-500'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">
              {item.visibility ? 'Live' : 'Hidden'}
            </span>
          </div>
          
          {/* Helpful helper text for visibility */}
          <span className="text-[8px] font-bold text-white drop-shadow-md bg-black/30 px-1.5 py-0.5 rounded backdrop-blur-[2px]">
            {item.visibility ? 'Visible to everyone' : 'Only you can see this'}
          </span>
        </div>

        {/* Visibility Toggle - Dedicated Primary Control */}
        <div className="absolute bottom-3 left-3">
           <button 
             onClick={(e) => {
               e.stopPropagation();
               onToggleVisibility(item.id, item.visibility);
             }}
             disabled={toggling}
             className={`group/toggle relative flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-md transition-all shadow-2xl border-2 ${
               item.visibility 
                ? 'bg-white/95 border-green-500 text-green-700 hover:bg-green-50' 
                : 'bg-zinc-900/95 border-zinc-500 text-zinc-100 hover:bg-zinc-800'
             } active:scale-95`}
             title={item.visibility ? "Click to Pause" : "Click to Publish"}
           >
              <div className="relative">
                <div className={`w-3 h-3 rounded-full transition-colors ${item.visibility ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-zinc-500'}`} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-tight">
                 {item.visibility ? 'Go Offline' : 'Go Online'}
              </span>
              
              {/* Spinner when toggling */}
              {toggling && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
                  <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
           </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        {/* Title & Metadata */}
        <div className="mb-3">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {item.title}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-zinc-400 dark:text-zinc-500">
            <MapPin size={10} />
            <span className="text-[10px] font-medium truncate">
                {item.locationDetails.area}, {item.locationDetails.city}
            </span>
          </div>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 transition-colors">
            <Briefcase size={12} className="text-indigo-500 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] font-bold text-zinc-400 uppercase leading-none">Category</span>
              <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 capitalize truncate">
                {item.target[0] === 'labour' ? 'Labour' : 'Sub-Contractor'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 transition-colors">
            <CheckCircle size={12} className="text-green-500 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] font-bold text-zinc-400 uppercase leading-none">Required</span>
              <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 truncate">
                {item.workersNeeded} Workers
              </span>
            </div>
          </div>
        </div>

        {/* Skills Tags - Now more structured and professional */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3 min-h-[1.5rem]">
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-tighter mr-1">Skills:</span>
          {item.skills.split(',').slice(0, 3).map((skill, i) => (
            <span key={i} className="text-[9px] font-bold text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800/50">
              {skill.trim()}
            </span>
          ))}
          {item.skills.split(',').length > 3 && (
            <div className="group/skills relative inline-block cursor-help">
              <span className="text-[9px] font-bold text-zinc-400 hover:text-indigo-500 transition-colors bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                +{item.skills.split(',').length - 3} more
              </span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/skills:block z-30">
                <div className="bg-zinc-900 text-white text-[9px] py-1 px-2 rounded shadow-xl whitespace-nowrap">
                  {item.skills.split(',').slice(3).join(', ')}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Description Snippet - Now strictly 1 line truncate */}
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate italic leading-relaxed mb-4" title={item.description}>
          "{item.description}"
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800 gap-2">
          <button
            onClick={() => onViewApplications(item.id)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-green-100 hover:bg-green-200 dark:bg-green-800 dark:hover:bg-green-700 text-zinc-700 dark:text-zinc-200 text-[10px] font-black uppercase tracking-wider transition-all active:scale-95"
          >
            Applications
          </button>
          
          <button
            onClick={onShowDetails}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            Edit Job
            <ArrowRight size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}

function JobDetailsModal({ isOpen, job, saving, userType, onClose, onSave }: JobDetailsModalProps) {
  const [form, setForm] = useState<RequirementFormState>(INITIAL_FORM);
  const [isUploading, setIsUploading] = useState(false);
  const modalFileInputRef = React.useRef<HTMLInputElement>(null);

  const handleModalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    const uploadedUrls: string[] = [];
    await Promise.all(
      Array.from(files).map(async (file) => {
        try {
          const cleanName = file.name.replace(/\s+/g, "_");
          const url = await uploadFile(
            cleanName,
            file,
            (userType === "contractor" || userType === "sub_contractor") ? "contractor" : "labour"
          );
          uploadedUrls.push(url);
        } catch { /* skip failed */ }
      })
    );
    if (uploadedUrls.length > 0) {
      setForm((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
    }
    setIsUploading(false);
    if (modalFileInputRef.current) modalFileInputRef.current.value = "";
  };

  useEffect(() => {
    if (job) {
      setForm({
        title: job.title,
        target: job.target,
        description: job.description,
        location: job.location,
        workersNeeded: job.workersNeeded,
        skills: job.skills,
        images: job.images ?? [],
        locationDetails: job.locationDetails ?? INITIAL_FORM.locationDetails,
      });
    }
  }, [job]);

  if (!isOpen || !job) return null;

  const canSave =
    form.title.trim() &&
    form.target.length > 0 &&
    form.description.trim() &&
    form.locationDetails.city.trim() &&
    form.locationDetails.area.trim() &&
    form.locationDetails.pincode.trim() &&
    form.workersNeeded.trim() &&
    form.skills.trim();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-2xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl max-h-[88vh] overflow-y-auto">
        <div className="px-4 sm:px-5 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Job Details</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-xs px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
          >
            Close
          </button>
        </div>

        <div className="p-3 sm:p-4 flex flex-col gap-3">
          {/* Title */}
          <div>
            <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">Work Title *</label>
            <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} className="mt-0.5 w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none" />
          </div>

          {/* Target + Workers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">Target *</label>
              <select value={form.target.includes("sub_contractor") ? "sub_contractor" : "labour"} onChange={(e) => setForm((prev) => ({ ...prev, target: e.target.value === "labour" ? ["labour"] : ["sub_contractor"] }))} className="mt-0.5 w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none">
                <option value="labour">Labour</option>
                <option value="sub_contractor">Sub-Contractor</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">Workers *</label>
              <input value={form.workersNeeded} onChange={(e) => setForm((prev) => ({ ...prev, workersNeeded: e.target.value }))} className="mt-0.5 w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none" />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">Required Skills *</label>
            <input value={form.skills} onChange={(e) => setForm((prev) => ({ ...prev, skills: e.target.value }))} className="mt-0.5 w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none" />
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">Description *</label>
            <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} rows={2} className="mt-0.5 w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none resize-none" />
          </div>

          {/* Location */}
          <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-700">
            <p className="text-[11px] font-bold uppercase text-gray-400 mb-2">Location</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">City *</label>
                <input value={form.locationDetails.city} onChange={(e) => setForm((prev) => ({ ...prev, locationDetails: { ...prev.locationDetails, city: e.target.value } }))} placeholder="Mumbai" className="mt-0.5 w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">Area *</label>
                <input value={form.locationDetails.area} onChange={(e) => setForm((prev) => ({ ...prev, locationDetails: { ...prev.locationDetails, area: e.target.value } }))} placeholder="Bandra" className="mt-0.5 w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">Pincode *</label>
                <input value={form.locationDetails.pincode} onChange={(e) => setForm((prev) => ({ ...prev, locationDetails: { ...prev.locationDetails, pincode: e.target.value } }))} placeholder="400050" className="mt-0.5 w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none" />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">State <span className="font-normal">(opt)</span></label>
                <input value={form.locationDetails.state} onChange={(e) => setForm((prev) => ({ ...prev, locationDetails: { ...prev.locationDetails, state: e.target.value } }))} placeholder="Maharashtra" className="mt-0.5 w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none" />
              </div>
              <div className="col-span-2">
                <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">Address <span className="font-normal">(opt)</span></label>
                <input value={form.locationDetails.address} onChange={(e) => setForm((prev) => ({ ...prev, locationDetails: { ...prev.locationDetails, address: e.target.value } }))} placeholder="Plot 12, Bandra West" className="mt-0.5 w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white outline-none" />
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">Site Images</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {form.images.map((url, idx) => (
                <div key={idx} className="relative w-14 h-14 group shrink-0">
                  <img src={url} alt="Site" className="w-full h-full object-cover rounded-lg border border-gray-200 dark:border-gray-600" />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                    className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-500 text-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => modalFileInputRef.current?.click()}
                disabled={isUploading}
                className="w-14 h-14 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shrink-0"
              >
                {isUploading
                  ? <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  : <><UploadCloud className="text-gray-400" size={16} /><span className="text-[9px] font-bold text-gray-400 mt-0.5">Add</span></>}
              </button>
            </div>
            <input type="file" ref={modalFileInputRef} onChange={handleModalImageUpload} className="hidden" accept="image/*" multiple />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <button type="button" onClick={onClose} className="px-4 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold">Cancel</button>
            <button type="button" onClick={() => onSave(form)} disabled={!canSave || saving || isUploading} className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
