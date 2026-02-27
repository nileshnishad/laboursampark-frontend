import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  showLoadingToast,
  showSuccessToast,
  showErrorToast,
  dismissToast,
} from '@/lib/toast-utils';
import { apiPost, setToken as saveToken, clearToken as removeToken } from '@/lib/api-service';

export interface ContractorRegisterPayload {
  userType: string;
  fullName: string;
  businessName: string;
  mobile: string;
  email: string;
  password: string;
  location: string;
  registrationNumber?: string;
  businessTypes: string[];
  experienceRange: string;
  teamSize: string;
  servicesOffered: string[];
  coverageArea: string[];
  about: string;
  businessLicenseUrl: string | null;
  companyLogoUrl: string | null;
  termsAgreed: boolean;
}

export interface LabourRegisterPayload {
  userType: string;
  fullName: string;
  age: number | null;
  mobile: string;
  email: string;
  password: string;
  location: string;
  experience: string;
  skills: string[];
  workTypes: string[];
  preferredWorkingHours: string;
  bio: string;
  profilePhotoUrl: string | null;
  termsAgreed: boolean;
}

export interface LoginPayload {
  email?: string;
  mobile?: string;
  password?: string;
  otp?: string;
  userType: 'labour' | 'contractor';
}

export interface AuthState {
  loading: boolean;
  success: boolean;
  error: string | null;
  message: string | null;
  user: any | null;
  token: string | null;
}

const initialState: AuthState = {
  loading: false,
  success: false,
  error: null,
  message: null,
  user: null,
  token: null,
};

/**
 * Async thunk for contractor registration
 */
export const registerContractor = createAsyncThunk(
  'auth/registerContractor',
  async (payload: ContractorRegisterPayload, { rejectWithValue }) => {
    try {
      const response = await apiPost('/auth/register', payload, {
        includeToken: false,
      });

      if (response.success) {
        // Save token if provided
        if (response.data?.token) {
          saveToken(response.data.token);
        }
        return response.data;
      } else {
        return rejectWithValue(
          response.error || 'Registration failed'
        );
      }
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'An error occurred during registration'
      );
    }
  }
);

/**
 * Async thunk for labour registration
 */
export const registerLabour = createAsyncThunk(
  'auth/registerLabour',
  async (payload: LabourRegisterPayload, { rejectWithValue }) => {
    try {
      const response = await apiPost('/auth/register', payload, {
        includeToken: false,
      });

      if (response.success) {
        // Save token if provided
        if (response.data?.token) {
          saveToken(response.data.token);
        }
        return response.data;
      } else {
        return rejectWithValue(
          response.error || 'Registration failed'
        );
      }
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'An error occurred during registration'
      );
    }
  }
);

/**
 * Async thunk for user login
 */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await apiPost('/auth/login', payload, {
        includeToken: false,
      });
      if (response.success) {
        // Save token if provided
        if (response.data?.data.token) {
          saveToken(response.data?.data.token);
        }
        return response.data?.data;
      } else {
        return rejectWithValue(
          response.error || 'Login failed'
        );
      }
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'An error occurred during login'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Reset auth state
     */
    resetAuthState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = null;
    },

    /**
     * Clear error
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Logout
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      removeToken();
    },

    /**
     * Set token
     */
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      saveToken(action.payload);
    },
  },
  extraReducers: (builder) => {
    /**
     * Register Contractor
     */
    builder
      .addCase(registerContractor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        showLoadingToast('Creating contractor account...');
      })
      .addCase(registerContractor.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload?.user || null;
        state.token = action.payload?.token || null;
        state.message = action.payload?.message || 'Registration successful!';
        dismissToast();
        showSuccessToast(
          action.payload?.message || 'Contractor registered successfully!',
          { autoClose: 3000 }
        );
      })
      .addCase(registerContractor.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
        dismissToast();
        showErrorToast(
          action.payload as string || 'Contractor registration failed!'
        );
      });

    /**
     * Register Labour
     */
    builder
      .addCase(registerLabour.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        showLoadingToast('Creating labour account...');
      })
      .addCase(registerLabour.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload?.user || null;
        state.token = action.payload?.token || null;
        state.message = action.payload?.message || 'Registration successful!';
        dismissToast();
        showSuccessToast(
          action.payload?.message || 'Labour registered successfully!',
          { autoClose: 3000 }
        );
      })
      .addCase(registerLabour.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
        dismissToast();
        showErrorToast(
          action.payload as string || 'Labour registration failed!'
        );
      });

    /**
     * Login User
     */
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        showLoadingToast('Signing in...');
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload?.user || null;
        state.token = action.payload?.token || null;
        state.message = action.payload?.message || 'Login successful!';
        dismissToast();
        showSuccessToast(
          action.payload?.message || 'Login successful!',
          { autoClose: 3000 }
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
        dismissToast();
        showErrorToast(
          action.payload as string || 'Login failed!'
        );
      });
  },
});

export const { resetAuthState, clearError, logout, setToken } = authSlice.actions;
export default authSlice.reducer;
