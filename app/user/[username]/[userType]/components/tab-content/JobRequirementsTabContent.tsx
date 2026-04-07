"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { TabContentProps } from "../TabValueContentMap";
import type { RootState } from "@/store/store";
import { useAppDispatch } from "@/store/hooks";
import { toggleJobActivation, fetchJobEnquiries } from "@/store/slices/jobEnquirySlice";
import { apiGet, apiPatch, apiPost, apiPut } from "@/lib/api-service";
import { showErrorToast, showSuccessToast, showWarningToast } from "@/lib/toast-utils";
import JobStatCards, { type JobCardKey } from "../JobStatCards";

type RequirementTargetOption = "labour" | "sub_contractor";
type RequirementTarget = "labour" | "sub_contractor";

interface RequirementFormState {
  title: string;
  target: RequirementTarget[];
  description: string;
  location: string;
  workersNeeded: string;
  skills: string;
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
  location?: string;
  workersNeeded?: string | number;
  requiredSkills?: string[];
  skills?: string[];
  createdAt?: string;
}

const INITIAL_FORM: RequirementFormState = {
  title: "",
  target: ["labour"],
  description: "",
  location: "",
  workersNeeded: "",
  skills: "",
};

export default function JobRequirementsTabContent(props: TabContentProps) {
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
  const [selectedJob, setSelectedJob] = useState<PublishedRequirement | null>(null);
  const [jobEditForm, setJobEditForm] = useState<RequirementFormState>(INITIAL_FORM);
  const [updatingJob, setUpdatingJob] = useState(false);
  const [activeCardKey, setActiveCardKey] = useState<JobCardKey>("posted");
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const isProfileHidden = user?.display === false;

  // Applied Jobs state
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [appliedJobsLoading, setAppliedJobsLoading] = useState(false);
  const [appliedJobsError, setAppliedJobsError] = useState<string | null>(null);
  const [appliedJobsPage, setAppliedJobsPage] = useState(1);
  const [appliedJobsTotalPages, setAppliedJobsTotalPages] = useState(1);
  const [appliedJobsLimit] = useState(10);

  const logFieldUpdate = (field: keyof RequirementFormState, value: string) => {
    console.log("[JobRequirements] Field update:", { field, value });
  };

  // Fetch applied jobs on component mount
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      setAppliedJobsLoading(true);
      setAppliedJobsError(null);
      try {
        const response = await apiGet(
          `/api/job-enquiries/applied/jobs?page=1&limit=${appliedJobsLimit}`
        );

        if (!response.success) {
          throw new Error(response.error || "Failed to fetch applied jobs");
        }

        const data = response.data || response;
        const jobs = data.appliedJobs || data.jobs || data.items || [];
        const pagination = data.pagination || data.meta || {};

        setAppliedJobs(jobs);
        setAppliedJobsTotalPages(
          Number(pagination.totalPages || pagination.pages || 1)
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error fetching applied jobs";
        setAppliedJobsError(message);
      } finally {
        setAppliedJobsLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [appliedJobsLimit]);

  // Update applied jobs when pagination page changes
  useEffect(() => {
    if (appliedJobsPage === 1) return;

    const fetchAppliedJobs = async () => {
      setAppliedJobsLoading(true);
      setAppliedJobsError(null);
      try {
        const response = await apiGet(
          `/api/job-enquiries/applied/jobs?page=${appliedJobsPage}&limit=${appliedJobsLimit}`
        );

        if (!response.success) {
          throw new Error(response.error || "Failed to fetch applied jobs");
        }

        const data = response.data || response;
        const jobs = data.appliedJobs || data.jobs || data.items || [];
        const pagination = data.pagination || data.meta || {};

        setAppliedJobs(jobs);
        setAppliedJobsTotalPages(
          Number(pagination.totalPages || pagination.pages || 1)
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error fetching applied jobs";
        setAppliedJobsError(message);
        showErrorToast(message);
      } finally {
        setAppliedJobsLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [appliedJobsPage, appliedJobsLimit]);


  const canSubmit = useMemo(() => {
    return (
      form.title.trim() &&
      form.target.length > 0 &&
      form.description.trim() &&
      form.location.trim() &&
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
      location: typeof job.location === "string" ? job.location : "",
      workersNeeded: String(job.workersNeeded ?? ""),
      skills: skillsArray.join(", "),
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
    logFieldUpdate(field, String(value));
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePublishRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[JobRequirements] Submit attempt:", form);

    if (isProfileHidden) {
      showWarningToast("Make profile visible to create a job.");
      return;
    }
    if (!canSubmit) return;

    const payload = {
      workTitle: form.title.trim(),
      target: form.target,
      description: form.description.trim(),
      location: form.location.trim(),
      workersNeeded: form.workersNeeded.trim(),
      requiredSkills: form.skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      setPublishing(true);
      const response = await apiPost("/api/jobs/create", payload);

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
    setJobEditForm({
      title: job.title,
      target: job.target,
      description: job.description,
      location: job.location,
      workersNeeded: job.workersNeeded,
      skills: job.skills,
    });
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
      location: updated.location.trim(),
      workersNeeded: updated.workersNeeded.trim(),
      requiredSkills: updated.skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      setUpdatingJob(true);
      await updateJobOnServer(selectedJob.id, payload);
      setSelectedJob(null);
      await fetchMyJobs(page);
      showSuccessToast("Job updated successfully.");
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

  const handleCardClick = (key: JobCardKey) => {
    setActiveCardKey(key);
    setMobileDetailOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="px-4 sm:px-6 pt-5">
        <JobStatCards
          userType={userType}
          totalPostedJobs={publishedRequirements.length}
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
          {activeCardKey !== "posted" && (() => {
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

      {activeCardKey === "posted" && (
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5 mb-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Create New Job</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Post requirements quickly and track all published jobs below.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            disabled={isProfileHidden}
            className="shrink-0 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold"
          >
            Create Job
          </button>
        </div>
        {isProfileHidden && (
          <p className="mt-3 text-xs text-orange-700 dark:text-orange-300">
            Make profile visible to create a job.
          </p>
        )}
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
              className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
            >
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Work Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g., Basement slab and beam casting"
                  className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Target *</label>
                <select
                  value={getTargetOptionFromArray(form.target)}
                  onChange={(e) =>
                    updateField(
                      "target",
                      getTargetArrayFromOption(e.target.value as RequirementTargetOption)
                    )
                  }
                  className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                    {user.userType === "sub_contractor" ? (
                      <>
                        <option value="labour">Labour</option>
                        
                      </>
                    ) : (
                      <>
                        <option value="labour">Labour</option>
                        <option value="sub_contractor">Sub-Contractor</option>
                      </>
                    )}
                  </select>
                </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Location *</label>
                <input
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="e.g., Pune, Kharadi"
                  className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Workers Needed *</label>
                <input
                  value={form.workersNeeded}
                  onChange={(e) => updateField("workersNeeded", e.target.value)}
                  placeholder="e.g., 12"
                  className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Required Skills *</label>
                <input
                  value={form.skills}
                  onChange={(e) => updateField("skills", e.target.value)}
                  placeholder="e.g., Shuttering, RCC, Steel Fixing"
                  className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Requirement Details *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={4}
                  placeholder="Explain work scope, quality expectations, start date, and completion terms."
                  className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit || isProfileHidden || publishing}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold"
                >
                  {publishing ? "Publishing..." : "Publish Requirement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeCardKey === "posted" && (
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
        onClose={() => setSelectedJob(null)}
        onSave={handleSaveJobDetails}
      />

     

    </div>
  );
}

function PublishedJobCard({
  item,
  formatTarget,
  onShowDetails,
  onToggleVisibility,
  toggling,
}: {
  item: PublishedRequirement;
  formatTarget: (targets: RequirementTarget[]) => string;
  onShowDetails: () => void;
  onToggleVisibility: (jobId: string, currentVisibility: boolean) => void;
  toggling: boolean;
}) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">{item.title}</h4>
        <label className="inline-flex items-center gap-2 cursor-pointer select-none shrink-0">
          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
            {item.visibility ? "Visible" : "Hidden"}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={item.visibility}
            aria-label="Toggle published job visibility"
            onClick={() => onToggleVisibility(item.id, item.visibility)}
            disabled={toggling}
            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
              item.visibility ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
            } ${toggling ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                item.visibility ? "translate-x-5.5" : "translate-x-1"
              }`}
            />
          </button>
        </label>
      </div>

      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">Created: {item.createdAt || "-"}</p>

      <div className="mt-2 space-y-1.5 text-xs">
        <div className="flex items-start gap-2">
          <span className="w-16 shrink-0 text-gray-500 dark:text-gray-400">Target</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">{formatTarget(item.target)}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-16 shrink-0 text-gray-500 dark:text-gray-400">Workers</span>
          <span className="font-medium text-gray-800 dark:text-gray-200">{item.workersNeeded || "-"}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-16 shrink-0 text-gray-500 dark:text-gray-400">Location</span>
          <span className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2">{item.location || "-"}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="w-16 shrink-0 text-gray-500 dark:text-gray-400">Skills</span>
          <span className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2">{item.skills || "-"}</span>
        </div>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{item.description}</p>

      <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
        <button
          type="button"
          onClick={onShowDetails}
          className="w-full text-xs px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

function JobDetailsModal({ isOpen, job, saving, onClose, onSave }: JobDetailsModalProps) {
  const [form, setForm] = useState<RequirementFormState>(INITIAL_FORM);

  useEffect(() => {
    if (job) {
      setForm({
        title: job.title,
        target: job.target,
        description: job.description,
        location: job.location,
        workersNeeded: job.workersNeeded,
        skills: job.skills,
      });
    }
  }, [job]);

  if (!isOpen || !job) return null;

  const canSave =
    form.title.trim() &&
    form.target.length > 0 &&
    form.description.trim() &&
    form.location.trim() &&
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

        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Work Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Target *</label>
            <select
              value={form.target.includes("sub_contractor") ? "sub_contractor" : "labour"}
              onChange={(e) => setForm((prev) => ({
                ...prev,
                target: e.target.value === "labour" ? ["labour"] : ["sub_contractor"],
              }))}
              className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="labour">Labour</option>
              <option value="sub_contractor">Contractor (Sub-Contractor)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Location *</label>
            <input
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Workers Needed *</label>
            <input
              value={form.workersNeeded}
              onChange={(e) => setForm((prev) => ({ ...prev, workersNeeded: e.target.value }))}
              className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Required Skills *</label>
            <input
              value={form.skills}
              onChange={(e) => setForm((prev) => ({ ...prev, skills: e.target.value }))}
              className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Requirement Details *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="sm:col-span-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSave(form)}
              disabled={!canSave || saving}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
