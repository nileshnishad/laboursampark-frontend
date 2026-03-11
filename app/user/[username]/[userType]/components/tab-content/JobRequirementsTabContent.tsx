"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { TabContentProps } from "../TabValueContentMap";
import type { RootState } from "@/store/store";
import { apiGet, apiPatch, apiPost, apiPut } from "@/lib/api-service";
import { showErrorToast, showSuccessToast, showWarningToast } from "@/lib/toast-utils";

type RequirementTargetOption = "labour" | "sub_contractor";
type RequirementTarget = "labour" | "sub-contractor";

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
  const { usersLoading, usersError, filteredData, onConnect } = props;
  const { user } = useSelector((state: RootState) => state.auth);
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
  const isProfileHidden = user?.display === false;

  const logFieldUpdate = (field: keyof RequirementFormState, value: string) => {
    console.log("[JobRequirements] Field update:", { field, value });
  };

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
    if (targets.includes("sub-contractor")) return "sub_contractor";
    return "labour";
  };

  const getTargetArrayFromOption = (option: RequirementTargetOption): RequirementTarget[] => {
    return option === "labour" ? ["labour"] : ["sub-contractor"];
  };

  const formatTarget = (targets: RequirementTarget[]) => {
    return targets.map((item) => (item === "sub-contractor" ? "Sub-Contractor" : "Labour")).join(" + ");
  };

  const mapApiJobToRequirement = (job: ApiJob): PublishedRequirement => {
    const normalizedTargets = Array.isArray(job.target)
      ? job.target
          .map((item) => {
            if (item === "labour") return "labour";
            if (item === "sub-contractor" || item === "sub_contractor") return "sub-contractor";
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
      setPublishedRequirements(jobs.map(mapApiJobToRequirement));
      setTotalPages(totalPagesFromApi);
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

  return (
    <div className="max-w-7xl mx-auto">
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

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4">
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
                  <option value="labour">Labour</option>
                  <option value="sub_contractor">Contractor (Sub-Contractor)</option>
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
}: {
  item: PublishedRequirement;
  formatTarget: (targets: RequirementTarget[]) => string;
  onShowDetails: () => void;
}) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">{item.title}</h4>
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
              value={form.target.includes("sub-contractor") ? "sub_contractor" : "labour"}
              onChange={(e) => setForm((prev) => ({
                ...prev,
                target: e.target.value === "labour" ? ["labour"] : ["sub-contractor"],
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
