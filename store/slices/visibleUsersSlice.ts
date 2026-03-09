import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiGet } from '@/lib/api-service';

type UserType = 'labour' | 'contractor' | 'sub_contractor';

interface VisibleUserApiItem {
  _id: string;
  fullName?: string;
  userType?: UserType;
  profilePhotoUrl?: string;
  companyLogoUrl?: string;
  businessName?: string;
  registrationNumber?: string;
  phoneNumber?: string;
  mobile?: string;
  email?: string;
  experience?: string;
  experienceRange?: string;
  teamSize?: string;
  rating?: number;
  completedJobs?: number;
  skills?: string[];
  workTypes?: string[];
  coverageArea?: string[];
  servicesOffered?: string[];
  serviceCategories?: string[];
  location?: string | { address?: string; city?: string; state?: string; pincode?: string; coordinates?: any };
  preferredWorkingHours?: string;
  status?: string;
  connectionStatus?: string;
  city?: string;
  state?: string;
}

interface VisibleUsersApiResponse {
  data?: {
    users?: VisibleUserApiItem[];
  };
  message?: string;
}

export interface VisibleUser extends VisibleUserApiItem {
  id: string;
  mobile: string;
  email: string;
  location: string;
  preferredWorkingHours: string;
  businessName: string;
  registrationNumber: string;
  experienceRange: string;
  teamSize: string;
  servicesOffered: string[];
  coverageArea: string[];
  workTypes: string[];
  completedJobs: number;
  rating: number;
  status: string;
  city: string;
  state?: string;
}

export interface VisibleUsersState {
  users: VisibleUser[];
  loading: boolean;
  error: string | null;
}

const initialState: VisibleUsersState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchVisibleUsers = createAsyncThunk(
  'visibleUsers/fetchVisibleUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGet<VisibleUsersApiResponse>('/api/users/visible');

      if (!response.success) {
        return rejectWithValue(response.message || response.error || 'Failed to fetch users');
      }

      const users = response.data?.data?.users || [];
      const mappedUsers: VisibleUser[] = users.map((item) => ({
        ...item,
        id: item._id,
        fullName: item.fullName || 'Unknown',
        mobile: item.phoneNumber || item.mobile || 'Not provided',
        email: item.email || 'Not provided',
        location:
          typeof item.location === 'string'
            ? item.location
            : item.location?.address || 'Not specified',
        city: typeof item.location === 'string' ? 'Not specified' : item.location?.city || 'Not specified',
        preferredWorkingHours: item.preferredWorkingHours || 'Flexible',
        businessName: item.businessName || item.fullName || 'Business',
        registrationNumber: item.registrationNumber || 'Not available',
        experienceRange: item.experienceRange || item.experience || 'Not specified',
        teamSize: item.teamSize || 'Not specified',
        servicesOffered: item.servicesOffered || item.serviceCategories || [],
        coverageArea: item.coverageArea || [],
        workTypes: item.workTypes || [],
        completedJobs: item.completedJobs ?? 0,
        rating: item.rating ?? 0,
        status: item.status || item.connectionStatus || 'active',
        state: typeof item.location === 'string' ? 'Not specified' : item.location?.state || 'Not specified',
      }));

      return mappedUsers;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  }
);

const visibleUsersSlice = createSlice({
  name: 'visibleUsers',
  initialState,
  reducers: {
    clearVisibleUsersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVisibleUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisibleUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchVisibleUsers.rejected, (state, action) => {
        state.loading = false;
        state.users = [];
        state.error = action.payload as string;
      });
  },
});

export const { clearVisibleUsersError } = visibleUsersSlice.actions;
export default visibleUsersSlice.reducer;
