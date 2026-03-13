import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiPost, apiGet } from "@/lib/api-service";

const JOBS_SERVICE_BASE_URL =
  process.env.NEXT_PUBLIC_JOBS_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface AppliedJobsState {
  jobIds: string[];
  jobs: any[];
  loading: boolean;
  error: string | null;
}

export interface JobEnquiriesState {
  enquiries: Record<string, any[]>; // jobId -> array of enquiries
  loading: boolean;
  error: string | null;
}

export interface ReceivedRequestsState {
  requests: any[];
  loading: boolean;
  error: string | null;
}

export interface JobHistoryDashboardState {
  entries: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  loading: boolean;
  error: string | null;
}

export interface JobEnquiryState {
  loading: boolean;
  success: boolean;
  error: string | null;
  lastSubmittedJobId: string | null;
  jobActivation: {
    loadingByJobId: Record<string, boolean>;
    errorByJobId: Record<string, string | null>;
  };
  enquiryRejection: {
    loadingByEnquiryId: Record<string, boolean>;
    errorByEnquiryId: Record<string, string | null>;
  };
  enquiryAcceptance: {
    loadingByEnquiryId: Record<string, boolean>;
    errorByEnquiryId: Record<string, string | null>;
  };
  jobCompletion: {
    loadingByJobId: Record<string, boolean>;
    errorByJobId: Record<string, string | null>;
  };
  reviewSubmission: {
    loading: boolean;
    error: string | null;
  };
  appliedJobs: AppliedJobsState;
  jobEnquiries: JobEnquiriesState;
  receivedRequests: ReceivedRequestsState;
  jobHistoryDashboard: JobHistoryDashboardState;
}

const initialState: JobEnquiryState = {
  loading: false,
  success: false,
  error: null,
  lastSubmittedJobId: null,
  jobActivation: {
    loadingByJobId: {},
    errorByJobId: {},
  },
  enquiryRejection: {
    loadingByEnquiryId: {},
    errorByEnquiryId: {},
  },
  enquiryAcceptance: {
    loadingByEnquiryId: {},
    errorByEnquiryId: {},
  },
  jobCompletion: {
    loadingByJobId: {},
    errorByJobId: {},
  },
  reviewSubmission: {
    loading: false,
    error: null,
  },
  appliedJobs: {
    jobIds: [],
    jobs: [],
    loading: false,
    error: null,
  },
  jobEnquiries: {
    enquiries: {},
    loading: false,
    error: null,
  },
  receivedRequests: {
    requests: [],
    loading: false,
    error: null,
  },
  jobHistoryDashboard: {
    entries: [],
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      pages: 0,
    },
    loading: false,
    error: null,
  },
};

export const submitJobEnquiry = createAsyncThunk(
  "jobEnquiry/submit",
  async ({ jobId, message }: { jobId: string; message: string }, { rejectWithValue }) => {
    const response = await apiPost(`/api/job-enquiries/${jobId}`, { message });
    if (!response.success) {
      return rejectWithValue(response.error || response.message || "Failed to send enquiry");
    }
    return { jobId, data: response.data };
  }
);

