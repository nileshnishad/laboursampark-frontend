"use client";

import React, { useMemo, useState } from "react";
import type { TabContentProps } from "../TabValueContentMap";

export default function RequestsTabContent(props: TabContentProps) {
  const { userType, usersLoading, usersError, filteredData } = props;
  const [requestStatusMap, setRequestStatusMap] = useState<Record<string, "pending" | "accepted" | "rejected">>({});

  const requestRows = useMemo(() => {
    return filteredData.map((item: any, index: number) => {
      const id = item.id || item._id || `request-${index}`;
      const partyName = item.fullName || item.businessName || "User";
      const partyType = item.userType || (userType === "labour" ? "contractor" : "labour");
      const location = item.location || item.city || "Not specified";
      const skills = Array.isArray(item.skills) ? item.skills : [];
      return {
        id,
        partyName,
        partyType,
        location,
        skills,
        message:
          item.requestMessage ||
          item.bio ||
          "Interested to connect and discuss work details.",
      };
    });
  }, [filteredData, userType]);

  const updateRequestStatus = (id: string, status: "accepted" | "rejected") => {
    setRequestStatusMap((prev) => ({ ...prev, [id]: status }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Requests</h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
          Review connection requests and communicate with users for work discussions.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5 mb-4">
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          This section is for communication flow: users check jobs, send requests, and coordinate work details.
        </p>
      </div>

      {usersLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading...</p>
        </div>
      ) : usersError ? (
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400 text-lg">{usersError}</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {requestRows.length > 0 ? (
            requestRows.map((request) => {
              const status = requestStatusMap[request.id] || "pending";

              return (
                <div
                  key={request.id}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                        {request.partyName}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                        {request.partyType.replace("_", " ")} • {request.location}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        status === "accepted"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          : status === "rejected"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
                      }`}
                    >
                      {status === "pending" ? "Pending" : status === "accepted" ? "Accepted" : "Rejected"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-3">{request.message}</p>

                  {request.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {request.skills.slice(0, 5).map((skill: string, idx: number) => (
                        <span
                          key={`${request.id}-${skill}-${idx}`}
                          className="px-2 py-1 text-xs rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => updateRequestStatus(request.id, "accepted")}
                      className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => updateRequestStatus(request.id, "rejected")}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                    >
                      Message
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No pending requests found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
