import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { inquiryApi } from "@/lib/api-endpoints";

export interface InquiryFormData {
  fullName: string;
  email: string;
  mobile: string;
  subject: string;
  message: string;
}

export interface InquiryState {
  loading: boolean;
  success: boolean;
  error: string | null;
  message: string | null;
  submittedData: InquiryFormData | null;
}

const initialState: InquiryState = {
  loading: false,
  success: false,
  error: null,
  message: null,
  submittedData: null,
};

// Async thunk for submitting inquiry
export const submitInquiry = createAsyncThunk(
  "inquiry/submitInquiry",
  async (formData: InquiryFormData, { rejectWithValue }) => {
    try {
      // Use centralized API service
      const response = await inquiryApi.submit({
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        subject: formData.subject,
        message: formData.message,
      });

      if (!response.success) {
        return rejectWithValue(response.error || "Failed to submit inquiry");
      }

      return response.data;
    } catch (err) {
      const error = err instanceof Error ? err.message : "An error occurred";
      return rejectWithValue(error);
    }
  }
);

const inquirySlice = createSlice({
  name: "inquiry",
  initialState,
  reducers: {
    // Reset inquiry state
    resetInquiryState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = null;
      state.submittedData = null;
    },
    // Clear error message
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Pending state
      .addCase(submitInquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      // Fulfilled state
      .addCase(submitInquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || "Inquiry submitted successfully!";
        state.submittedData = action.payload?.data || null;
        state.error = null;
      })
      // Rejected state
      .addCase(submitInquiry.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
        state.message = null;
      });
  },
});

export const { resetInquiryState, clearError } = inquirySlice.actions;
export default inquirySlice.reducer;
