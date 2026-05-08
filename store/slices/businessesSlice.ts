import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { businessesApi } from '@/lib/api-endpoints';

export interface Business {
  id: string;
  enName: string;
  hiName: string;
  mrName: string;
  category: string;
}

interface BusinessesState {
  businesses: Business[];
  loading: boolean;
  loaded: boolean; // true once fetched — avoid duplicate calls
}

const initialState: BusinessesState = {
  businesses: [],
  loading: false,
  loaded: false,
};

export const fetchBusinesses = createAsyncThunk(
  'businesses/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    // If already loaded, skip API call
    const state = (getState() as { businesses: BusinessesState }).businesses;
    if (state.loaded) return state.businesses;

    const res = await businessesApi.getAll();
    if (res.success && res.data?.businesses) {
      return res.data.businesses as Business[];
    }
    return rejectWithValue('Failed to load businesses');
  }
);

const businessesSlice = createSlice({
  name: 'businesses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinesses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBusinesses.fulfilled, (state, action) => {
        state.businesses = action.payload as Business[];
        state.loading = false;
        state.loaded = true;
      })
      .addCase(fetchBusinesses.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default businessesSlice.reducer;

/**
 * Helper: given an array of business IDs, return all matching names joined
 * Used for text search across all languages
 */
export const businessIdsToSearchText = (ids: string[], businesses: Business[]): string => {
  return ids
    .map((id) => {
      const b = businesses.find((biz) => biz.id === id);
      return b ? `${b.enName} ${b.hiName} ${b.mrName} ${b.category}` : '';
    })
    .join(' ')
    .toLowerCase();
};

/**
 * Helper: get display label for a business ID
 */
export const businessIdToLabel = (id: string, businesses: Business[]): string => {
  const b = businesses.find((biz) => biz.id === id);
  return b ? `${b.enName} / ${b.hiName}` : id;
};