export const toggleJobActivation = createAsyncThunk(
  "jobEnquiry/toggleJobActivation",
  async (
    { jobId, currentVisibility }: { jobId: string; currentVisibility: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiPost(
        `/api/jobs/${jobId}/toggle-activation`,
        {},
        { baseUrl: JOBS_SERVICE_BASE_URL }
      );

      if (!response.success) {
        return rejectWithValue(response.error || response.message || "Failed to toggle job activation");
      }

      const data = response.data?.data || response.data || {};
      const visibility =
        typeof data.visibility === "boolean"
          ? data.visibility
          : typeof data.isActive === "boolean"
            ? data.isActive
            : !currentVisibility;

      return { jobId, visibility, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to toggle job activation";
      return rejectWithValue(errorMessage);
    }
  }
);

export const rejectJobEnquiry = createAsyncThunk(
  "jobEnquiry/rejectJobEnquiry",
  async (
    { enquiryId, reason }: { enquiryId: string; reason?: string },
    { rejectWithValue }
  ) => {
    try {
      const payload = reason && reason.trim() ? { reason: reason.trim() } : {};
      const response = await apiPost(
        `/api/job-enquiries/${enquiryId}/reject`,
        payload,
        { baseUrl: JOBS_SERVICE_BASE_URL }
      );

      if (!response.success) {
        return rejectWithValue(response.error || response.message || "Failed to reject enquiry");
      }

      return { enquiryId, reason: reason?.trim() || "", data: response.data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to reject enquiry";
      return rejectWithValue(errorMessage);
    }
  }
);

export const acceptJobEnquiry = createAsyncThunk(
  "jobEnquiry/acceptJobEnquiry",
  async ({ enquiryId }: { enquiryId: string }, { rejectWithValue }) => {
    try {
      const response = await apiPost(
        `/api/job-enquiries/${enquiryId}/accept`,
        {},
        { baseUrl: JOBS_SERVICE_BASE_URL }
      );

      if (!response.success) {
        return rejectWithValue(response.error || response.message || "Failed to accept enquiry");
      }

      return { enquiryId, data: response.data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to accept enquiry";
      return rejectWithValue(errorMessage);
    }
  }
);

export const completeJob = createAsyncThunk(
  "jobEnquiry/completeJob",
  async ({ jobId }: { jobId: string }, { rejectWithValue }) => {
    try {
      const response = await apiPost(
        `/api/jobs/${jobId}/complete`,
        {},
        { baseUrl: JOBS_SERVICE_BASE_URL }
      );

      if (!response.success) {
        return rejectWithValue(response.error || response.message || "Failed to complete job");
      }

      return { jobId, data: response.data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to complete job";
      return rejectWithValue(errorMessage);
    }
  }
);

export const submitUserReview = createAsyncThunk(
  "jobEnquiry/submitUserReview",
  async (
    {
      jobId,
      userId,
      rating,
      feedback,
      ratingDetails,
      attachments,
    }: {
      jobId: string;
      userId: string;
      rating: number;
      feedback: string;
      ratingDetails: {
        workQuality: number;
        communication: number;
        timeliness: number;
        professionalism: number;
      };
      attachments?: any[];
    },
    { rejectWithValue }
  ) => {
    try {
      const payload = {
        jobId,
        userId,
        rating,
        feedback,
        ratingDetails,
        attachments: attachments || [],
      };

      const response = await apiPost(
        `/api/user-reviews/submit`,
        payload,
        { baseUrl: JOBS_SERVICE_BASE_URL }
      );

      if (!response.success) {
        return rejectWithValue(response.error || response.message || "Failed to submit feedback");
      }

      return { data: response.data, payload };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit feedback";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchAppliedJobs = createAsyncThunk(
  "jobEnquiry/fetchAppliedJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGet(`/api/job-enquiries/applied/jobs?page=1&limit=100`);
      if (!response.success) {
        return rejectWithValue(response.error || response.message || "Failed to fetch applied jobs");
      }

      const data = response.data?.data || response.data || {};
      const appliedJobs = data.appliedJobs || data.jobs || [];
      const jobIds = appliedJobs
        .map((enquiry: any) => {
          return (
            enquiry.jobId ||
            enquiry.job?.id ||
            enquiry.job?._id ||
            enquiry.jobDetails?.id ||
            enquiry.jobDetails?._id ||
            ""
          );
        })
        .map((id: any) => String(id))
        .filter(Boolean);

      return { jobs: appliedJobs, jobIds };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch applied jobs";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchJobEnquiries = createAsyncThunk(
  "jobEnquiry/fetchJobEnquiries",
  async ({ jobId }: { jobId: string }, { rejectWithValue }) => {
    try {
      const response = await apiGet(`/api/job-enquiries/job/${jobId}`);
      if (!response.success) {
        return rejectWithValue(response.error || response.message || "Failed to fetch job enquiries");
      }

      const data = response.data?.data || response.data || {};
      const enquiries = data.enquiries || data.data || data || [];

      return { jobId, enquiries: Array.isArray(enquiries) ? enquiries : [] };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch job enquiries";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchReceivedRequests = createAsyncThunk(
  "jobEnquiry/fetchReceivedRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGet(`/api/job-history/smart/dashboard?limit=100`);
      if (!response.success) {
        return rejectWithValue(response.error || response.message || "Failed to fetch received requests");
      }

      const data = response.data?.data || response.data || {};
      const requests = data.requests || data.data || data || [];

      return Array.isArray(requests) ? requests : [];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch received requests";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchJobHistoryDashboard = createAsyncThunk(
  "jobEnquiry/fetchJobHistoryDashboard",
  async (
    { page = 1, limit = 20 }: { page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await apiGet(`/api/job-history/smart/dashboard?page=${page}&limit=${limit}`);
      if (!response.success) {
        return rejectWithValue(response.error || response.message || "Failed to fetch job history");
      }

      const data = response.data || {};
      const entries = data.data || [];
      const pagination = data.pagination || {
        page,
        limit,
        total: Array.isArray(entries) ? entries.length : 0,
        pages: 1,
      };

      return {
        entries: Array.isArray(entries) ? entries : [],
        pagination: {
          page: pagination.page || page,
          limit: pagination.limit || limit,
          total: pagination.total || 0,
          pages: pagination.pages || 0,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch job history";
      return rejectWithValue(errorMessage);
    }
  }
);

const jobEnquirySlice = createSlice({
  name: "jobEnquiry",
  initialState,
  reducers: {
    resetJobEnquiryState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.lastSubmittedJobId = null;
    },
  },
  extraReducers: (builder) => {
    // submitJobEnquiry handlers
    builder
      .addCase(submitJobEnquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitJobEnquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.lastSubmittedJobId = action.payload.jobId;
        // Add jobId to appliedJobs list if not already there
        if (!state.appliedJobs.jobIds.includes(action.payload.jobId)) {
          state.appliedJobs.jobIds.push(action.payload.jobId);
        }
      })
      .addCase(submitJobEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(toggleJobActivation.pending, (state, action) => {
        const jobId = action.meta.arg.jobId;
        state.jobActivation.loadingByJobId[jobId] = true;
        state.jobActivation.errorByJobId[jobId] = null;
      })
      .addCase(toggleJobActivation.fulfilled, (state, action) => {
        const jobId = action.payload.jobId;
        state.jobActivation.loadingByJobId[jobId] = false;
        state.jobActivation.errorByJobId[jobId] = null;
      })
      .addCase(toggleJobActivation.rejected, (state, action) => {
        const jobId = action.meta.arg.jobId;
        state.jobActivation.loadingByJobId[jobId] = false;
        state.jobActivation.errorByJobId[jobId] = action.payload as string;
      });

    builder
      .addCase(rejectJobEnquiry.pending, (state, action) => {
        const enquiryId = action.meta.arg.enquiryId;
        state.enquiryRejection.loadingByEnquiryId[enquiryId] = true;
        state.enquiryRejection.errorByEnquiryId[enquiryId] = null;
      })
      .addCase(rejectJobEnquiry.fulfilled, (state, action) => {
        const enquiryId = action.payload.enquiryId;
        state.enquiryRejection.loadingByEnquiryId[enquiryId] = false;
        state.enquiryRejection.errorByEnquiryId[enquiryId] = null;
      })
      .addCase(rejectJobEnquiry.rejected, (state, action) => {
        const enquiryId = action.meta.arg.enquiryId;
        state.enquiryRejection.loadingByEnquiryId[enquiryId] = false;
        state.enquiryRejection.errorByEnquiryId[enquiryId] = action.payload as string;
      });

    builder
      .addCase(acceptJobEnquiry.pending, (state, action) => {
        const enquiryId = action.meta.arg.enquiryId;
        state.enquiryAcceptance.loadingByEnquiryId[enquiryId] = true;
        state.enquiryAcceptance.errorByEnquiryId[enquiryId] = null;
      })
      .addCase(acceptJobEnquiry.fulfilled, (state, action) => {
        const enquiryId = action.payload.enquiryId;
        state.enquiryAcceptance.loadingByEnquiryId[enquiryId] = false;
        state.enquiryAcceptance.errorByEnquiryId[enquiryId] = null;
      })
      .addCase(acceptJobEnquiry.rejected, (state, action) => {
        const enquiryId = action.meta.arg.enquiryId;
        state.enquiryAcceptance.loadingByEnquiryId[enquiryId] = false;
        state.enquiryAcceptance.errorByEnquiryId[enquiryId] = action.payload as string;
      });

    builder
      .addCase(completeJob.pending, (state, action) => {
        const jobId = action.meta.arg.jobId;
        state.jobCompletion.loadingByJobId[jobId] = true;
        state.jobCompletion.errorByJobId[jobId] = null;
      })
      .addCase(completeJob.fulfilled, (state, action) => {
        const jobId = action.payload.jobId;
        state.jobCompletion.loadingByJobId[jobId] = false;
        state.jobCompletion.errorByJobId[jobId] = null;
      })
      .addCase(completeJob.rejected, (state, action) => {
        const jobId = action.meta.arg.jobId;
        state.jobCompletion.loadingByJobId[jobId] = false;
        state.jobCompletion.errorByJobId[jobId] = action.payload as string;
      });

    builder
      .addCase(submitUserReview.pending, (state) => {
        state.reviewSubmission.loading = true;
        state.reviewSubmission.error = null;
      })
      .addCase(submitUserReview.fulfilled, (state) => {
        state.reviewSubmission.loading = false;
        state.reviewSubmission.error = null;
      })
      .addCase(submitUserReview.rejected, (state, action) => {
        state.reviewSubmission.loading = false;
        state.reviewSubmission.error = action.payload as string;
      });

    // fetchAppliedJobs handlers
    builder
      .addCase(fetchAppliedJobs.pending, (state) => {
        state.appliedJobs.loading = true;
        state.appliedJobs.error = null;
      })
      .addCase(fetchAppliedJobs.fulfilled, (state, action) => {
        state.appliedJobs.loading = false;
        state.appliedJobs.jobIds = action.payload.jobIds;
        state.appliedJobs.jobs = action.payload.jobs;
      })
      .addCase(fetchAppliedJobs.rejected, (state, action) => {
        state.appliedJobs.loading = false;
        state.appliedJobs.error = action.payload as string;
      });

    // fetchJobEnquiries handlers
    builder
      .addCase(fetchJobEnquiries.pending, (state) => {
        state.jobEnquiries.loading = true;
        state.jobEnquiries.error = null;
      })
      .addCase(fetchJobEnquiries.fulfilled, (state, action) => {
        state.jobEnquiries.loading = false;
        state.jobEnquiries.enquiries[action.payload.jobId] = action.payload.enquiries;
      })
      .addCase(fetchJobEnquiries.rejected, (state, action) => {
        state.jobEnquiries.loading = false;
        state.jobEnquiries.error = action.payload as string;
      });

    // fetchReceivedRequests handlers
    builder
      .addCase(fetchReceivedRequests.pending, (state) => {
        state.receivedRequests.loading = true;
        state.receivedRequests.error = null;
      })
      .addCase(fetchReceivedRequests.fulfilled, (state, action) => {
        state.receivedRequests.loading = false;
        state.receivedRequests.requests = action.payload;
      })
      .addCase(fetchReceivedRequests.rejected, (state, action) => {
        state.receivedRequests.loading = false;
        state.receivedRequests.error = action.payload as string;
      });

    // fetchJobHistoryDashboard handlers
    builder
      .addCase(fetchJobHistoryDashboard.pending, (state) => {
        state.jobHistoryDashboard.loading = true;
        state.jobHistoryDashboard.error = null;
      })
      .addCase(fetchJobHistoryDashboard.fulfilled, (state, action) => {
        state.jobHistoryDashboard.loading = false;
        state.jobHistoryDashboard.entries = action.payload.entries;
        state.jobHistoryDashboard.pagination = action.payload.pagination;
      })
      .addCase(fetchJobHistoryDashboard.rejected, (state, action) => {
        state.jobHistoryDashboard.loading = false;
        state.jobHistoryDashboard.error = action.payload as string;
      });
  },
});

export const { resetJobEnquiryState } = jobEnquirySlice.actions;
export default jobEnquirySlice.reducer;
