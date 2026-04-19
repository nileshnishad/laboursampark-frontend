"use client";
import FeedbackModal from "@/app/components/common/FeedbackModal";
import React, { useCallback, useEffect, useState } from "react";
import CreateJobCard from "../CreateJobCard";
import JobViewModal from "../JobViewModal";
import JobStatCards, { type JobCardKey } from "../JobStatCards";
import PublishedJobCard, { type PublishedRequirement, type RequirementFormState, type ApiJob, mapApiJobToPublishedRequirement } from "../PublishedJobCard";
import { JobApplicationsModal, JobDetailsModal } from "./CreateJobTabContent";
import type { TabContentProps } from "../TabValueContentMap";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { apiGet, apiPost, apiPatch, apiPut } from "@/lib/api-service";
import { showSuccessToast, showErrorToast, showWarningToast } from "@/lib/toast-utils";
import { useAppDispatch } from "@/store/hooks";
import { fetchAppliedJobs, fetchAcceptedJobs, fetchCompletedJobs, toggleJobActivation, fetchJobEnquiries, fetchJobApplications, submitEnquiryFeedback } from "@/store/slices/jobEnquirySlice";
import { uploadFile } from "@/lib/s3-client";
import { UploadCloud, X, MapPin, Briefcase, Calendar, Users, Clock, CheckCircle, XCircle, Phone, MessageSquare, ImageIcon, Star } from "lucide-react";
import JobStatusCard, { extractJobCardData, formatJobDate } from "@/app/components/common/JobStatusCard";
import type { StatusBadgeConfig } from "@/app/components/common/StatusBadge";
import Pagination from "@/app/components/common/Pagination";
import { StarRatingInput } from "@/app/components/common/StarRating";

const INITIAL_FORM: RequirementFormState = {
  title: "",
  target: ["labour"],
  description: "",
  location: "",
  workersNeeded: "",
  skills: "",
  images: [],
  locationDetails: { city: "", state: "", area: "", pincode: "", address: "" },
};

