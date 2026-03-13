"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/store/hooks";
import type { RootState } from "@/store/store";
import { fetchJobHistoryDashboard } from "@/store/slices/jobEnquirySlice";
import type { TabContentProps } from "../TabValueContentMap";

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

export default function HistoryTabContent(_: TabContentProps) {
  const dispatch = useAppDispatch();
  const { jobHistoryDashboard } = useSelector((state: RootState) => state.jobEnquiry);

  useEffect(() => {
    dispatch(fetchJobHistoryDashboard({ page: 1, limit: 20 }));
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto">
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
        <div className="space-y-3 sm:space-y-4">
          {jobHistoryDashboard.entries.map((entry: any, index: number) => {
            const entryId = entry._id || entry.enquiryId || `history-${index}`;
            const workTitle = entry.jobDetails?.workTitle || entry.jobId?.workTitle || "Untitled Job";
            const description = entry.jobDetails?.description || entry.jobId?.description || "No description";
            const address = entry.jobId?.location?.address || "Not specified";
            const applicantName = entry.userDetails?.name || entry.userId?.fullName || "Unknown";
            const applicantType = entry.userDetails?.userType || entry.userId?.userType || "user";
            const applicantMobile = entry.userDetails?.mobile || entry.userId?.mobile || "Not provided";
            const status = String(entry.status || "applied").toLowerCase();
            const timeline = entry.timeline || {};

            return (
              <div
                key={entryId}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                      {workTitle}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {applicantName} ({String(applicantType).replace("_", " ")})
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusClassMap[status] || "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">Location:</span> {address}
                  </p>
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">Mobile:</span> {applicantMobile}
                  </p>
                  <p className="sm:col-span-2">
                    <span className="text-gray-500 dark:text-gray-400">Description:</span> {description}
                  </p>
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">Applied At:</span> {formatDate(timeline.appliedAt)}
                  </p>
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">Accepted At:</span> {formatDate(timeline.acceptedAt)}
                  </p>
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">Rejected At:</span> {formatDate(timeline.rejectedAt)}
                  </p>
                  <p>
                    <span className="text-gray-500 dark:text-gray-400">Rejection Reason:</span> {timeline.rejectionReason || "-"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {jobHistoryDashboard.pagination.total > 0 && (
        <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">
          Total: {jobHistoryDashboard.pagination.total} | Page: {jobHistoryDashboard.pagination.page} / {jobHistoryDashboard.pagination.pages || 1}
        </div>
      )}
    </div>
  );
}
