"use client";

import React, { useEffect, useState } from "react";
import JobPostingCard from "../JobPostingCard";
import JobViewModal from "../JobViewModal";
import type { TabContentProps } from "../TabValueContentMap";
import { apiGet } from "@/lib/api-service";

export default function JobPostingsTabContent(props: TabContentProps) {
  const { onConnect } = props;
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

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
      setJobs(Array.isArray(list) ? list : []);
      setTotalPages(Number.isFinite(total) && total > 0 ? total : 1);
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

  const handleView = (jobId: string) => {
    const found = jobs.find((job: any) => getJobId(job) === String(jobId));
    if (found) {
      setSelectedJob(found);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Job Postings</h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
          Find active postings where labour support is needed.
        </p>
      </div>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                <p className="text-gray-600 dark:text-gray-400 text-lg">No job postings found right now.</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
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

      <JobViewModal
        job={selectedJob}
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        onConnect={onConnect}
      />
    </div>
  );
}
