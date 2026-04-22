"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/store/hooks";
import type { RootState } from "@/store/store";
import { fetchJobHistoryDashboard, fetchAppliedJobs } from "@/store/slices/jobEnquirySlice";
import type { TabContentProps } from "../TabValueContentMap";
import type { JobCardKey } from "../JobStatCards";

const statusClassMap: Record<string, string> = {
  accepted: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  applied: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  completed: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
};

export default function HistoryTabContent({ userType }: TabContentProps) {
  const dispatch = useAppDispatch();
  const { jobHistoryDashboard } = useSelector((state: RootState) => state.jobEnquiry);
  const [activeCardKey, setActiveCardKey] = useState<JobCardKey | null>(null);

  useEffect(() => {
    dispatch(fetchJobHistoryDashboard({ page: 1, limit: 20 }));
  }, [dispatch]);

  // Filter history entries by status when a card is clicked
  const filteredEntries = activeCardKey
    ? jobHistoryDashboard.entries.filter((entry: any) => {
        const status = (entry.status || "").toLowerCase();
        if (activeCardKey === "applied") return status === "applied" || status === "pending";
        return status === activeCardKey;
      })
    : jobHistoryDashboard.entries;

  return (
    <div className="">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Job History</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">A record of your job applications and activity.</p>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5 mb-4">
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Job history for your dashboard activity.
        </p>
      </div>

      {jobHistoryDashboard.loading ? (
        <div className="text-center py-10 text-gray-600 dark:text-gray-400">Loading history...</div>
      ) : jobHistoryDashboard.error ? (
        <div className="text-center py-10 text-red-600 dark:text-red-400">{jobHistoryDashboard.error}</div>
      ) : jobHistoryDashboard.entries.length === 0 ? (
        <div className="text-center py-10 text-gray-600 dark:text-gray-400">No history found.</div>
      ) : (
        <div className="space-y-6">
          {jobHistoryDashboard.entries.map((entry: any, index: number) => {
            const entryId = entry._id || entry.enquiryId || `history-${index}`;
            const job = entry.jobDetails || entry.jobId || {};
            const user = entry.userDetails || entry.userId || {};
            const timeline = entry.timeline || {};
            const status = String(entry.status || "applied").toLowerCase();
            const address = job.location?.address || [job.location?.area, job.location?.city, job.location?.state].filter(Boolean).join(", ") || "Not specified";
            const skills = (job.requiredSkills || user.skills || []).join(", ");
            const profilePhoto = user.profilePhotoUrl;
            const rating = user.rating;
            const experience = user.experience;
            const applicationMessage = entry.applicationMessage;

            return (
              <div
                key={entryId}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-md flex flex-col gap-4"
              >
                <div className="flex items-center gap-4">
                  {profilePhoto && (
                    <img
                      src={profilePhoto}
                      alt={user.name || user.fullName || "Profile"}
                      className="w-14 h-14 rounded-full border border-gray-300 object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {job.workTitle || "Untitled Job"}
                      </h3>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ml-2 ${statusClassMap[status] || "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {user.name || user.fullName || "Unknown"} ({String(user.userType || "user").replace("_", " ")})
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Mobile: {user.mobile || "Not provided"}
                    </div>
                  </div>
                  {typeof rating === "number" && (
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Rating</span>
                      <span className="text-base font-semibold text-yellow-500">{rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">Location:</span> {address}
                  </p>
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">Experience:</span> {experience || "-"}
                  </p>
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">Skills:</span> {skills || "-"}
                  </p>
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">Workers Needed:</span> {job.workersNeeded || "-"}
                  </p>
                  <p className="sm:col-span-2">
                    <span className="text-gray-500 dark:text-gray-400">Description:</span> {job.description || "No description"}
                  </p>
                  {applicationMessage && (
                    <p className="sm:col-span-2">
                      <span className="text-gray-500 dark:text-gray-400">Application Message:</span> {applicationMessage}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <div>
                    <span className="font-semibold">Applied At:</span> {formatDate(timeline.appliedAt)}
                  </div>
                  <div>
                    <span className="font-semibold">Accepted At:</span> {formatDate(timeline.acceptedAt)}
                  </div>
                  <div>
                    <span className="font-semibold">Completed At:</span> {formatDate(timeline.completedAt)}
                  </div>
                  <div>
                    <span className="font-semibold">Rejected At:</span> {formatDate(timeline.rejectedAt)}
                  </div>
                  {timeline.rejectionReason && (
                    <div className="sm:col-span-4">
                      <span className="font-semibold">Rejection Reason:</span> {timeline.rejectionReason}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {jobHistoryDashboard.pagination.total > 0 && (
        <div className="mt-4 text-xs text-gray-600 dark:text-gray-400 text-center">
          Total: {jobHistoryDashboard.pagination.total} | Page: {jobHistoryDashboard.pagination.page} / {jobHistoryDashboard.pagination.pages || 1}
        </div>
      )}
    </div>
  );
}