export default function JobsTabContent(props: TabContentProps) {
  const { onConnect, userType } = props;
  const dispatch = useAppDispatch();
  const { appliedJobs, acceptedJobs, completedJobs, jobActivation, jobEnquiries } = useSelector((state: RootState) => state.jobEnquiry);
  const { user } = useSelector((state: RootState) => state.auth);
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [limit] = useState(10);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [activeCardKey, setActiveCardKey] = useState<JobCardKey>("available");
  const [publishedRequirements, setPublishedRequirements] = useState<PublishedRequirement[]>([]);
  const [postedJobsLoading, setPostedJobsLoading] = useState(false);
  const [postedJobsPage, setPostedJobsPage] = useState(1);
  const [postedJobsTotalPages, setPostedJobsTotalPages] = useState(1);
  const [totalPostedJobs, setTotalPostedJobs] = useState(0);
  const [form, setForm] = useState<RequirementFormState>(INITIAL_FORM);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [viewingApplicationsJob, setViewingApplicationsJob] = useState<PublishedRequirement | null>(null);
  const [editingJob, setEditingJob] = useState<PublishedRequirement | null>(null);
  const [updatingJob, setUpdatingJob] = useState(false);
  const [acceptedPage, setAcceptedPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [feedbackModal, setFeedbackModal] = useState<{ enquiryId: string; jobId: string; userId: string; posterName: string } | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackHover, setFeedbackHover] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  const getJobId = (job: any) => String(job?.id || job?._id || "");

  const fetchOpenJobs = async (pageToLoad: number) => {
    try {
      setJobsLoading(true);
      setJobsError(null);

      const response = await apiGet(`/api/jobs/getalljobs?page=${pageToLoad}&limit=${limit}`);
      if (!response.success) {
        throw new Error(response.error || response.message || "Failed to fetch jobs.");
      }

      const container = response.data?.data ?? response.data;
      const list = container?.jobs || container?.items || [];
      const pagination = container?.pagination || container?.meta || container?.data?.pagination || container?.data?.meta;
      const total = Number(pagination?.totalPages || pagination?.pages || container?.totalPages || 1);
      const count = Number(pagination?.total || pagination?.totalItems || container?.total || 0);
      setJobs(Array.isArray(list) ? list : []);
      setTotalPages(Number.isFinite(total) && total > 0 ? total : 1);
      setTotalJobs(count > 0 ? count : Array.isArray(list) ? list.length : 0);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch jobs.";
      setJobsError(message);
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    fetchOpenJobs(page);
  }, [page, limit]);

  const fetchPostedJobs = useCallback(async (pageToLoad: number) => {
    try {
      setPostedJobsLoading(true);
      const response = await apiGet(`/api/jobs/my-jobs?status=open&page=${pageToLoad}&limit=${limit}`);
      if (!response.success) throw new Error(response.error || response.message || "Failed to fetch posted jobs.");
      const container = response.data?.data ?? response.data;
      const list = container?.jobs || container?.items || [];
      const pagination = container?.pagination || container?.meta;
      const total = Number(pagination?.totalPages || pagination?.pages || 1);
      const count = Number(pagination?.total || pagination?.totalItems || 0);
      const mapped = (Array.isArray(list) ? list : []).map(mapApiJobToPublishedRequirement);
      setPublishedRequirements(mapped);
      setPostedJobsTotalPages(Number.isFinite(total) && total > 0 ? total : 1);
      setTotalPostedJobs(count > 0 ? count : mapped.length);
      // Fetch enquiries for each job so stats work
      mapped.forEach((job) => {
        if (job.id) dispatch(fetchJobEnquiries({ jobId: job.id }));
      });
    } catch (_e) {
      // silent fail
    } finally {
      setPostedJobsLoading(false);
    }
  }, [limit, dispatch]);

  useEffect(() => {
    if (userType === "sub_contractor") fetchPostedJobs(postedJobsPage);
  }, [userType, postedJobsPage]);

  // Fetch applied jobs and accepted jobs count on mount
  useEffect(() => {
    dispatch(fetchAppliedJobs());
    dispatch(fetchAcceptedJobs({ page: 1, limit: 10 }));
    dispatch(fetchCompletedJobs({ page: 1, limit: 10 }));
  }, [dispatch]);

  const isProfileHidden = user?.display === false;

  const updateField = <K extends keyof RequirementFormState>(field: K, value: RequirementFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateLocationField = (field: keyof RequirementFormState["locationDetails"], value: string) => {
    setForm((prev) => ({ ...prev, locationDetails: { ...prev.locationDetails, [field]: value } }));
  };

  const canSubmit = !!(form.title.trim() && form.target.length > 0 && form.description.trim() && form.locationDetails.city.trim() && form.locationDetails.area.trim() && form.locationDetails.pincode.trim() && form.workersNeeded.trim() && form.skills.trim());

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    const uploadedUrls: string[] = [];
    try {
      await Promise.all(
        Array.from(files).map(async (file) => {
          try {
            const cleanName = file.name.replace(/\s+/g, "_");
            const url = await uploadFile(cleanName, file, "contractor");
            uploadedUrls.push(url);
          } catch (err) {
            console.error(`Failed to upload ${file.name}:`, err);
          }
        })
      );
      if (uploadedUrls.length > 0) {
        updateField("images", [...form.images, ...uploadedUrls]);
        showSuccessToast(`Uploaded ${uploadedUrls.length} image(s)`);
      }
    } catch (error) {
      showErrorToast("An error occurred during upload.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    updateField("images", form.images.filter((_, i) => i !== index));
  };

  const handlePublishJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProfileHidden) { showWarningToast("Make profile visible to create a job."); return; }
    if (!canSubmit) return;
    const payload = {
      workTitle: form.title.trim(),
      target: form.target,
      description: form.description.trim(),
      workersNeeded: parseInt(form.workersNeeded) || 0,
      requiredSkills: form.skills.split(",").map((s: string) => s.trim()).filter(Boolean),
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
      if (!response.success) throw new Error(response.error || response.message || "Failed to publish job.");
      setForm(INITIAL_FORM);
      setIsCreateModalOpen(false);
      showSuccessToast("Job published successfully.");
      setPostedJobsPage(1);
      fetchPostedJobs(1);
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : "Failed to publish job.");
    } finally {
      setPublishing(false);
    }
  };

  const handleCardClick = (key: JobCardKey) => {
    setActiveCardKey(key);
    setMobileDetailOpen(true);
    if (key === "accepted") {
      dispatch(fetchAcceptedJobs({ page: acceptedPage, limit: 10 }));
    }
    if (key === "completed") {
      dispatch(fetchCompletedJobs({ page: completedPage, limit: 10 }));
    }
  };

  const formatTarget = (targets: string[]) => {
    return targets.map((item) => (item === "sub_contractor" ? "Sub_Contractor" : "Labour")).join(" + ");
  };

  const handleToggleJobVisibility = async (jobId: string, currentVisibility: boolean) => {
    try {
      const result = await dispatch(toggleJobActivation({ jobId, currentVisibility })).unwrap();
      setPublishedRequirements((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, visibility: result.visibility } : job
        )
      );
      showSuccessToast(result.visibility ? "Job made visible successfully." : "Job hidden successfully.");
    } catch (error) {
      showErrorToast(typeof error === "string" ? error : "Failed to update job visibility.");
    }
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
    if (!editingJob) return;
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
      const response = await updateJobOnServer(editingJob.id, payload);
      if (!response.success) throw new Error(response.error || response.message || "Failed to update job.");
      showSuccessToast("Job updated successfully.");
      setEditingJob(null);
      fetchPostedJobs(postedJobsPage);
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : "Failed to update job.");
    } finally {
      setUpdatingJob(false);
    }
  };

  const handleView = (jobId: string) => {
    const found = jobs.find((job: any) => getJobId(job) === String(jobId));
    if (found) {
      setSelectedJob(found);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackModal || feedbackRating === 0 || !feedbackText.trim()) return;
    try {
      setFeedbackSubmitting(true);
      await dispatch(submitEnquiryFeedback({
        enquiryId: feedbackModal.enquiryId,
        rating: feedbackRating,
        feedback: feedbackText.trim(),
      })).unwrap();
      showSuccessToast("Feedback submitted successfully!");
      setFeedbackModal(null);
      setFeedbackRating(0);
      setFeedbackHover(0);
      setFeedbackText("");
      dispatch(fetchCompletedJobs({ page: completedPage, limit: 10 }));
    } catch (error) {
      const message = typeof error === "string" ? error : "Failed to submit feedback.";
      showErrorToast(message);
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="">
        <JobStatCards
          userType={userType}
          totalAvailableJobs={totalJobs}
          totalPostedJobs={userType === "sub_contractor" ? totalPostedJobs : 0}
          totalAcceptedJobs={acceptedJobs.total}
          totalCompletedJobs={completedJobs.total}
          activeCardKey={activeCardKey}
          onCardClick={handleCardClick}
        />
      </div>

      {/* Content: full-screen overlay on mobile when card is tapped, always-inline on desktop */}
      <div className={
        mobileDetailOpen
          ? "fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 flex flex-col lg:static lg:inset-auto lg:z-auto lg:bg-transparent lg:block"
          : "hidden lg:block"
      }>
        {/* Mobile: back-navigation header */}
        {mobileDetailOpen && (
          <div className="lg:hidden sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 mb-4 flex items-center gap-3 shrink-0">
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
              {activeCardKey === "available" && "Available Jobs"}
              {activeCardKey === "posted" && "Jobs You Posted"}
              {activeCardKey === "applied" && "Jobs You Applied To"}
              {activeCardKey === "pending" && "Requests Received"}
              {activeCardKey === "accepted" && "Accepted Jobs"}
              {activeCardKey === "completed" && "Completed Jobs"}
            </h2>
          </div>
        )}
        <div className={mobileDetailOpen ? "flex-1 overflow-y-auto lg:overflow-visible lg:flex-none" : ""}>
          {/* Section label — desktop only */}
          <div className="hidden lg:block px-4 sm:px-6 py-3">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 capitalize">
              {activeCardKey === "available" && "Available Jobs"}
              {activeCardKey === "posted" && "Jobs You Posted"}
              {activeCardKey === "applied" && "Jobs You Applied To"}
              {activeCardKey === "pending" && "Requests Received"}
              {activeCardKey === "accepted" && "Accepted Jobs"}
              {activeCardKey === "completed" && "Completed Jobs"}
            </h3>
          </div>

          {/* Available Jobs section — existing paginated list */}
      {activeCardKey === "available" && (
        <>
          {jobsLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">Loading...</p>
            </div>
          ) : jobsError ? (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 text-lg">{jobsError}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-6">
                {jobs.length > 0 ? (
                  jobs.map((job: any) => (
                    <CreateJobCard
                      key={job.jobId || job.id || job._id}
                      job={job}
                      onApply={onConnect}
                      onView={handleView}
                      onSuccess={() => { fetchOpenJobs(page); dispatch(fetchAppliedJobs()); }}
                    />
                  ))
                ) : (
                  <div className="sm:col-span-2 lg:col-span-3 text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400 text-lg">No jobs available right now.</p>
                  </div>
                )}
              </div>
              <div className="mt-4 px-4 sm:px-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page <= 1 || jobsLoading}
                  className="text-xs px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                >
                  Previous
                </button>
                <p className="text-xs text-gray-600 dark:text-gray-300">Page {page} of {totalPages}</p>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page >= totalPages || jobsLoading}
                  className="text-xs px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </>
      )}

      {/* Posted jobs section (sub_contractor only) — same UI as contractor */}
      {activeCardKey === "posted" && userType === "sub_contractor" && (
        <>
          {/* Create Job Banner — matching contractor style */}
          <div className="px-4 sm:px-6 mb-4">
            <div className="relative overflow-hidden rounded-2xl border border-indigo-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 sm:p-3 shadow-sm">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
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
          </div>

          {/* Create Job Modal — full form with image upload & location details */}
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

                <form onSubmit={handlePublishJob} className="p-3 sm:p-4 flex flex-col gap-3">
                  {/* Title */}
                  <div>
                    <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Work Title *</label>
                    <input
                      value={form.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      placeholder="e.g., Building Renovation Work"
                      className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none"
                    />
                  </div>

                  {/* Workers */}
                  <div>
                    <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Workers Needed *</label>
                    <input
                      type="number"
                      value={form.workersNeeded}
                      onChange={(e) => updateField("workersNeeded", e.target.value)}
                      placeholder="e.g., 5"
                      className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none"
                    />
                  </div>

                  {/* Skills */}
                  <div>
                    <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Required Skills *</label>
                    <input
                      value={form.skills}
                      onChange={(e) => updateField("skills", e.target.value)}
                      placeholder="e.g., Mason, Carpenter"
                      className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-none"
                    />
                  </div>

                  {/* Description */}
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

                  {/* Location */}
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

                  {/* Images */}
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

          {/* Published Jobs Grid — same card style as contractor */}
          <div className="px-4 sm:px-6">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5 mb-5">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Published Jobs</h3>
                <button
                  type="button"
                  onClick={() => fetchPostedJobs(postedJobsPage)}
                  disabled={postedJobsLoading}
                  className="text-xs px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-60"
                >
                  Refresh
                </button>
              </div>

              {postedJobsLoading ? (
                <div className="space-y-3" aria-live="polite">
                  {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 animate-pulse">
                      <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
                      <div className="flex gap-2 mt-3">
                        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                      </div>
                    </div>
                  ))}
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
                        onShowDetails={() => setEditingJob(item)}
                        onToggleVisibility={handleToggleJobVisibility}
                        onViewApplications={(jobId) => {
                          const found = publishedRequirements.find((j) => j.id === jobId);
                          if (found) {
                            dispatch(fetchJobApplications({ jobId }));
                            setViewingApplicationsJob(found);
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
                  onClick={() => setPostedJobsPage((prev) => Math.max(1, prev - 1))}
                  disabled={postedJobsPage <= 1 || postedJobsLoading}
                  className="text-xs px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                >
                  Previous
                </button>
                <p className="text-xs text-gray-600 dark:text-gray-300">Page {postedJobsPage} of {postedJobsTotalPages}</p>
                <button
                  type="button"
                  onClick={() => setPostedJobsPage((prev) => Math.min(postedJobsTotalPages, prev + 1))}
                  disabled={postedJobsPage >= postedJobsTotalPages || postedJobsLoading}
                  className="text-xs px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Accepted Jobs — from dedicated API */}
      {activeCardKey === "accepted" && (() => {
        const acceptedList = acceptedJobs.jobs;
        if (acceptedJobs.loading) {
          return (
            <div className="text-center py-12 px-4 sm:px-6">
              <p className="text-gray-600 dark:text-gray-400">Loading accepted jobs...</p>
            </div>
          );
        }
        if (acceptedJobs.error) {
          return (
            <div className="text-center py-12 px-4 sm:px-6">
              <p className="text-red-600 dark:text-red-400 text-sm">{acceptedJobs.error}</p>
              <button type="button" onClick={() => dispatch(fetchAcceptedJobs({ page: acceptedPage, limit: 10 }))} className="mt-2 text-xs px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200">
                Retry
              </button>
            </div>
          );
        }
        if (acceptedList.length === 0) {
          return (
            <div className="text-center py-12 px-4 sm:px-6">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No accepted jobs found.</p>
            </div>
          );
        }

        const acceptedStatusConfig: StatusBadgeConfig = { bg: "bg-green-50 dark:bg-green-900/15", text: "text-green-600 dark:text-green-400", border: "border-green-100 dark:border-green-800/30", icon: <CheckCircle size={10} />, label: "Accepted" };

        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-4 sm:px-6 pb-4">
              {acceptedList.map((item: any) => (
                <JobStatusCard
                  key={item.enquiryId || item._id || item.id}
                  item={item}
                  statusConfig={acceptedStatusConfig}
                />
              ))}
            </div>
            <Pagination
              currentPage={acceptedPage}
              totalPages={acceptedJobs.totalPages}
              loading={acceptedJobs.loading}
              onPageChange={(p) => { setAcceptedPage(p); dispatch(fetchAcceptedJobs({ page: p, limit: 10 })); }}
            />
          </>
        );
      })()}

      {/* Completed Jobs — from dedicated API */}
      {activeCardKey === "completed" && (() => {
        const completedList = completedJobs.jobs;
        if (completedJobs.loading) {
          return (
            <div className="text-center py-12 px-4 sm:px-6">
              <p className="text-gray-600 dark:text-gray-400">Loading completed jobs...</p>
            </div>
          );
        }
        if (completedJobs.error) {
          return (
            <div className="text-center py-12 px-4 sm:px-6">
              <p className="text-red-600 dark:text-red-400 text-sm">{completedJobs.error}</p>
              <button type="button" onClick={() => dispatch(fetchCompletedJobs({ page: completedPage, limit: 10 }))} className="mt-2 text-xs px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200">
                Retry
              </button>
            </div>
          );
        }
        if (completedList.length === 0) {
          return (
            <div className="text-center py-12 px-4 sm:px-6">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No completed jobs found.</p>
            </div>
          );
        }

        const completedStatusConfig: StatusBadgeConfig = { bg: "bg-teal-50 dark:bg-teal-900/15", text: "text-teal-600 dark:text-teal-400", border: "border-teal-100 dark:border-teal-800/30", icon: <CheckCircle size={10} />, label: "Completed" };

        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-4 sm:px-6 pb-4">
              {completedList.map((item: any) => {
                const jobData = item?.job || item?.jobDetails || item;
                const poster = item?.postedBy || jobData?.createdBy;
                const posterName = poster?.fullName || poster?.name || "Contractor";
                return (
                  <JobStatusCard
                    key={item.enquiryId || item._id || item.id}
                    item={item}
                    statusConfig={completedStatusConfig}
                  >
                    {item?.feedbackSubmitted === false && (
                      <button
                        type="button"
                        onClick={() => setFeedbackModal({
                          enquiryId: item.enquiryId || item._id || item.id,
                          jobId: jobData?.jobId || jobData?.id || jobData?._id || "",
                          userId: poster?.userId || poster?._id || "",
                          posterName,
                        })}
                        className="w-full mt-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[11px] sm:text-xs font-semibold border border-amber-200 dark:border-amber-800/30 transition-colors"
                      >
                        <Star size={12} /> Submit Feedback
                      </button>
                    )}
                  </JobStatusCard>
                );
              })}
            </div>
            <Pagination
              currentPage={completedPage}
              totalPages={completedJobs.totalPages}
              loading={completedJobs.loading}
              onPageChange={(p) => { setCompletedPage(p); dispatch(fetchCompletedJobs({ page: p, limit: 10 })); }}
            />
          </>
        );
      })()}

      {/* Applied / status-filtered jobs from Redux */}
      {activeCardKey !== "available" && activeCardKey !== "posted" && activeCardKey !== "accepted" && activeCardKey !== "completed" && (() => {
        const all = appliedJobs.jobs;
        let filtered: any[];
        if (activeCardKey === "applied") {
          filtered = all;
        } else {
          filtered = all.filter((j: any) => {
            const s = (j?.applicationStatus || j?.status || j?.enquiryStatus || "").toLowerCase();
            return s === activeCardKey;
          });
        }
        if (appliedJobs.loading) {
          return (
            <div className="text-center py-12 px-4 sm:px-6">
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          );
        }
        if (filtered.length === 0) {
          return (
            <div className="text-center py-12 px-4 sm:px-6">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No jobs found for this category.</p>
            </div>
          );
        }

        
        const appliedStatusConfig: Record<string, StatusBadgeConfig> = {
          pending: { bg: "bg-amber-50 dark:bg-amber-900/15", text: "text-amber-600 dark:text-amber-400", border: "border-amber-100 dark:border-amber-800/30", icon: <Clock size={10} />, label: "Pending" },
          accepted: { bg: "bg-green-50 dark:bg-green-900/15", text: "text-green-600 dark:text-green-400", border: "border-green-100 dark:border-green-800/30", icon: <CheckCircle size={10} />, label: "Accepted" },
          rejected: { bg: "bg-red-50 dark:bg-red-900/15", text: "text-red-500 dark:text-red-400", border: "border-red-100 dark:border-red-800/30", icon: <XCircle size={10} />, label: "Rejected" },
          completed: { bg: "bg-teal-50 dark:bg-teal-900/15", text: "text-teal-600 dark:text-teal-400", border: "border-teal-100 dark:border-teal-800/30", icon: <CheckCircle size={10} />, label: "Completed" },
          withdrawn: { bg: "bg-zinc-50 dark:bg-zinc-800", text: "text-zinc-500 dark:text-zinc-400", border: "border-zinc-200 dark:border-zinc-700", icon: <XCircle size={10} />, label: "Withdrawn" },
        };

        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-4 sm:px-6 pb-6">
            {filtered.map((item: any) => {
              const appStatus = (item?.applicationStatus || item?.status || "pending").toLowerCase();
              const sc = appliedStatusConfig[appStatus] || appliedStatusConfig.pending;
              return (
                <JobStatusCard
                  key={item.enquiryId || item._id || item.id}
                  item={item}
                  statusConfig={sc}
                />
              );
            })}
          </div>
        );
      })()}
        </div>
      </div>

      <JobViewModal
        job={selectedJob}
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        onConnect={onConnect}
      />

      <JobApplicationsModal
        isOpen={Boolean(viewingApplicationsJob)}
        job={viewingApplicationsJob}
        onClose={() => setViewingApplicationsJob(null)}
        onConnect={onConnect}
      />

      <JobDetailsModal
        isOpen={Boolean(editingJob)}
        job={editingJob}
        saving={updatingJob}
        userType={userType}
        onClose={() => setEditingJob(null)}
        onSave={handleSaveJobDetails}
      />

      {/* Feedback Modal */}
      {feedbackModal && (
        <FeedbackModal
          posterName={feedbackModal.posterName}
          rating={feedbackRating}
          hover={feedbackHover}
          text={feedbackText}
          submitting={feedbackSubmitting}
          onRate={setFeedbackRating}
          onHover={setFeedbackHover}
          onText={setFeedbackText}
          onCancel={() => { setFeedbackModal(null); setFeedbackRating(0); setFeedbackHover(0); setFeedbackText(""); }}
          onSubmit={handleSubmitFeedback}
        />
      )}
    </div>
  );
}
