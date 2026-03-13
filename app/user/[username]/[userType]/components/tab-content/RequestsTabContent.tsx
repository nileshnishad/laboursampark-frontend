"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { apiGet } from "@/lib/api-service";
import { showErrorToast, showSuccessToast } from "@/lib/toast-utils";
import { useAppDispatch } from "@/store/hooks";
import {
  acceptJobEnquiry,
  completeJob,
  fetchAppliedJobs,
  fetchJobEnquiries,
  fetchReceivedRequests,
  rejectJobEnquiry,
  submitUserReview,
} from "@/store/slices/jobEnquirySlice";
import type { TabContentProps } from "../TabValueContentMap";

type RequestTab = "sent" | "received" | "accepted" | "completed" | "rejected";
type RequestDecision = "accepted" | "rejected";

export default function RequestsTabContent(props: TabContentProps) {
  const { userType, usersLoading, usersError, filteredData } = props;
  const { user } = useSelector((state: RootState) => state.auth);
  const { appliedJobs: appliedJobsFromRedux } = useSelector(
    (state: RootState) => state.jobEnquiry,
  );
  const { jobEnquiries: jobEnquiriesFromRedux } = useSelector(
    (state: RootState) => state.jobEnquiry,
  );
  const { enquiryRejection: enquiryRejectionFromRedux } = useSelector(
    (state: RootState) => state.jobEnquiry,
  );
  const { enquiryAcceptance: enquiryAcceptanceFromRedux } = useSelector(
    (state: RootState) => state.jobEnquiry,
  );
  const { jobCompletion: jobCompletionFromRedux } = useSelector(
    (state: RootState) => state.jobEnquiry,
  );
  const { reviewSubmission: reviewSubmissionFromRedux } = useSelector(
    (state: RootState) => state.jobEnquiry,
  );
  const { receivedRequests: receivedRequestsFromRedux } = useSelector(
    (state: RootState) => state.jobEnquiry,
  );
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<RequestTab>(
    userType === "contractor" ? "received" : "sent",
  );
  const [contractorJobs, setContractorJobs] = useState<any[]>([]);
  const [contractorJobsLoading, setContractorJobsLoading] = useState(false);
  const [requestStatusMap, setRequestStatusMap] = useState<
    Record<string, "pending" | "accepted" | "rejected" | "completed">
  >({});
  const [completedJobMap, setCompletedJobMap] = useState<
    Record<string, boolean>
  >({});
  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    decision: RequestDecision;
    label: string;
  } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [feedbackModal, setFeedbackModal] = useState<{
    jobId: string;
    userId: string;
    userName: string;
  } | null>(null);
  const getDefaultFeedbackForm = () => ({
    rating: 0,
    feedback: "",
    ratingDetails: {
      workQuality: 0,
      communication: 0,
      timeliness: 0,
      professionalism: 0,
    },
  });
  const [feedbackForm, setFeedbackForm] = useState(getDefaultFeedbackForm);

  useEffect(() => {
    // Always start with a fresh form whenever modal opens.
    if (feedbackModal) {
      setFeedbackForm(getDefaultFeedbackForm());
    }
  }, [feedbackModal]);

  // Fetch applied jobs on mount using Redux (only for non-contractors)
  useEffect(() => {
    if (userType !== "contractor") {
      dispatch(fetchAppliedJobs());
    }
  }, [dispatch, userType]);

  // Fetch contractor's posted jobs and their enquiries
  useEffect(() => {
    if (userType === "contractor") {
      const fetchContractorJobsAndEnquiries = async () => {
        setContractorJobsLoading(true);
        try {
          const response = await apiGet(
            `/api/jobs/my-jobs?status&page=1&limit=100`,
          );
          if (response.success) {
            const data = response.data.data || response.data || response;
            const jobs = data.jobs || data.data || [];
            setContractorJobs(jobs);

            // Fetch enquiries for each job
            for (const job of jobs) {
              const jobId = job.id || job._id;
              if (jobId) {
                dispatch(fetchJobEnquiries({ jobId }));
              }
            }
          }
        } catch (error) {
          console.error("Failed to fetch contractor jobs:", error);
        } finally {
          setContractorJobsLoading(false);
        }
      };

      fetchContractorJobsAndEnquiries();
    }
  }, [dispatch, userType]);


  const { sentRequests, receivedRequests } = useMemo(() => {
    const sent: any[] = [];
    const received: any[] = [];

    filteredData.forEach((item: any, index: number) => {
      const id = item.id || item._id || `request-${index}`;
      const partyName = item.fullName || item.businessName || "User";
      const partyType =
        item.userType || (userType === "labour" ? "contractor" : "labour");
      const location = item.location || item.city || "Not specified";
      const skills = Array.isArray(item.skills) ? item.skills : [];
      const message =
        item.requestMessage ||
        item.bio ||
        "Interested to connect and discuss work details.";

      const request = {
        id,
        partyName,
        partyType,
        location,
        skills,
        message,
      };
      const isSent =
        item.direction === "sent" ||
        item.senderId === user?.id ||
        item.sentByMe === true;

      if (isSent) {
        sent.push(request);
      } else {
        received.push(request);
      }
    });

    return { sentRequests: sent, receivedRequests: received };
  }, [filteredData, userType, user?.id]);

  const requestRows =
    activeTab === "sent"
      ? sentRequests
      : activeTab === "accepted"
        ? receivedRequests.filter(
            (request) => requestStatusMap[request.id] === "accepted",
          )
        : activeTab === "completed"
          ? receivedRequests.filter(
              (request) => requestStatusMap[request.id] === "completed",
            )
        : activeTab === "rejected"
          ? receivedRequests.filter(
              (request) => requestStatusMap[request.id] === "rejected",
            )
          : receivedRequests.filter((request) => {
              const status = requestStatusMap[request.id] || "pending";
              return (
                status !== "rejected" &&
                status !== "accepted" &&
                status !== "completed"
              );
            });

  const contractorEnquiriesByJob = useMemo(() => {
    const byJob: Record<string, any[]> = {};

    contractorJobs.forEach((job: any) => {
      const jobId = job.id || job._id;
      if (!jobId) return;

      const enquiries = jobEnquiriesFromRedux.enquiries[jobId] || [];
      const filtered = enquiries.filter((enquiry: any, idx: number) => {
        const enquiryId = enquiry.id || enquiry._id || `${jobId}-${idx}`;
        const status =
          requestStatusMap[enquiryId] || enquiry.status || "pending";
        const enquiryJobStatus = String(enquiry.jobId?.status || "").toLowerCase();
        const listJobStatus = String(job.status || "").toLowerCase();
        const isCompleted =
          status === "completed" ||
          enquiryJobStatus === "completed" ||
          listJobStatus === "completed" ||
          Boolean(completedJobMap[jobId]);

        if (activeTab === "accepted") {
          return status === "accepted" && !isCompleted;
        }

        if (activeTab === "completed") {
          return isCompleted;
        }

        if (activeTab === "rejected") {
          return status === "rejected";
        }

        return (
          status !== "rejected" &&
          status !== "accepted" &&
          status !== "completed"
        );
      });

      if (filtered.length > 0) {
        byJob[jobId] = filtered;
      }
    });

    return byJob;
  }, [
    activeTab,
    completedJobMap,
    contractorJobs,
    jobEnquiriesFromRedux.enquiries,
    requestStatusMap,
  ]);

  const contractorJobStatusById = useMemo(() => {
    const map: Record<string, string> = {};
    contractorJobs.forEach((job: any) => {
      const jobId = job.id || job._id;
      if (!jobId) return;
      map[jobId] = String(job.status || "").toLowerCase();
    });
    return map;
  }, [contractorJobs]);

  const contractorReceivedCount = useMemo(() => {
    return Object.entries(jobEnquiriesFromRedux.enquiries || {}).reduce(
      (total, [jobId, enquiries]) => {
        if (!Array.isArray(enquiries)) return total;
        return (
          total +
          enquiries.filter((enquiry: any, idx: number) => {
            const enquiryId = enquiry.id || enquiry._id || `${jobId}-${idx}`;
            const status =
              requestStatusMap[enquiryId] || enquiry.status || "pending";
            const enquiryJobStatus = String(enquiry.jobId?.status || "").toLowerCase();
            const listJobStatus = contractorJobStatusById[jobId] || "";
            const isCompleted =
              status === "completed" ||
              enquiryJobStatus === "completed" ||
              listJobStatus === "completed" ||
              Boolean(completedJobMap[jobId]);
            return (
              status !== "rejected" &&
              status !== "accepted" &&
              !isCompleted
            );
          }).length
        );
      },
      0,
    );
  }, [
    completedJobMap,
    contractorJobStatusById,
    jobEnquiriesFromRedux.enquiries,
    requestStatusMap,
  ]);

  const contractorAcceptedCount = useMemo(() => {
    return Object.entries(jobEnquiriesFromRedux.enquiries || {}).reduce(
      (total, [jobId, enquiries]) => {
        if (!Array.isArray(enquiries)) return total;
        return (
          total +
          enquiries.filter((enquiry: any, idx: number) => {
            const enquiryId = enquiry.id || enquiry._id || `${jobId}-${idx}`;
            const status =
              requestStatusMap[enquiryId] || enquiry.status || "pending";
            const enquiryJobStatus = String(enquiry.jobId?.status || "").toLowerCase();
            const listJobStatus = contractorJobStatusById[jobId] || "";
            const isCompleted =
              status === "completed" ||
              enquiryJobStatus === "completed" ||
              listJobStatus === "completed" ||
              Boolean(completedJobMap[jobId]);
            return status === "accepted" && !isCompleted;
          }).length
        );
      },
      0,
    );
  }, [
    completedJobMap,
    contractorJobStatusById,
    jobEnquiriesFromRedux.enquiries,
    requestStatusMap,
  ]);

  const contractorCompletedCount = useMemo(() => {
    return Object.entries(jobEnquiriesFromRedux.enquiries || {}).reduce(
      (total, [jobId, enquiries]) => {
        if (!Array.isArray(enquiries)) return total;
        return (
          total +
          enquiries.filter((enquiry: any, idx: number) => {
            const enquiryId = enquiry.id || enquiry._id || `${jobId}-${idx}`;
            const status =
              requestStatusMap[enquiryId] || enquiry.status || "pending";
            const enquiryJobStatus = String(enquiry.jobId?.status || "").toLowerCase();
            const listJobStatus = contractorJobStatusById[jobId] || "";
            const isCompleted =
              status === "completed" ||
              enquiryJobStatus === "completed" ||
              listJobStatus === "completed" ||
              Boolean(completedJobMap[jobId]);
            return isCompleted;
          }).length
        );
      },
      0,
    );
  }, [
    completedJobMap,
    contractorJobStatusById,
    jobEnquiriesFromRedux.enquiries,
    requestStatusMap,
  ]);

  const contractorRejectedCount = useMemo(() => {
    return Object.entries(jobEnquiriesFromRedux.enquiries || {}).reduce(
      (total, [jobId, enquiries]) => {
        if (!Array.isArray(enquiries)) return total;
        return (
          total +
          enquiries.filter((enquiry: any, idx: number) => {
            const enquiryId = enquiry.id || enquiry._id || `${jobId}-${idx}`;
            const status =
              requestStatusMap[enquiryId] || enquiry.status || "pending";
            return status === "rejected";
          }).length
        );
      },
      0,
    );
  }, [jobEnquiriesFromRedux.enquiries, requestStatusMap]);

  const nonContractorRejectedCount = useMemo(() => {
    return receivedRequests.filter(
      (request) => requestStatusMap[request.id] === "rejected",
    ).length;
  }, [receivedRequests, requestStatusMap]);

  const nonContractorAcceptedCount = useMemo(() => {
    return receivedRequests.filter(
      (request) => requestStatusMap[request.id] === "accepted",
    ).length;
  }, [receivedRequests, requestStatusMap]);

  const nonContractorCompletedCount = useMemo(() => {
    return receivedRequests.filter(
      (request) => requestStatusMap[request.id] === "completed",
    ).length;
  }, [receivedRequests, requestStatusMap]);

  const nonContractorReceivedCount = useMemo(() => {
    return receivedRequests.filter((request) => {
      const status = requestStatusMap[request.id] || "pending";
      return (
        status !== "rejected" && status !== "accepted" && status !== "completed"
      );
    }).length;
  }, [receivedRequests, requestStatusMap]);

  const hasVisibleContractorEnquiries = useMemo(() => {
    return Object.keys(contractorEnquiriesByJob).length > 0;
  }, [contractorEnquiriesByJob]);

  const enquiryCount =
    userType === "contractor"
      ? contractorReceivedCount
      : nonContractorReceivedCount;

  const updateRequestStatus = (id: string, status: "accepted" | "rejected") => {
    setRequestStatusMap((prev) => ({ ...prev, [id]: status }));
  };

  const openDecisionConfirm = (
    id: string,
    decision: RequestDecision,
    label: string,
  ) => {
    setConfirmAction({ id, decision, label });
    setRejectReason("");
  };

  const handleConfirmDecision = async () => {
    if (!confirmAction) return;

    if (confirmAction.decision === "accepted") {
      try {
        await dispatch(
          acceptJobEnquiry({
            enquiryId: confirmAction.id,
          }),
        ).unwrap();
        showSuccessToast("Request accepted successfully.");
      } catch (error) {
        const message =
          typeof error === "string" ? error : "Failed to accept request.";
        showErrorToast(message);
        return;
      }
    }

    if (confirmAction.decision === "rejected") {
      try {
        await dispatch(
          rejectJobEnquiry({
            enquiryId: confirmAction.id,
            reason: rejectReason,
          }),
        ).unwrap();
        showSuccessToast("Request rejected successfully.");
      } catch (error) {
        const message =
          typeof error === "string" ? error : "Failed to reject request.";
        showErrorToast(message);
        return;
      }
    }

    updateRequestStatus(confirmAction.id, confirmAction.decision);
    setConfirmAction(null);
    setRejectReason("");
  };

  const openFeedbackModal = (
    jobId: string,
    userId: string,
    userName: string,
  ) => {
    setFeedbackModal({ jobId, userId, userName });
    setFeedbackForm(getDefaultFeedbackForm());
  };

  const closeFeedbackModal = () => {
    setFeedbackModal(null);
    setFeedbackForm(getDefaultFeedbackForm());
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackModal) return;
    const hasAllRatings =
      feedbackForm.rating > 0 &&
      feedbackForm.ratingDetails.workQuality > 0 &&
      feedbackForm.ratingDetails.communication > 0 &&
      feedbackForm.ratingDetails.timeliness > 0 &&
      feedbackForm.ratingDetails.professionalism > 0;

    if (!hasAllRatings) {
      showErrorToast("Please select all star ratings before submitting feedback.");
      return;
    }

    try {
      await dispatch(
        submitUserReview({
          jobId: feedbackModal.jobId,
          userId: feedbackModal.userId,
          rating: feedbackForm.rating,
          feedback: feedbackForm.feedback.trim(),
          ratingDetails: feedbackForm.ratingDetails,
          attachments: [],
        }),
      ).unwrap();

      showSuccessToast("Feedback submitted successfully.");
      closeFeedbackModal();
    } catch (error) {
      const message =
        typeof error === "string" ? error : "Failed to submit feedback.";
      showErrorToast(message);
    }
  };

  const handleCompleteJob = async (jobId: string, enquiryId: string) => {
    if (completedJobMap[jobId]) {
      return;
    }

    try {
      await dispatch(completeJob({ jobId })).unwrap();
      showSuccessToast("Job marked as completed.");
      setRequestStatusMap((prev) => ({ ...prev, [enquiryId]: "completed" }));
      setCompletedJobMap((prev) => ({ ...prev, [jobId]: true }));
    } catch (error) {
      const message =
        typeof error === "string" ? error : "Failed to complete job.";
      showErrorToast(message);
    }
  };

  const ratingTextMap: Record<number, string> = {
    0: "Not rated",
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  const renderStarRating = (
    label: string,
    value: number,
    onSelect: (nextValue: number) => void,
    helperText?: string,
  ) => {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-3">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {label}
        </p>
        <div
          className="mt-2 flex items-center gap-1.5"
          role="radiogroup"
          aria-label={label}
        >
          {[1, 2, 3, 4, 5].map((star) => {
            const active = star <= value;
            return (
              <button
                key={`${label}-${star}`}
                type="button"
                onClick={() => onSelect(star)}
                aria-label={`${label}: ${star} star${star > 1 ? "s" : ""}`}
                aria-checked={value === star}
                role="radio"
                className="focus:outline-none focus:ring-2 focus:ring-amber-500/60 rounded"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`h-6 w-6 transition-colors ${
                    active
                      ? "text-amber-500"
                      : "text-gray-300 dark:text-gray-600 hover:text-amber-300"
                  }`}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.01 3.11a1 1 0 0 0 .95.69h3.27c.969 0 1.371 1.24.588 1.81l-2.645 1.922a1 1 0 0 0-.364 1.118l1.01 3.11c.3.922-.755 1.688-1.539 1.118l-2.645-1.922a1 1 0 0 0-1.176 0l-2.645 1.922c-.783.57-1.838-.196-1.539-1.118l1.01-3.11a1 1 0 0 0-.364-1.118L2.23 8.537c-.783-.57-.38-1.81.588-1.81h3.27a1 1 0 0 0 .95-.69l1.01-3.11z" />
                </svg>
              </button>
            );
          })}
          <span className="ml-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
            {ratingTextMap[value]}
          </span>
        </div>
        {helperText && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Info Box */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5 mb-4">
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          This section is for communication: users check jobs, send requests,
          and coordinate work details.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700">
        {userType !== "contractor" && (
          <button
            onClick={() => setActiveTab("sent")}
            className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === "sent"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
            }`}
          >
            Jobs Applied ({appliedJobsFromRedux.jobs.length})
          </button>
        )}

        <button
          onClick={() => setActiveTab("received")}
          className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === "received"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
          }`}
        >
          Requests Received ({enquiryCount})
        </button>

        <button
          onClick={() => setActiveTab("accepted")}
          className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === "accepted"
              ? "border-green-600 text-green-600 dark:text-green-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
          }`}
        >
          Accepted (
          {userType === "contractor"
            ? contractorAcceptedCount
            : nonContractorAcceptedCount}
          )
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === "completed"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
          }`}
        >
          Completed (
          {userType === "contractor"
            ? contractorCompletedCount
            : nonContractorCompletedCount}
          )
        </button>

        <button
          onClick={() => setActiveTab("rejected")}
          className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === "rejected"
              ? "border-red-600 text-red-600 dark:text-red-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
          }`}
        >
          Rejected (
          {userType === "contractor"
            ? contractorRejectedCount
            : nonContractorRejectedCount}
          )
        </button>
      </div>

      {/* Content */}
      {activeTab === "sent" ? (
        // Applied Jobs Tab
        <>
          {appliedJobsFromRedux.loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Loading applied jobs...
              </p>
            </div>
          ) : appliedJobsFromRedux.error ? (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 text-lg">
                {appliedJobsFromRedux.error}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 sm:space-y-4">
                {appliedJobsFromRedux.jobs.length > 0 ? (
                  appliedJobsFromRedux.jobs.map((enquiry: any) => {
                    const job = enquiry.job || {};
                    const jobId = job.id || job._id || enquiry.enquiryId || "";
                    const workTitle =
                      job.workTitle || job.jobTitle || job.title || "Job";
                    const postedBy =
                      enquiry.postedBy?.fullName ||
                      job.createdBy?.fullName ||
                      "Contractor";
                    const location = job.location?.address
                      ? job.location.address
                      : job.location?.city
                        ? `${job.location.city}, ${job.location.state}`
                        : "Not specified";
                    const appliedDate = enquiry.appliedAt;
                    const formattedDate = appliedDate
                      ? new Date(appliedDate).toLocaleDateString()
                      : "";
                    const status = enquiry.status || "pending";
                    const statusLabel =
                      status === "completed"
                        ? "Completed"
                        : status === "accepted"
                          ? "Accepted"
                          : status === "rejected"
                            ? "Rejected"
                            : "Pending";

                    return (
                      <div
                        key={jobId}
                        className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                              {workTitle}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Posted by {postedBy}
                            </p>
                          </div>
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap ${
                              status === "accepted"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                                : status === "rejected"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
                            }`}
                          >
                            {statusLabel}
                          </span>
                        </div>

                        <div className="mt-3 space-y-1.5 text-sm">
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="text-gray-500 dark:text-gray-400">
                              Location:
                            </span>{" "}
                            {location}
                          </p>
                          {formattedDate && (
                            <p className="text-gray-700 dark:text-gray-300">
                              <span className="text-gray-500 dark:text-gray-400">
                                Applied:
                              </span>{" "}
                              {formattedDate}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                          >
                            View Details
                          </button>
                          {status === "pending" && (
                            <button
                              type="button"
                              className="px-3 py-1.5 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold"
                            >
                              Withdraw
                            </button>
                          )}
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
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      No jobs applied yet.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      ) : userType === "contractor" ? (
        // Contractor Received Enquiries (from posted jobs)
        <>
          {contractorJobsLoading || jobEnquiriesFromRedux.loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Loading enquiries...
              </p>
            </div>
          ) : jobEnquiriesFromRedux.error ? (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 text-lg">
                {jobEnquiriesFromRedux.error}
              </p>
            </div>
          ) : (
            <>
              {hasVisibleContractorEnquiries ? (
                contractorJobs.map((job: any) => {
                  const jobId = job.id || job._id;
                  const jobEnquiries = contractorEnquiriesByJob[jobId] || [];
                  const workTitle = job.workTitle || job.jobTitle || "Job";

                  if (jobEnquiries.length === 0) {
                    return null;
                  }

                  return (
                    <div
                      key={jobId}
                      className="mb-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
                    >
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                        Applications for: {workTitle}
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                        {jobEnquiries.map((enquiry: any, idx: number) => {
                          const applicantDetails =
                            enquiry.userDetails || enquiry.userId || {};
                          const applicantName =
                            applicantDetails.fullName ||
                            enquiry.applicant?.fullName ||
                            "User";
                          const applicantEmail =
                            applicantDetails.email || "Not provided";
                          const applicantPhone =
                            applicantDetails.mobile ||
                            applicantDetails.phone ||
                            "Not provided";
                          const applicantPhoneDigits = String(
                            applicantPhone,
                          ).replace(/\D/g, "");
                          const hasPhoneNumber =
                            applicantPhoneDigits.length > 0;
                          const whatsappMessage = encodeURIComponent(
                            `Hello ${applicantName}, I reviewed your request for ${workTitle}.`,
                          );
                          const applicantRating =
                            applicantDetails.rating !== undefined &&
                            applicantDetails.rating !== null
                              ? applicantDetails.rating
                              : "N/A";
                          const applicantType =
                            applicantDetails.userType ||
                            enquiry.applicant?.userType ||
                            "Not specified";
                          const message =
                            enquiry.message || enquiry.requestMessage || "";
                          const enquiryId =
                            enquiry.id || enquiry._id || `${jobId}-${idx}`;
                          const baseStatus = enquiry.status || "pending";
                          const status =
                            requestStatusMap[enquiryId] || baseStatus;
                          const enquiryJobStatus = String(
                            enquiry.jobId?.status || "",
                          ).toLowerCase();
                          const listJobStatus = String(
                            job.status || "",
                          ).toLowerCase();
                          const isJobCompleted =
                            status === "completed" ||
                            enquiryJobStatus === "completed" ||
                            listJobStatus === "completed" ||
                            Boolean(completedJobMap[jobId]);
                          const reviewTargetUserId =
                            typeof enquiry.userId === "string"
                              ? enquiry.userId
                              : enquiry.userId?._id ||
                                enquiry.userDetails?._id ||
                                "";

                          return (
                            <div
                              key={enquiryId}
                              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-4 h-full"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                                    {applicantName}
                                  </h4>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {String(applicantType).replace("_", " ")}
                                  </p>
                                </div>
                                <span
                                  className={`text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap ${
                                    isJobCompleted
                                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                                      : status === "accepted"
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                                        : status === "rejected"
                                          ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
                                  }`}
                                >
                                  {isJobCompleted
                                    ? "Completed"
                                    : status === "accepted"
                                    ? "Accepted"
                                      : status === "rejected"
                                        ? "Rejected"
                                        : "Pending"}
                                </span>
                              </div>

                              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <p>
                                  <span className="text-gray-500 dark:text-gray-400">
                                    Email:
                                  </span>{" "}
                                  {applicantEmail}
                                </p>
                                <p>
                                  <span className="text-gray-500 dark:text-gray-400">
                                    Phone:
                                  </span>{" "}
                                  {hasPhoneNumber ? (
                                    <span className="inline-flex items-center gap-2">
                                      <a
                                        href={`tel:${applicantPhoneDigits}`}
                                        className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                                        aria-label={`Call ${applicantName}`}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-3.5 w-3.5"
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                        >
                                          <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.2 11.2 0 0 0 3.52.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.85 21 3 13.15 3 3a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.38.56 3.52a1 1 0 0 1-.24 1z" />
                                        </svg>
                                      </a>
                                      <a
                                        href={`https://wa.me/${applicantPhoneDigits}?text=${whatsappMessage}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                                        aria-label={`WhatsApp ${applicantName}`}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-3.5 w-3.5"
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                        >
                                          <path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.52 0 .2 5.32.2 11.88c0 2.1.55 4.15 1.6 5.95L0 24l6.34-1.67a11.83 11.83 0 0 0 5.74 1.47h.01c6.55 0 11.87-5.32 11.88-11.88a11.8 11.8 0 0 0-3.45-8.44zm-8.44 18.3h-.01a9.8 9.8 0 0 1-4.99-1.37l-.36-.21-3.76.99 1-3.66-.24-.38a9.83 9.83 0 0 1-1.5-5.25c0-5.45 4.43-9.88 9.88-9.88 2.64 0 5.11 1.03 6.98 2.9a9.82 9.82 0 0 1 2.9 6.98c0 5.45-4.43 9.88-9.88 9.88zm5.42-7.4c-.3-.15-1.78-.88-2.05-.98-.28-.1-.48-.15-.68.15s-.78.98-.95 1.18c-.18.2-.35.22-.65.08-.3-.15-1.26-.46-2.4-1.47-.88-.78-1.47-1.74-1.65-2.04-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.68-1.63-.93-2.23-.25-.6-.5-.52-.68-.53h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5 0 1.48 1.08 2.9 1.23 3.1.15.2 2.11 3.22 5.12 4.52.72.31 1.28.5 1.72.64.72.23 1.37.2 1.89.12.58-.09 1.78-.73 2.03-1.44.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35z" />
                                        </svg>
                                      </a>
                                      <a
                                        href={`tel:${applicantPhoneDigits}`}
                                        className="font-semibold text-green-700 dark:text-green-300 hover:underline"
                                      >
                                        {applicantPhone}
                                      </a>
                                    </span>
                                  ) : (
                                    applicantPhone
                                  )}
                                </p>
                                <p>
                                  <span className="text-gray-500 dark:text-gray-400">
                                    Rating:
                                  </span>{" "}
                                  {applicantRating}
                                </p>
                                <p>
                                  <span className="text-gray-500 dark:text-gray-400">
                                    Type:
                                  </span>{" "}
                                  {String(applicantType).replace("_", " ")}
                                </p>
                              </div>

                              {message && (
                                <div className="mt-3 rounded-lg border border-blue-100 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-950/30 p-3">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-3.5 h-3.5"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                    >
                                      <path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                                    </svg>
                                    Request Message
                                  </p>
                                  <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white leading-relaxed">
                                    {message}
                                  </p>
                                </div>
                              )}

                              <div className="mt-4 flex flex-wrap gap-2">
                                {activeTab === "received" && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        openDecisionConfirm(
                                          enquiryId,
                                          "accepted",
                                          applicantName,
                                        )
                                      }
                                      className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold disabled:opacity-60 inline-flex items-center gap-1.5"
                                      disabled={status !== "pending"}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-3.5 h-3.5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.25 7.313a1 1 0 0 1-1.422 0L3.29 9.27a1 1 0 0 1 1.414-1.415l4.045 4.046 6.54-6.597a1 1 0 0 1 1.415-.013z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      Accept
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        openDecisionConfirm(
                                          enquiryId,
                                          "rejected",
                                          applicantName,
                                        )
                                      }
                                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold disabled:opacity-60 inline-flex items-center gap-1.5"
                                      disabled={status !== "pending"}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-3.5 h-3.5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M4.293 4.293a1 1 0 0 1 1.414 0L10 8.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 0 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 0-1.414z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                      Reject
                                    </button>
                                  </>
                                )}
                                {(activeTab === "accepted" || activeTab === "completed") && (
                                  <>
                                    {activeTab === "accepted" && !isJobCompleted && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleCompleteJob(jobId, enquiryId)
                                        }
                                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-60"
                                        disabled={Boolean(
                                          jobCompletionFromRedux.loadingByJobId[
                                            jobId
                                          ],
                                        )}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="w-3.5 h-3.5"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.707-9.707a1 1 0 0 0-1.414-1.414L9 10.172 7.707 8.879a1 1 0 1 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                        {jobCompletionFromRedux.loadingByJobId[
                                          jobId
                                        ]
                                          ? "Completing..."
                                          : "Complete"}
                                      </button>
                                    )}
                                    {reviewTargetUserId && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          openFeedbackModal(
                                            jobId,
                                            reviewTargetUserId,
                                            applicantName,
                                          )
                                        }
                                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold inline-flex items-center gap-1.5"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="w-3.5 h-3.5"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.01 3.11a1 1 0 0 0 .95.69h3.27c.969 0 1.371 1.24.588 1.81l-2.645 1.922a1 1 0 0 0-.364 1.118l1.01 3.11c.3.922-.755 1.688-1.539 1.118l-2.645-1.922a1 1 0 0 0-1.176 0l-2.645 1.922c-.783.57-1.838-.196-1.539-1.118l1.01-3.11a1 1 0 0 0-.364-1.118L2.23 8.537c-.783-.57-.38-1.81.588-1.81h3.27a1 1 0 0 0 .95-.69l1.01-3.11z" />
                                        </svg>
                                        Feedback
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {activeTab === "accepted"
                      ? "No accepted enquiries yet."
                      : activeTab === "completed"
                        ? "No completed enquiries yet."
                      : activeTab === "rejected"
                        ? "No rejected enquiries yet."
                        : "No enquiry received."}
                  </p>
                </div>
              )}
            </>
          )}
        </>
      ) : usersLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Loading requests...
          </p>
        </div>
      ) : usersError ? (
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400 text-lg">{usersError}</p>
        </div>
      ) : (
        // Received Requests Tab
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
                        {request.partyType.replace("_", " ")} •{" "}
                        {request.location}
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
                      {status === "pending"
                        ? "Pending"
                        : status === "accepted"
                          ? "Accepted"
                          : "Rejected"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-3">
                    {request.message}
                  </p>

                  {request.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {request.skills
                        .slice(0, 5)
                        .map((skill: string, idx: number) => (
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
                    {activeTab === "received" ? (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            openDecisionConfirm(
                              request.id,
                              "accepted",
                              request.partyName,
                            )
                          }
                          className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-semibold disabled:opacity-60"
                          disabled={status !== "pending"}
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            openDecisionConfirm(
                              request.id,
                              "rejected",
                              request.partyName,
                            )
                          }
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold disabled:opacity-60"
                          disabled={status !== "pending"}
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                        >
                          Message
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                        >
                          View Status
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold"
                        >
                          Withdraw
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                        >
                          Message
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {activeTab === "accepted"
                  ? "No accepted requests yet."
                  : activeTab === "completed"
                    ? "No completed requests yet."
                  : activeTab === "rejected"
                    ? "No rejected requests yet."
                    : "No pending requests received."}
              </p>
            </div>
          )}
        </div>
      )}

      {confirmAction && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setConfirmAction(null);
              setRejectReason("");
            }
          }}
        >
          <div className="w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-xl">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Confirm{" "}
              {confirmAction.decision === "accepted" ? "Accept" : "Reject"}
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to{" "}
              {confirmAction.decision === "accepted" ? "accept" : "reject"} this
              request
              {confirmAction.label ? ` from ${confirmAction.label}` : ""}?
            </p>

            {confirmAction.decision === "accepted" && (
              <div className="mt-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-3">
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                  Warning
                </p>
                <p className="mt-1 text-sm text-amber-900 dark:text-amber-200">
                  After accept, you will be responsible for the work and
                  applicable penalties as per agreement.
                </p>
              </div>
            )}

            {confirmAction.decision === "rejected" && (
              <div className="mt-3">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Reject Reason (optional)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  placeholder="Reason likh sakte hain, optional hai..."
                  className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            )}

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmAction(null);
                  setRejectReason("");
                }}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold"
                disabled={Boolean(
                  confirmAction &&
                  (enquiryRejectionFromRedux.loadingByEnquiryId[
                    confirmAction.id
                  ] ||
                    enquiryAcceptanceFromRedux.loadingByEnquiryId[
                      confirmAction.id
                    ]),
                )}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecision}
                className={`px-4 py-2 rounded-lg text-white text-sm font-semibold ${
                  confirmAction.decision === "accepted"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                disabled={Boolean(
                  confirmAction &&
                  (enquiryRejectionFromRedux.loadingByEnquiryId[
                    confirmAction.id
                  ] ||
                    enquiryAcceptanceFromRedux.loadingByEnquiryId[
                      confirmAction.id
                    ]),
                )}
              >
                {confirmAction.decision === "accepted" &&
                enquiryAcceptanceFromRedux.loadingByEnquiryId[confirmAction.id]
                  ? "Accepting..."
                  : confirmAction.decision === "rejected" &&
                      enquiryRejectionFromRedux.loadingByEnquiryId[
                        confirmAction.id
                      ]
                    ? "Rejecting..."
                    : "OK"}
              </button>
            </div>
          </div>
        </div>
      )}

      {feedbackModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeFeedbackModal();
            }
          }}
        >
          <div className="w-full max-w-lg rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-xl">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Give Feedback to {feedbackModal.userName}
            </h3>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              Rate the experience on each parameter and share a short feedback
              note.
            </p>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderStarRating(
                "Overall Rating",
                feedbackForm.rating,
                (nextValue) =>
                  setFeedbackForm((prev) => ({ ...prev, rating: nextValue })),
              )}
              {renderStarRating(
                "Work Quality",
                feedbackForm.ratingDetails.workQuality,
                (nextValue) =>
                  setFeedbackForm((prev) => ({
                    ...prev,
                    ratingDetails: {
                      ...prev.ratingDetails,
                      workQuality: nextValue,
                    },
                  })),
              )}
              {renderStarRating(
                "Communication",
                feedbackForm.ratingDetails.communication,
                (nextValue) =>
                  setFeedbackForm((prev) => ({
                    ...prev,
                    ratingDetails: {
                      ...prev.ratingDetails,
                      communication: nextValue,
                    },
                  })),
              )}
              {renderStarRating(
                "Timeliness",
                feedbackForm.ratingDetails.timeliness,
                (nextValue) =>
                  setFeedbackForm((prev) => ({
                    ...prev,
                    ratingDetails: {
                      ...prev.ratingDetails,
                      timeliness: nextValue,
                    },
                  })),
              )}
              <div className="sm:col-span-2">
                {renderStarRating(
                  "Professionalism",
                  feedbackForm.ratingDetails.professionalism,
                  (nextValue) =>
                    setFeedbackForm((prev) => ({
                      ...prev,
                      ratingDetails: {
                        ...prev.ratingDetails,
                        professionalism: nextValue,
                      },
                    })),
                  "Tip: include quality and behavior details in feedback text below.",
                )}
              </div>
            </div>

            <div className="mt-3">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Feedback
              </label>
              <textarea
                value={feedbackForm.feedback}
                onChange={(e) =>
                  setFeedbackForm((prev) => ({
                    ...prev,
                    feedback: e.target.value,
                  }))
                }
                rows={4}
                placeholder="Write fresh feedback here..."
                autoComplete="off"
                className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeFeedbackModal}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold"
                disabled={reviewSubmissionFromRedux.loading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitFeedback}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  reviewSubmissionFromRedux.loading ||
                  !feedbackForm.feedback.trim() ||
                  feedbackForm.rating === 0 ||
                  feedbackForm.ratingDetails.workQuality === 0 ||
                  feedbackForm.ratingDetails.communication === 0 ||
                  feedbackForm.ratingDetails.timeliness === 0 ||
                  feedbackForm.ratingDetails.professionalism === 0
                }
              >
                {reviewSubmissionFromRedux.loading
                  ? "Submitting..."
                  : "Submit Feedback"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
