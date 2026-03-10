"use client";

import React, { useState } from "react";
import JobPostingCard from "../JobPostingCard";
import JobViewModal from "../JobViewModal";
import type { TabContentProps } from "../TabValueContentMap";

export default function JobsTabContent(props: TabContentProps) {
  const { usersLoading, usersError, filteredData, onConnect } = props;
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  const getJobId = (job: any) => String(job?.id || job?._id || "");

  const handleView = (jobId: string) => {
    const found = filteredData.find((job: any) => getJobId(job) === String(jobId));
    if (found) {
      setSelectedJob(found);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
     

      {usersLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading...</p>
        </div>
      ) : usersError ? (
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400 text-lg">{usersError}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredData.length > 0 ? (
            filteredData.map((job: any) => (
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
