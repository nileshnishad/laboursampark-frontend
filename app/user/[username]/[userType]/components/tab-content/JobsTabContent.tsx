"use client";

import React, { useEffect, useState } from "react";
import JobPostingCard from "../JobPostingCard";
import JobViewModal from "../JobViewModal";
import JobStatCards, { type JobCardKey } from "../JobStatCards";
import type { TabContentProps } from "../TabValueContentMap";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { apiGet, apiPost } from "@/lib/api-service";
import { showSuccessToast, showErrorToast, showWarningToast } from "@/lib/toast-utils";
import { useAppDispatch } from "@/store/hooks";
import { fetchAppliedJobs } from "@/store/slices/jobEnquirySlice";

export default function JobsTabContent(props: TabContentProps) {
  const { onConnect, userType } = props;
  const dispatch = useAppDispatch();
  const { appliedJobs } = useSelector((state: RootState) => state.jobEnquiry);
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
  const [postedJobs, setPostedJobs] = useState<any[]>([]);
  const [postedJobsLoading, setPostedJobsLoading] = useState(false);
  const [postedJobsPage, setPostedJobsPage] = useState(1);
  const [postedJobsTotalPages, setPostedJobsTotalPages] = useState(1);
  const [totalPostedJobs, setTotalPostedJobs] = useState(0);
  const [createForm, setCreateForm] = useState({ title: "", description: "", location: "", workersNeeded: "", skills: "" });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  const getJobId = (job: any) => String(job?.id || job?._id || "");

  const fetchOpenJobs = async (pageToLoad: number) => {
    try {
      setJobsLoading(true);
      setJobsError(null);

      const response = await apiGet(`/api/jobs?status=open&page=${pageToLoad}&limit=${limit}`);
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

  const fetchPostedJobs = async (pageToLoad: number) => {
    try {
      setPostedJobsLoading(true);
      const response = await apiGet(`/api/jobs/my-jobs?status=open&page=${pageToLoad}&limit=${limit}`);
      if (!response.success) throw new Error(response.error || response.message || "Failed to fetch posted jobs.");
      const container = response.data?.data ?? response.data;
      const list = container?.jobs || container?.items || [];
      const pagination = container?.pagination || container?.meta;
      const total = Number(pagination?.totalPages || pagination?.pages || 1);
      const count = Number(pagination?.total || pagination?.totalItems || 0);
      setPostedJobs(Array.isArray(list) ? list : []);
      setPostedJobsTotalPages(Number.isFinite(total) && total > 0 ? total : 1);
      setTotalPostedJobs(count > 0 ? count : Array.isArray(list) ? list.length : 0);
    } catch (_e) {
      // silent fail
    } finally {
      setPostedJobsLoading(false);
    }
  };

  useEffect(() => {
    if (userType === "sub_contractor") fetchPostedJobs(postedJobsPage);
  }, [userType, postedJobsPage]);

  // Fetch applied jobs on mount using Redux
  useEffect(() => {
    dispatch(fetchAppliedJobs());
  }, [dispatch]);

  const isProfileHidden = user?.display === false;
  const canCreateSubmit = !!(createForm.title.trim() && createForm.description.trim() && createForm.location.trim() && createForm.workersNeeded.trim() && createForm.skills.trim());
  const updateCreateField = (field: string, value: string) => setCreateForm((prev) => ({ ...prev, [field]: value }));

  const handlePublishJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProfileHidden) { showWarningToast("Make profile visible to create a job."); return; }
    if (!canCreateSubmit) return;
    const payload = {
      workTitle: createForm.title.trim(),
      target: ["labour"],
      description: createForm.description.trim(),
      location: createForm.location.trim(),
      workersNeeded: createForm.workersNeeded.trim(),
      requiredSkills: createForm.skills.split(",").map((s: string) => s.trim()).filter(Boolean),
    };
    try {
      setPublishing(true);
      const response = await apiPost("/api/jobs/create", payload);
      if (!response.success) throw new Error(response.error || response.message || "Failed to publish job.");
      setCreateForm({ title: "", description: "", location: "", workersNeeded: "", skills: "" });
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
  };

  const handleView = (jobId: string) => {
    const found = jobs.find((job: any) => getJobId(job) === String(jobId));
    if (found) {
      setSelectedJob(found);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="px-4 sm:px-6 pt-5">
        <JobStatCards
          userType={userType}
          totalAvailableJobs={totalJobs}
          totalPostedJobs={userType === "sub_contractor" ? totalPostedJobs : 0}
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
              {activeCardKey === "available" && "Available Jobs"}
              {activeCardKey === "posted" && "Jobs You Posted"}
              {activeCardKey === "applied" && "Jobs You Applied To"}
              {activeCardKey === "pending" && "Requests Received"}
              {activeCardKey === "accepted" && "Accepted Jobs"}
              {activeCardKey === "completed" && "Completed Jobs"}
              {activeCardKey === "rejected" && "Rejected Jobs"}
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
              {activeCardKey === "rejected" && "Rejected Jobs"}
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
                    <JobPostingCard
                      key={job.id || job._id}
                      job={job}
                      onApply={onConnect}
                      onView={handleView}
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

      {/* Posted jobs section (sub_contractor only) */}
      {activeCardKey === "posted" && userType === "sub_contractor" && (
        <>
          {/* Create New Job banner */}
          <div className="px-4 sm:px-6 mb-4">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Create New Job</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Post a labour requirement and track all published jobs below.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  disabled={isProfileHidden}
                  className="shrink-0 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold"
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
          </div>

          {/* Create Job Modal */}
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
                <form onSubmit={handlePublishJob} className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Work Title *</label>
                    <input
                      value={createForm.title}
                      onChange={(e) => updateCreateField("title", e.target.value)}
                      placeholder="e.g., Basement slab and beam casting"
                      className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Location *</label>
                    <input
                      value={createForm.location}
                      onChange={(e) => updateCreateField("location", e.target.value)}
                      placeholder="e.g., Pune, Kharadi"
                      className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Workers Needed *</label>
                    <input
                      value={createForm.workersNeeded}
                      onChange={(e) => updateCreateField("workersNeeded", e.target.value)}
                      placeholder="e.g., 12"
                      className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Required Skills *</label>
                    <input
                      value={createForm.skills}
                      onChange={(e) => updateCreateField("skills", e.target.value)}
                      placeholder="e.g., Shuttering, RCC, Steel Fixing"
                      className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Requirement Details *</label>
                    <textarea
                      value={createForm.description}
                      onChange={(e) => updateCreateField("description", e.target.value)}
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
                      disabled={!canCreateSubmit || isProfileHidden || publishing}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold"
                    >
                      {publishing ? "Publishing..." : "Publish Job"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Published jobs grid */}
          <div className="px-4 sm:px-6 mb-2">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Published Jobs</h3>
              <button
                type="button"
                onClick={() => fetchPostedJobs(postedJobsPage)}
                disabled={postedJobsLoading}
                className="text-xs px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-60"
              >
                Refresh
              </button>
            </div>
          </div>

          {postedJobsLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">Loading...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-6">
                {postedJobs.length > 0 ? (
                  postedJobs.map((job: any) => (
                    <JobPostingCard
                      key={job.id || job._id}
                      job={job}
                      onView={() => setSelectedJob(job)}
                    />
                  ))
                ) : (
                  <div className="sm:col-span-2 lg:col-span-3 text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400 text-lg">No posted jobs found.</p>
                  </div>
                )}
              </div>
              <div className="mt-4 px-4 sm:px-6 flex items-center justify-between">
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
            </>
          )}
        </>
      )}

      {/* Applied / status-filtered jobs from Redux */}
      {activeCardKey !== "available" && activeCardKey !== "posted" && (() => {
        const all = appliedJobs.jobs;
        let filtered: any[];
        if (activeCardKey === "applied") {
          filtered = all;
        } else {
          filtered = all.filter((j: any) => {
            const s = (j?.status || j?.enquiryStatus || "").toLowerCase();
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
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-6 pb-6">
            {filtered.map((job: any) => (
              <JobPostingCard
                key={job.id || job._id || job.jobId}
                job={job?.jobDetails || job}
                onApply={onConnect}
                onView={(jobId) => {
                  const detail = job?.jobDetails || job;
                  setSelectedJob(detail);
                }}
              />
            ))}
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
    </div>
  );
}
