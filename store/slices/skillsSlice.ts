import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { skillsApi } from '@/lib/api-endpoints';

export interface Skill {
  id: string;
  enName: string;
  hiName: string;
  mrName: string;
}

interface SkillsState {
  skills: Skill[];
  loading: boolean;
  loaded: boolean; // true once fetched — avoid duplicate calls
}

const initialState: SkillsState = {
  skills: [],
  loading: false,
  loaded: false,
};

export const fetchSkills = createAsyncThunk(
  'skills/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    // If already loaded, skip API call
    const state = (getState() as { skills: SkillsState }).skills;
    if (state.loaded) return state.skills;

    const res = await skillsApi.getAll();
    if (res.success && res.data?.skills) {
      return res.data.skills as Skill[];
    }
    return rejectWithValue('Failed to load skills');
  }
);

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.skills = action.payload as Skill[];
        state.loading = false;
        state.loaded = true;
      })
      .addCase(fetchSkills.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default skillsSlice.reducer;

/**
 * Helper: given an array of skill IDs, return all matching names joined
 * Used for text search across all languages
 */
export const skillIdsToSearchText = (ids: string[], skills: Skill[]): string => {
  return ids
    .map((id) => {
      const s = skills.find((sk) => sk.id === id);
      return s ? `${s.enName} ${s.hiName} ${s.mrName}` : '';
    })
    .join(' ')
    .toLowerCase();
};

/**
 * Helper: get display label for a skill ID
 */
export const skillIdToLabel = (id: string, skills: Skill[]): string => {
  const s = skills.find((sk) => sk.id === id);
  return s ? `${s.enName} / ${s.hiName}` : id;
};
